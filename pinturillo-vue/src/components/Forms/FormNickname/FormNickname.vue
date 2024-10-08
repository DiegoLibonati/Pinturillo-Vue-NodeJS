<script setup lang="ts">
import socket from "@/socket";

import ButtonGridTertiaryFull from "@/components/Buttons/ButtonGridTertiaryFull/ButtonGridTertiaryFull.vue";
import ButtonGridTertiary from "@/components/Buttons/ButtonGridTertiary/ButtonGridTertiary.vue";
import InputTransparent from "@/components/Inputs/InputTransparent/InputTransparent.vue";
import { ref } from "vue";
import { EVENTS_SOCKET_CLIENT } from "@/entities/enums";
import { useAlertStore } from "@/stores/alert/alert";

type FormNickname = {
  nickname: string;
};

const INITIAL_VALUE_FORM: FormNickname = {
  nickname: "player",
};

const alertStore = useAlertStore();

const form = ref<FormNickname>({ ...INITIAL_VALUE_FORM });

const handleRedirect = async (path: string): Promise<void> => {
  const nickname = form.value.nickname.trim();

  if (!nickname) {
    alertStore.setAlert({ type: "warning", message: "Enter a valid username" });
    form.value = { ...INITIAL_VALUE_FORM };
    return;
  }

  try {
    await new Promise<void>((resolve, reject) => {
      socket.once("connect", () => {
        resolve();
      });
      socket.once("connect_error", (error) => {
        reject(error);
      });
      socket.connect();
    });

    socket.emit(EVENTS_SOCKET_CLIENT.CONNECT, {
      username: nickname,
      pathToRedirect: path,
    });
  } catch (error) {
    console.error("Error al conectar el socket:", error);
    alertStore.setAlert({
      type: "error",
      message: "Could not connect to the server, try again",
    });
  }
};
</script>

<template>
  <form class="flex flex-col items-start justify-center h-auto w-full">
    <InputTransparent
      :id="'nickname'"
      :label-value="'Nickname'"
      :placeholder="'Insert your nickname'"
      class="text-4xl p-2 mt-2"
      v-model="form.nickname"
    ></InputTransparent>
    <div class="grid grid-cols-2 gap-2 w-full mt-4">
      <ButtonGridTertiary :click="() => handleRedirect('/lobby')">
        LOBBY
      </ButtonGridTertiary>
      <ButtonGridTertiary :click="() => handleRedirect('/room/create')">
        CREATE ROOM
      </ButtonGridTertiary>
      <ButtonGridTertiaryFull
        :click="() => handleRedirect('/room/login/private')"
        >JOIN TO PRIVATE ROOM</ButtonGridTertiaryFull
      >
    </div>
  </form>
</template>
