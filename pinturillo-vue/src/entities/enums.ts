// ** Enums **
export enum EVENTS_SOCKET_CLIENT {
  CONNECT = "custom connect",
  DISCONNECT = "disconnect",
  JOIN_GAME = "join game",
  JOIN_LOBBY = "join lobby",
  JOIN_ROOM_LOBBY = "join room lobby", // GET ROOM LOBBY
  LEAVE_LOBBY = "leave lobby",
  SEND_MESSAGE_LOBBY = "send message lobby",
  CREATE_ROOM = "create room",
  LOGIN_PRIVATE_ROOM = "login private room",
  START_GAME = "start game",
  WORD_SELECTED_GAME = "word selected game",
  CANVAS_IMAGE_GAME = "canvas image game",
  CANVAS_CLEAR_GAME = "canvas clear game",
  COUTNDOWN_GAME = "countdown game",
  SEND_MESSAGE_GAME = "send message game",
  NEW_PAINTER_GAME = "new painter game",
  NEXT_ROUND_GAME = "next round game",
  FINISH_GAME = "finish game",
}

export enum EVENTS_SOCKET_SERVER {
  CONNECT = "custom connect", // CONNECT SERVER
  DISCONNECT = "custom disconnect", // DISCONNECT SERVER
  UPDATE_LOBBY = "update lobby", // JOIN LOBBY SERVER - LEAVE LOBBY SERVER
  UPDATE_ROOM_LOBBY = "update room lobby", // GET_ROOM_LOBBY_SERVER
  UPDATE_GAME = "update game", // JOIN_GAME_SERVER - WORD_SELECTED_GAME_SERVER - EXECUTE COUNTDOWN GAME SERVER
  SEND_MESSAGE_LOBBY = "send message lobby", // SEND_MESSAGE_LOBBY_SERVER
  LOGIN_PRIVATE_ROOM = "login private room", // LOGIN_PRIVATE_ROOM_SERVER
  CREATE_ROOM = "create room", // CREATE_ROOM_SERVER
  START_GAME = "start game", // START_GAME_SERVER
  CANVAS_IMAGE_GAME = "canvas image game", // CANVAS_IMAGE_GAME_SERVER
  CANVAS_CLEAR_GAME = "canvas clear game", // CANVAS_CLEAR_GAME_SERVER
  SEND_MESSAGE_GAME = "send message game",
  NEW_PAINTER_GAME = "new painter game",
  NEXT_ROUND_GAME = "next round game",
  FINISH_GAME = "finish game",
}
