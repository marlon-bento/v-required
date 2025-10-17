<template>

</template>

<script setup lang="ts">
import { inject, onMounted, useSlots } from 'vue';
import { vRequiredApiKey } from '../keys/keys';

interface VrulesProps {
  error: () => boolean,
  message: string,
  name?: string,
}
const props = withDefaults(defineProps<VrulesProps>(), {
});

const slots = useSlots();
const parentApi = inject(vRequiredApiKey);

if (!parentApi) {
  throw new Error('VRule deve ser usado dentro de um VRequired.');
}

onMounted(() => {

  parentApi.addRule({
    error: props.error,
    message: props.message,
    bodySlot: slots.body,
  });
});
</script>