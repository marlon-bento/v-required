<template>
    <div 
    :id="'scroll_'+props.name"
    v-required="{ list: props.config?.[props.name] || [], activeError: props.activeError }">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { onUnmounted, provide, watchEffect, defineProps, withDefaults, onMounted, nextTick } from 'vue';
import { vRequiredApiKey, type VRequiredApi } from '../keys/keys';

interface VRequiredProps {
    config: any;
    rules: any;
    activeError?: boolean;
    name: string;
}
const localRules: any[] = [];

const props = withDefaults(defineProps<VRequiredProps>(), {
    activeError: true,
});

function addRule(rule: VRequiredApi): void {
    localRules.push([rule.message, rule.error]);
}

provide(vRequiredApiKey, { addRule });
watchEffect(() => {
    // Se as regras para este componente já foram registradas...
    if (props.rules[props.name]) {
        // ...calcula os erros APENAS para este componente
        const currentErrors = props.rules[props.name].map(([message, cond]: [string, () => boolean]) => ({
            message,
            condition: cond(),
        }));
        // ...e atualiza o objeto 'config' central APENAS para este campo.
        props.config[props.name] = currentErrors;
    }
});
onMounted(() => {
    nextTick(() => {
        props.rules[props.name] = localRules;
    });
});
onUnmounted(() => {
    delete props.rules[props.name];
    delete props.config[props.name];
});
</script>

<style lang="scss" scoped></style>