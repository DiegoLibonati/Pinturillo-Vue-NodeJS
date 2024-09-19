# Pinturillo Vue NodeJS

## Getting Started

1. Clone the repository with `git clone "repository link"`
2. Go to the folder where you cloned your repository
3. Run `docker-compose build --no-cache` in the terminal
4. Once built, you must execute the command: `docker-compose up`
5. You have to be standing in the folder containing the: `docker-compose.yml`

## Description

This repository is an application made with vue and socket io. It is a game where one player paints and the others must guess what the other player is painting, based on the game Pinturillo.

## Technologies used

1. NodeJS
2. Typescript
3. VueJS 3
4. Tailwind CSS
5. Docker
6. Redis

## Libraries used

1. Express
2. Morgan
3. Socket IO
4. Uuid
5. Nodemon
6. Vue Router
7. Pinia
8. Oh Vue Icons
9. Socket IO Client

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/Pinturillo-Vue-NodeJS`](https://www.diegolibonati.com.ar/#/project/Pinturillo-Vue-NodeJS)

## Video

https://github.com/user-attachments/assets/85799435-bcea-4f6f-9a45-2db9fb6ea56b

## Documentation APP

### **Version**

```ts
APP VERSION: 1.0.0
README UPDATED: 21/07/2024
AUTHOR: Diego Libonati
```

### **Env Keys**

NOTE: You must create the .env inside the folder filemanager-app

1. `VITE_API_URL`: This is the link to the application if you are in development leave it as localhost
2. `PORT`: It is the application port
3. `CLIENT_URL`: It is the link to the client side application.
4. `REDIS_HOST`: Is the host name to connect to redis
5. `REDIS_PORT`: Is the port to connect to redis

```ts
# Frontend Envs
VITE_API_URL=http://localhost:5000

# Backend Envs
PORT=5000
CLIENT_URL=http://localhost:5173
REDIS_HOST=redis
REDIS_PORT=6379
```

### **Pinturillo Events API**

---

- **Event Name**: CONNECT
- **Event Fn**: This event is in charge of connecting the user where he/she is connected and loading him/her in redis.
- **Event Props**:

```ts
{
  username: string;
  pathToRedirect: string;
}
```

---

- **Event Name**: DISCONNECT
- **Event Fn**: This event disconnects the user from the application.
- **Event Props**: None

---

- **Event Name**: JOIN_GAME
- **Event Fn**: This event is in charge of making players enter the room where they will play, initializing a user to choose a word to paint.
- **Event Props**:

```ts
{
  idRoom: string;
}
```

---

- **Event Name**: JOIN_LOBBY
- **Event Fn**: This event is responsible for making players enter the lobby where they can choose a room or chat.
- **Event Props**: None

---

- **Event Name**: LEAVE_LOBBY
- **Event Fn**: This event is responsible for disconnecting users from the lobby.
- **Event Props**: None

---

- **Event Name**: SEND_MESSAGE_LOBBY
- **Event Fn**: This event is responsible for sending a message to all lobby users.
- **Event Props**:

```ts
{
  message: string;
}
```

---

- **Event Name**: CREATE_ROOM
- **Event Fn**: This event is in charge of creating a room based on the options sent by props.
- **Event Props**:

```ts
type TypeRoom = "public" | "private";
type RoundsRoom = 1 | 2 | 3;
type SlotsRoom = 6 | 8;
type CountdownRoom = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90;

{
  name: string;
  type: TypeRoom;
  password: string;
  slots: SlotsRoom;
  totalRounds: RoundsRoom;
  countdown: CountdownRoom;
}
```

---

- **Event Name**: JOIN_ROOM_LOBBY
- **Event Fn**: This event is responsible for connecting a user to a selected room from the lobby.
- **Event Props**:

```ts
{
  idRoom: string;
}
```

---

- **Event Name**: LOGIN_PRIVATE_ROOM
- **Event Fn**: This event is responsible for connecting a user to a private room.
- **Event Props**:

```ts
{
  idRoom: string;
  password: string;
}
```

---

- **Event Name**: START_GAME
- **Event Fn**: This event is responsible for initializing a game room through the lobby of the room itself.
- **Event Props**:

```ts
{
  idRoom: string;
}
```

---

- **Event Name**: WORD_SELECTED_GAME
- **Event Fn**: This event is responsible for loading the word selected by the painter in the room where it is being played.
- **Event Props**:

```ts
{
  idRoom: string;
  wordSelected: string;
}
```

---

- **Event Name**: CANVAS_IMAGE_GAME
- **Event Fn**: This event is responsible for updating the canvas board to the players.
- **Event Props**:

```ts
{
  idRoom: string;
  dataUrl: string;
}
```

---

- **Event Name**: CANVAS_CLEAR_GAME
- **Event Fn**: This event is responsible for wiping the canvas board for players
- **Event Props**:

```ts
{
  idRoom: string;
}
```

---

- **Event Name**: COUTNDOWN_GAME
- **Event Fn**: This event is responsible for updating the counter of the game to players
- **Event Props**:

```ts
{
  idRoom: string;
}
```

---

- **Event Name**: SEND_MESSAGE_GAME
- **Event Fn**: This event is responsible for sending a message to the players in a room.
- **Event Props**:

```ts
{
  idRoom: string;
  message: string;
}
```

---

- **Event Name**: NEW_PAINTER_GAME
- **Event Fn**: This event is responsible for loading a new painter from a specific room.
- **Event Props**:

```ts
{
  idRoom: string;
}
```

---

- **Event Name**: NEXT_ROUND_GAME
- **Event Fn**: This event is responsible for updating the round of a specific room.
- **Event Props**:

```ts
{
  idRoom: string;
}
```

---

- **Event Name**: FINISH_GAME
- **Event Fn**: This event is responsible for ending a specific game.
- **Event Props**:

```ts
{
  idRoom: string;
}
```

---
