import { CustomSocket } from "@src/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

interface CanvasClearGameEventProps extends CustomSocket {
  idRoom: string;
}

export const canvasClearGameEvent = ({
  socket,
  idRoom,
}: CanvasClearGameEventProps) => {
  return socket.to(idRoom).emit(EVENTS_SOCKET_SERVER.CANVAS_CLEAR_GAME);
};
