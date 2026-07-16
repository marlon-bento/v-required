<template>
    <div 
    :id="'scroll_'+internalName"
    v-required="{ list: config?.[internalName] || [], activeError: props.activeError }">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
/* ========
Arquivo: VRequired.vue
Este componente serve como um wrapper para gerenciar as regras de validação de um campo.
Ele injeta a configuração global, registra suas próprias regras localmente e atualiza 
o estado global de erros. Agora gera um identificador automático caso a propriedade 'name' 
não seja informada, evitando quebra de arquitetura ou digitação desnecessária.
======== */
import { onUnmounted, provide, watchEffect, defineProps, withDefaults, onMounted, nextTick, inject, getCurrentInstance, computed } from 'vue';
import { vRequiredApiKey, type VRequiredApi, vRequiredRulesKey, vRequiredConfigKey } from '../keys/keys';

interface VRequiredProps {
    activeError?: boolean;
    name?: string;
}
// Armazena as regras locais do componente antes da integração com o estado global.
const localRules: any[] = [];
// Instância reativa global que guarda as funções de regra.
const rules = inject(vRequiredRulesKey);
// Instância reativa global que guarda o estado atual dos erros avaliados.
const config = inject(vRequiredConfigKey);

const props = withDefaults(defineProps<VRequiredProps>(), {
    activeError: true,
});

// Captura o ID na montagem para usar caso name não for passado
const fallbackUid = getCurrentInstance()?.uid || Date.now();
// Define o nome do campo. Se não fornecido, gera um identificador seguro baseado na instância do Vue.
const internalName = computed(() => {
    return props.name || `vrequired_field_${fallbackUid}`
});
/* Recebe: rule (VRequiredApi)
Devolve: void
Por que é usada: Adiciona uma regra de validação vinda de um componente filho à lista de regras locais deste escopo.
*/
function addRule(rule: VRequiredApi): void {
    localRules.push([rule.message, rule.error]);
}

provide(vRequiredApiKey, { addRule });
watchEffect(() => {
    // Se as regras para este componente já foram registradas...
    if (rules[internalName.value]) {
        // ...calcula os erros APENAS para este componente
        const currentErrors = rules[internalName.value].map(([message, cond]: [string, () => boolean]) => ({
            message,
            condition: cond(),
        }));
        // ...e atualiza o objeto 'config' central APENAS para este campo.
        config[internalName.value] = currentErrors;
    }
});
onMounted(() => {
    nextTick(() => {
        rules[internalName.value] = localRules;
    });
});
onUnmounted(() => {
    delete rules[internalName.value];
    delete config[internalName.value];
});
</script>

<style lang="scss" scoped></style>