<script setup lang="ts">
import Logo from "@/components/Logo/Logo.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const mainClass = computed(() => {
  const baseClass =
    "items-center justify-center bg-primary w-full h-20 shadow-md";
  const heightClass = route.path.includes("game") ? "hidden" : "flex";
  return `${baseClass} ${heightClass}`;
});
</script>

<template>
  <header :class="mainClass">
    <Logo></Logo>
  </header>
</template>
