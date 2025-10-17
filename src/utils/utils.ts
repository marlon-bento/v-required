import type { RulesMap, ErrosSettings, ErrosDynamicField, ValidationError } from "../types/types";
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

export function senderErrorsDynamic(rulesDynamic:any, errosSettings:any) {
    for (const field in rulesDynamic) {
        for (const subField in rulesDynamic[field]) {
            if (Array.isArray(errosSettings[field])) {
                // percorre todos errosSettings
                for (let i = 0; i < errosSettings[field].length; i++) {
                    errosSettings[field][i][subField] = rulesDynamic[field][subField].map(
                        ([message, cond]: [string, (i: number) => boolean]) => ({
                            message,
                            condition: cond(i),
                        })
                    );
                }
            }else {
                // inicializa o errorSettings (se não existir) com os fields e subfields
                errosSettings[field] = [];
                for (let i = 0; i < rulesDynamic[field][subField].length; i++) {
                    errosSettings[field][i] = {};
                    errosSettings[field][i][subField] = rulesDynamic[field][subField].map(
                        ([message, cond]: [string, (i: number) => boolean]) => ({
                            message,
                            condition: cond(i),
                        })
                    );
                }
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