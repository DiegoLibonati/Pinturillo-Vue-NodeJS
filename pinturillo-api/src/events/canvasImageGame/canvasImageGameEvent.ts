import { CustomSocket } from "@src/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

interface CanvasImageGameEventProps extends CustomSocket {
  idRoom: string;
  dataUrl: string;
}

export const canvasImageGameEvent = async ({
  socket,
  idRoom,
  dataUrl,
}: CanvasImageGameEventProps) => {
  return socket
    .to(idRoom)
    .emit(EVENTS_SOCKET_SERVER.CANVAS_IMAGE_GAME, dataUrl);
};
