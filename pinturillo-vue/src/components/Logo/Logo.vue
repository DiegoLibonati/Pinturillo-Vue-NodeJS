<script setup lang="ts">
import socket from "@/socket";
import { useRouter } from "vue-router";

const router = useRouter();

const handleRedirectHome = () => {
  socket.disconnect();
  router.push("/");
};
</script>

<template>
  <button @click="handleRedirectHome" class="flex flex-row relative">
    <h2 class="font-semibold text-4xl text-white z-[10] font-playwrite">
      Pinturillo
    </h2>
    <img
      src="@/assets/vue.svg"
      alt="VueJS logo"
      class="absolute -right-5 z-[5]"
    />
  </button>
</template>
