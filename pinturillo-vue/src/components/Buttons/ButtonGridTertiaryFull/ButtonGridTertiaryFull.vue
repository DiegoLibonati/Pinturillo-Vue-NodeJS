<script setup lang="ts">
const props = defineProps<{
  click: () => void;
}>();
</script>

<template>
  <button
    type="button"
    class="w-full text-4xl mt-2 bg-tertiary rounded-lg p-2 font-semibold text-white cursor-pointer col-span-2 transition-all hover:bg-opacity-75 active:scale-90"
    @click="props.click"
  >
    <slot></slot>
  </button>
</template>
