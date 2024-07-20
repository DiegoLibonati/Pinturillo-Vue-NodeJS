<script setup lang="ts">
const props = defineProps<{
  username: string;
  message: string;
  classUsername?: string;
}>();
</script>

<template>
  <h2 class="text-white font-semibold text-lg">
    <span :class="['', props.classUsername]">{{ props.username }}: </span
    >{{ props.message }}
  </h2>
</template>
