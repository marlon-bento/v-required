import type { RulesMap, ErrosSettings, RulesDynamicMap, ErrosDynamicField, ValidationError } from "../types/types";
/**
 * Atualiza os erros de validação com base nas regras definidas.
 *
 * @param rules - Um objeto contendo as regras de validação para cada campo.
 * @param errosSettings - Um objeto reativo onde os erros serão atualizados.
 */
export function senderErrors(rules: RulesMap, errosSettings: ErrosSettings) {
    for (const field in rules) {
        errosSettings[field] = rules[field]!.map(([message, cond]) => ({
            message,
            condition: cond(),
        }));
    }
}

export function senderErrorsDynamic(rulesDynamic: RulesDynamicMap, errosSettings: ErrosSettings) {
    for (const field in rulesDynamic) {
        const dynamicRules = rulesDynamic[field];
        if (!dynamicRules) continue;
        for (const subField in dynamicRules) {
            const subFieldRules = dynamicRules[subField];
            if (!subFieldRules) continue;
            if (Array.isArray(errosSettings[field])) {
                const dynamicErrorField = errosSettings[field] as ErrosDynamicField;
                for (let i = 0; i < dynamicErrorField.length; i++) {
                    const errorItem = dynamicErrorField[i];
                    if (errorItem) {
                        errorItem[subField] = subFieldRules.map(([message, cond]) => ({
                            message,
                            condition: cond(i),
                        }));
                    }
                }
            } else {
                const newDynamicErrorField = [] as ErrosDynamicField;
                for (let i = 0; i < subFieldRules.length; i++) {
                    newDynamicErrorField[i] = {};
                    const errorItem = newDynamicErrorField[i];
                    if (errorItem) {
                        errorItem[subField] = subFieldRules.map(([message, cond]) => ({
                            message,
                            condition: cond(i),
                        }));
                    }
                }
                errosSettings[field] = newDynamicErrorField;
            }
        }
    }
}
export const validate = {
    // Verifica se a string é vazia ou nula
    isEmptyString(value: string | null | undefined): boolean {
        return value === null || value === undefined || value.trim() === '';
    }
}
export const validForm = (errosSettings: ErrosSettings) => {
    if (errosSettings === undefined)
        throw new Error("validForm precisa de um parâmetro");
    if (typeof errosSettings !== "object")
        throw new Error("validForm precisa receber um objeto como parâmetro");

    // Itera sobre todas as chaves de campo no objeto de erros (ex: 'nome_curso', 'unidades', etc.)
    for (const key in errosSettings) {
        const errorsForKey = errosSettings[key];

        // Pula se não houver array de erros para esta chave ou se estiver vazio
        if (!errorsForKey || errorsForKey.length === 0) {
            continue;
        }

        const firstErrorItem = errorsForKey[0];

        // Verifica se o primeiro item do array tem a estrutura de um erro simples.
        if (firstErrorItem && 'condition' in firstErrorItem && 'message' in firstErrorItem) {
            // TIPO 1: Estrutura Simples (ValidationError[])
            const simpleErrors = errorsForKey as ValidationError[];

            for (const error of simpleErrors) {
                if (error.condition) {
                    const campo = document.getElementById(`scroll_${key}`);
                    if (campo) {
                        campo.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                    return true; // Encontrou um erro, retorna 'true' imediatamente.
                }
            }
        } else {
            // TIPO 2: Estrutura Dinâmica (ErrosDynamicField)
            const dynamicErrors = errorsForKey as ErrosDynamicField;

            // Itera sobre cada item do array (ex: cada 'unidade')
            for (let index = 0; index < dynamicErrors.length; index++) {
                const item = dynamicErrors[index];
                if (!item) continue;

                // Itera sobre os subcampos dentro do item (ex: 'nome', 'turnos')
                for (const subFieldKey in item) {
                    const subFieldErrors = item[subFieldKey];

                    // Verifica se algum dos erros do subcampo tem a condição 'true'
                    if (subFieldErrors && subFieldErrors.some(e => e.condition)) {
                        // Constrói o ID dinamicamente usando a chave principal, a chave do subcampo e o índice
                        const campo = document.getElementById(`scroll_${key}_${subFieldKey}_${index}`);
                        if (campo) {
                            campo.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                        return true; // Encontrou um erro, retorna 'true' imediatamente.
                    }
                }
            }
        }
    }

    /* Se o loop terminar sem encontrar erros, retorna false */
    return false;
}