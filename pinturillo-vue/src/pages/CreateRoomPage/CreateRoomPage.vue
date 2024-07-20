<script setup lang="ts">
import MainLayout from "@/layouts/MainLayout/MainLayout.vue";
import SectionFormCreateRoom from "@/containers/CreateRoomPage/Sections/SectionFormCreateRoom.vue";
import { onBeforeUnmount, onMounted } from "vue";
import socket from "@/socket";
import { useRouter } from "vue-router";
import { EVENTS_SOCKET_SERVER } from "@/entities/enums";

const router = useRouter();

onMounted(() => {
  socket.on(EVENTS_SOCKET_SERVER.CREATE_ROOM, (idRoom: string) => {
    router.push(`/room/lobby/${idRoom}`);
  });
});

onBeforeUnmount(() => {
  socket.off(EVENTS_SOCKET_SERVER.CREATE_ROOM);
});
</script>

<template>
  <MainLayout layout-type="flex" class="flex-col items-center justify-center">
    <SectionFormCreateRoom></SectionFormCreateRoom>
  </MainLayout>
</template>
