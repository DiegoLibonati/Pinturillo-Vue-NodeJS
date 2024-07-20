import { CustomSocket } from "@src/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

interface StartGameEventsProps extends CustomSocket {
  idRoom: string;
}

export const startGameEvent = ({ io, idRoom }: StartGameEventsProps) => {
  return io.to(idRoom).emit(EVENTS_SOCKET_SERVER.START_GAME);
};
