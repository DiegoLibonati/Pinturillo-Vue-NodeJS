<script setup lang="ts">
import { InputTypeHTMLAttribute } from "vue";

const props = defineProps<{
  id: string;
  placeholder: string;
  modelValue: string;
  type: InputTypeHTMLAttribute;
  class?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <input
    :type="props.type"
    :id="props.id"
    :name="props.id"
    :placeholder="props.placeholder"
    :value="props.modelValue"
    @input="onInput"
    :class="[
      'w-full rounded-lg bg-secondary border-secondary border-[.2rem] px-2 text-white text-lg outline-none transition-all placeholder:text-white focus:border-quaternary',
      props.class,
    ]"
  />
</template>
