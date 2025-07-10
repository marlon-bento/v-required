/**
 * Atualiza os erros de validação com base nas regras definidas.
 *
 * @param rules - Um objeto contendo as regras de validação para cada campo.
 * @param errosSettings - Um objeto reativo onde os erros serão atualizados.
 */
export function senderErrors(rules, errosSettings) {
    for (const field in rules) {
        errosSettings[field] = rules[field].map(([message, cond]) => ({
            message,
            condition: cond(),
        }));
    }
}

export function senderErrorsDynamic(rulesDynamic, errosSettings) {
    for (const field in rulesDynamic) {
        for (const subField in rulesDynamic[field]) {
            if (Array.isArray(errosSettings[field])) {
                // percorre todos errosSettings
                for (let i = 0; i < errosSettings[field].length; i++) {
                    errosSettings[field][i][subField] = rulesDynamic[field][subField].map(
                        ([message, cond]) => ({
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
                        ([message, cond]) => ({
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
    isEmptyString(value) {
        return value === null || value === undefined || value.trim() === '';
    }
}
export const validForm = (errosSettings) => {
    if (errosSettings === undefined)
        throw new Error("validForm precisa de um parâmetro");
    if (typeof errosSettings !== "object")
        throw new Error("validForm precisa receber um objeto como parâmetro");
    console.log("list erros valid ", errosSettings);
    let hasError = false;
    for (const key in errosSettings) {
        for (const error of errosSettings[key]) {
            // Validação quando existem mais de 1 item error
            // caso for ter mais algum campo igual manter o padrão, e adicionar ao if
            /**
             * padrão
             * nomes dos ids para scrolar (começa com scroll_ depois o nome do campo, nome do subcampo e o index do campo)
             * O nome e o subnome do id, precisa ser o mesmo do errosSettings
             * **/
            if (key === "unidades") {
                errosSettings[key].map((item, index) => {
                    for (const keyCampo in item) {
                        // se existir erro no campo
                        if (item[keyCampo].some((error) => error.condition)) {
                            const campo = document.getElementById(
                                `scroll_${key}_${keyCampo}_${index}`,
                            );
                            if (campo) {
                                campo.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                });
                            }
                            hasError = true;
                        }
                    }
                });
                /* não pode retornar true diretamento dentro do map, pois o map é uma função */
                if (hasError) {
                    return hasError;
                }
            }
            // para os que não possuem subcampos
            /**
             * padrão
             * nomes dos ids para scrolar (começa com scroll_ depois o nome do campo)
             * O nome do id precisa ser o mesmo do errosSettings
             * **/
            else if (error.condition) {
                const campo = document.getElementById(`scroll_${key}`);
                if (campo) {
                    campo.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }
                hasError = true;
            }
            if (hasError) {
                return hasError;
            }
        }
    }
    /* caso não tenha nenhum erro retorna false */
    return hasError;
}