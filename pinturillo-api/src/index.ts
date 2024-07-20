import { createServer } from "node:http";
import { Server } from "socket.io";

import app from "@src/app";
import { configs } from "@src/configs";
import { getRedis, setRedis } from "@src/redisClient";
import {
  Lobby,
  Message,
  OptionsRoom,
  Room,
  Rooms,
  User,
  Users,
} from "@src/entities/entities";
import {
  EVENTS_SOCKET_CLIENT,
  EVENTS_SOCKET_SERVER,
} from "@src/entities/enums";
import {
  generateWordPlaceholder,
  getFourRandomWords,
  getRoomsAvailables,
  revealLetter,
} from "./utills/utils";
import { connectEvent } from "./events/connect/connectEvent";
import { disconnectEvent } from "./events/disconnect/disconnectEvent";
import { joinLobbyEvent } from "./events/joinLobby/joinLobbyEvent";
import { leaveLobbyEvent } from "./events/leaveLobby/leaveLobbyEvent";
import { sendMessageLobbyEvent } from "./events/sendMessageLobby/sendMessageLobbyEvent";
import { createRoomEvent } from "./events/createRoom/createRoomEvent";
import { joinRoomLobbyEvent } from "./events/joinRoomLobby/joinRoomLobbyEvent";
import { loginPrivateRoomEvent } from "./events/loginPrivateRoom/loginPrivateRoomEvent";
import { startGameEvent } from "./events/startGame/startGameEvent";
import { JoinGameEvent } from "./events/joinGame/joinGameEvent";
import { wordSelectedGameEvent } from "./events/wordSelectedGame/wordSelectedGameEvent";
import { canvasImageGameEvent } from "./events/canvasImageGame/canvasImageGameEvent";
import { canvasClearGameEvent } from "./events/canvasClearGame/canvasClearGameEvent";
import { countdownGameEvent } from "./events/countdownGame/countdownGameEvent";
import { sendMessageGameEvent } from "./events/sendMessageGame/sendMessageGameEvent";
import { newPainterEvent } from "./events/newPainter/newPainterEvent";
import { nextRoundGameEvent } from "./events/nextRoundGame/nextRoundGameEvent";
import { finishGameEvent } from "./events/finishGame/finishGameEvent";

export const idLobby = "lobby_room";

const server = createServer(app);

const PORT = configs.API.PORT;
const CLIENT_URL = configs.CLIENT.URL;

const INITIAL_USERS: Users = {};
const INITIAL_ROOMS: Rooms = {};
const INITIAL_LOBBY: Lobby = {
  id: idLobby,
  appTotalPlayers: Object.keys(INITIAL_USERS).length,
  users: [],
  rooms: INITIAL_ROOMS,
};

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  console.log("A user has connected!");

  socket.on(
    EVENTS_SOCKET_CLIENT.CONNECT,
    ({
      username,
      pathToRedirect,
    }: {
      username: string;
      pathToRedirect: string;
    }) =>
      connectEvent({
        io: io,
        socket: socket,
        username: username,
        pathToRedirect: pathToRedirect,
      })
  );

  socket.on(EVENTS_SOCKET_CLIENT.DISCONNECT, () =>
    disconnectEvent({ io: io, socket: socket })
  );

  socket.on(EVENTS_SOCKET_CLIENT.JOIN_LOBBY, async () =>
    joinLobbyEvent({ io: io, socket: socket })
  );

  socket.on(EVENTS_SOCKET_CLIENT.LEAVE_LOBBY, async () =>
    leaveLobbyEvent({ io: io, socket: socket })
  );

  socket.on(EVENTS_SOCKET_CLIENT.SEND_MESSAGE_LOBBY, (message: string) =>
    sendMessageLobbyEvent({ io: io, socket: socket, message: message })
  );

  socket.on(EVENTS_SOCKET_CLIENT.CREATE_ROOM, (optionsRoom: OptionsRoom) =>
    createRoomEvent({ io: io, socket: socket, optionsRoom: optionsRoom })
  );

  socket.on(EVENTS_SOCKET_CLIENT.JOIN_ROOM_LOBBY, (idRoom: string) =>
    joinRoomLobbyEvent({ io, socket, idRoom })
  );

  socket.on(
    EVENTS_SOCKET_CLIENT.LOGIN_PRIVATE_ROOM,
    ({ idRoom, password }: { idRoom: string; password: string }) =>
      loginPrivateRoomEvent({
        io: io,
        socket: socket,
        idRoom: idRoom,
        password: password,
      })
  );

  socket.on(EVENTS_SOCKET_CLIENT.START_GAME, (idRoom: string) =>
    startGameEvent({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(EVENTS_SOCKET_CLIENT.JOIN_GAME, (idRoom: string) =>
    JoinGameEvent({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(
    EVENTS_SOCKET_CLIENT.WORD_SELECTED_GAME,
    ({ idRoom, wordSelected }: { idRoom: string; wordSelected: string }) =>
      wordSelectedGameEvent({
        io: io,
        socket: socket,
        idRoom: idRoom,
        wordSelected: wordSelected,
      })
  );

  socket.on(
    EVENTS_SOCKET_CLIENT.CANVAS_IMAGE_GAME,
    ({ idRoom, dataUrl }: { idRoom: string; dataUrl: string }) =>
      canvasImageGameEvent({
        io: io,
        socket: socket,
        idRoom: idRoom,
        dataUrl: dataUrl,
      })
  );

  socket.on(EVENTS_SOCKET_CLIENT.CANVAS_CLEAR_GAME, (idRoom: string) =>
    canvasClearGameEvent({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(EVENTS_SOCKET_CLIENT.COUTNDOWN_GAME, async (idRoom: string) =>
    countdownGameEvent({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(
    EVENTS_SOCKET_CLIENT.SEND_MESSAGE_GAME,
    ({ idRoom, message }: { idRoom: string; message: string }) =>
      sendMessageGameEvent({
        io: io,
        socket: socket,
        idRoom: idRoom,
        message: message,
      })
  );

  socket.on(EVENTS_SOCKET_CLIENT.NEW_PAINTER_GAME, (idRoom: string) =>
    newPainterEvent({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(EVENTS_SOCKET_CLIENT.NEXT_ROUND_GAME, (idRoom: string) =>
    nextRoundGameEvent({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(EVENTS_SOCKET_CLIENT.FINISH_GAME, (idRoom: string) =>
    finishGameEvent({ io: io, socket: socket, idRoom: idRoom })
  );
});

server.listen(PORT, async () => {
  console.log(`Server running on ${PORT}`);

  setRedis("users", INITIAL_USERS);
  setRedis("rooms", INITIAL_ROOMS);
  setRedis("lobby", INITIAL_LOBBY);

  const users = await getRedis<Users>("users");
  const rooms = await getRedis<Rooms>("rooms");
  const lobby = await getRedis<Lobby>("lobby");

  console.log("Users Restarted", users);
  console.log("Rooms Restarted", rooms);
  console.log("Lobby Restarted", lobby);
});
