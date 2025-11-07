<template>
    <div 
    :id="'scroll_'+props.name"
    v-required="{ list: config?.[props.name] || [], activeError: props.activeError }">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { onUnmounted, provide, watchEffect, defineProps, withDefaults, onMounted, nextTick, inject } from 'vue';
import { vRequiredApiKey, type VRequiredApi, vRequiredRulesKey, vRequiredConfigKey } from '../keys/keys';

interface VRequiredProps {
    activeError?: boolean;
    name: string;
}
const localRules: any[] = [];

const rules = inject(vRequiredRulesKey);
const config = inject(vRequiredConfigKey);

const props = withDefaults(defineProps<VRequiredProps>(), {
    activeError: true,
});

function addRule(rule: VRequiredApi): void {
    localRules.push([rule.message, rule.error]);
}

provide(vRequiredApiKey, { addRule });
watchEffect(() => {
    // Se as regras para este componente já foram registradas...
    if (rules[props.name]) {
        // ...calcula os erros APENAS para este componente
        const currentErrors = rules[props.name].map(([message, cond]: [string, () => boolean]) => ({
            message,
            condition: cond(),
        }));
        // ...e atualiza o objeto 'config' central APENAS para este campo.
        config[props.name] = currentErrors;
    }
});
onMounted(() => {
    nextTick(() => {
        rules[props.name] = localRules;
    });
});
onUnmounted(() => {
    delete rules[props.name];
    delete config[props.name];
});
</script>

<style lang="scss" scoped></style>