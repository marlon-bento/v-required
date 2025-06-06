function helpMethodsRequired(el, binding, mounted = false) {
    // erros de tipos de parâmetros
    if (binding === undefined)
        throw new Error("v-required precisa de um parâmetro, no mínimo o list");
    if (typeof binding !== "object")
        throw new Error("v-required precisa receber um objeto como parâmetro");
    if (!("list" in binding))
        throw new Error("v-required precisa do parâmetro list no objeto");
    if (!Array.isArray(binding.list))
        throw new Error("v-required precisa que o parâmetro list seja um array");

    let span;
    const input =
        el.querySelector("input") ||
        el.querySelector("textarea") ||
        el.querySelector("select");
    // só cria a estrutura na montagem
    if (mounted) {
        //cria um span que vai receber o erro
        span = document.createElement("span");
        el.appendChild(span);
        span.classList.add("v-required-span");

        /* adiciona a classe style-custom-v-required 
            no el para estilizar por preferência*/
        el.classList.add("style-custom-v-required-default");
    } else {
        span = el.querySelector(".v-required-span");
    }

    let hasError = false;

    /* avalia se foi passada a propriedade list 
           e se caaso foi passado também activeError avalia se é para mostrar a lista de erros */
    if ("activeError" in binding ? binding.activeError : true) {
        const list = binding.list;
        // percorre a lista de erros
        for (let i = 0; i < list.length; i++) {
            // verificação se existe condition
            if (!("condition" in list[i])) {
                throw new Error(
                    "v-required precisa que todos os erros de list, tenham uma condition",
                );
            }
            // verificação para campos com condição
            else if (list[i].condition) {
                hasError = true;
                // adiciona a mensagem de erro no span
                span.innerHTML = list[i].message;
                el.classList.add("style-custom-v-required-error");
                break;
            }
        }
        if (!hasError) {
            span.innerHTML = "";
            el.classList.remove("style-custom-v-required-error");
        }
    }else if("activeError" in binding && !binding.activeError) {
        // se activeError for false, limpa o span e remove a classe de erro
        span.innerHTML = "";
        el.classList.remove("style-custom-v-required-error");
    }
    /* uso
      ...
      <div v-required="{list: [{condition: !value, message: 'Campo obrigatório'}]}">
        <input type="text">
      </div>
      ...
     
      */
}
export default {
    mounted(el, binding) {
        helpMethodsRequired(el, binding.value, true);
    },
    updated(el, binding) {
        helpMethodsRequired(el, binding.value);
    },
};

