const mockLoggerWarn = jest.fn();
const mockLoggerInfo = jest.fn();

jest.mock("redis", () => ({
  createClient: jest.fn(() => ({ on: jest.fn() })),
}));

jest.mock("@/configs/logger.config", () => ({
  logger: { warn: mockLoggerWarn, info: mockLoggerInfo },
}));

interface MockClient {
  on: jest.Mock;
}

const setEnv = (): void => {
  process.env.NODE_ENV = "test";
  process.env.CLIENT_URL = "http://localhost:5173";
  process.env.REDIS_HOST = "myhost";
  process.env.REDIS_PORT = "1234";
};

const loadRedisConfig = (): MockClient => {
  jest.requireActual("@/configs/redis.config");

  const redisMock = jest.requireMock<{ createClient: jest.Mock }>("redis");
  return redisMock.createClient.mock.results[0]?.value as MockClient;
};

const getHandler = (client: MockClient, event: string): ((...args: unknown[]) => void) => {
  return client.on.mock.calls.find((call: [string, unknown]) => call[0] === event)?.[1] as (
    ...args: unknown[]
  ) => void;
};

describe("redis.config", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach((): void => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    setEnv();
    jest.resetModules();
    mockLoggerWarn.mockClear();
    mockLoggerInfo.mockClear();
  });

  afterEach((): void => {
    process.env = originalEnv;
  });

  it("should create a redis client with the correct URL", () => {
    loadRedisConfig();

    const redisMock = jest.requireMock<{ createClient: jest.Mock }>("redis");
    expect(redisMock.createClient).toHaveBeenCalledWith({ url: "redis://myhost:1234" });
  });

  it("should register error and ready handlers on the client", () => {
    const mockClient = loadRedisConfig();

    expect(mockClient.on).toHaveBeenCalledWith("error", expect.any(Function));
    expect(mockClient.on).toHaveBeenCalledWith("ready", expect.any(Function));
  });

  it("should log a warn with err, host and port on the first error", () => {
    const mockClient = loadRedisConfig();
    const errorHandler = getHandler(mockClient, "error");
    const testError: Error = new Error("connection failed");

    errorHandler(testError);

    expect(mockLoggerWarn).toHaveBeenCalledTimes(1);
    expect(mockLoggerWarn).toHaveBeenCalledWith(
      { err: testError, host: "myhost", port: "1234" },
      "Redis connection error. Further connection errors are silenced until the connection is restored."
    );
  });

  it("should log only one warn for consecutive errors", () => {
    const mockClient = loadRedisConfig();
    const errorHandler = getHandler(mockClient, "error");

    errorHandler(new Error("down 1"));
    errorHandler(new Error("down 2"));
    errorHandler(new Error("down 3"));

    expect(mockLoggerWarn).toHaveBeenCalledTimes(1);
  });

  it("should log info when ready fires after an error", () => {
    const mockClient = loadRedisConfig();
    const errorHandler = getHandler(mockClient, "error");
    const readyHandler = getHandler(mockClient, "ready");

    errorHandler(new Error("down"));
    readyHandler();

    expect(mockLoggerInfo).toHaveBeenCalledTimes(1);
    expect(mockLoggerInfo).toHaveBeenCalledWith(
      { host: "myhost", port: "1234" },
      "Redis connection restored."
    );
  });

  it("should not log when ready fires without a previous error", () => {
    const mockClient = loadRedisConfig();
    const readyHandler = getHandler(mockClient, "ready");

    readyHandler();

    expect(mockLoggerInfo).not.toHaveBeenCalled();
    expect(mockLoggerWarn).not.toHaveBeenCalled();
  });

  it("should warn again on a new error after the connection was restored", () => {
    const mockClient = loadRedisConfig();
    const errorHandler = getHandler(mockClient, "error");
    const readyHandler = getHandler(mockClient, "ready");

    errorHandler(new Error("down 1"));
    readyHandler();
    errorHandler(new Error("down 2"));

    expect(mockLoggerWarn).toHaveBeenCalledTimes(2);
    expect(mockLoggerInfo).toHaveBeenCalledTimes(1);
  });
});
