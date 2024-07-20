<script setup lang="ts">
const props = defineProps<{
  class?: string | string[];
  type: "button" | "submit" | "reset" | undefined;
  click?: () => void;
}>();
</script>

<template>
  <button
    :class="[
      'w-full bg-secondary tracking-wide text-white font-semibold rounded-lg transition-all active:scale-90 hover:bg-opacity-75',
      props.class,
    ]"
    :type="props.type"
    @click="props.click"
  >
    <slot></slot>
  </button>
</template>
