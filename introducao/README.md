[< Voltar para README principal](../README.md)

# 📌 Introdução ao ```v-required```

A diretiva personalizada ```v-required``` é usada para validação de campos de formulário no Vue.js, permitindo o controle de:

1.  **Quais validações aplicar em cada campo**

2.  **Quando as mensagens de erro devem ser exibidas**

Ela facilita o gerenciamento dos erros com uma **estrutura padronizada**, tanto para mensagens quanto para as condições que disparam os erros.



# 🚀 Novidades da Versão 2.0.0: Validação com Componentes!

A partir da versão 2.0.0, o ```v-required``` evoluiu para uma abordagem mais moderna, declarativa e poderosa, utilizando componentes. Embora o método antigo com a diretiva v-required="{...}" continue funcionando para garantir a retrocompatibilidade, a nova abordagem com componentes é agora a forma recomendada de uso.

As principais vantagens são:

- Templates mais limpos: As regras de validação são declaradas diretamente no template, junto aos campos.

- Menos lógica no script: Elimina a necessidade de gerenciar manualmente os objetos rules e errosSettings.

- Reatividade Aprimorada: A validação se torna totalmente reativa e integrada ao ciclo de vida dos componentes.

## O Trio Principal da v2.0.0
A nova abordagem é baseada em três exportações principais que você importa diretamente da biblioteca:

1. ```initVrequired()```: Um composable que se torna o novo "cérebro" da sua validação. Ele gerencia todo o estado reativo.

2. ```<VRequired>```: Um componente que "envolve" cada campo do seu formulário que precisa de validação.

3. ```<VRule>```: Um componente "renderless" que você coloca dentro do ```<VRequired>``` para definir cada regra de validação específica para aquele campo.

Como Iniciar

No ```<script setup>``` do seu ambiente, basta chamar o ```initVrequired()``` para obter tudo o que você precisa:

1. ```rules```: Um objeto reativo onde as regras dos componentes ```<VRule>``` serão registradas automaticamente. Você o passa como prop para o ```<VRequired>```.

2. ```config```: O substituto do antigo ```errosSettings```. É um objeto reativo que conterá os erros calculados. O ```<VRequired>``` usa essa prop para obter a lista de erros correta.

3. ```haveError```: Uma função que retorna ```true``` se houver qualquer erro no formulário. Ideal para usar na sua função de envio.

Exemplo 1: Validação de Campos Simples

Para campos de formulário padrão (que não estão em um v-for), a estrutura é simples: envolva seu input com ```<VRequired>``` e declare suas regras com ```<VRule>``` dentro dele.

script:
```html
<script setup>
import { ref, reactive } from "vue";
/* ====== IMPORTS DA BIBLIOTECA V-REQUIRED ====== */
import { initVrequired, VRequired, VRule } from "v-required/validation";
/* ========================================= */

const activeError = ref(false);
const models = reactive({
  nome_curso: "",
  num_vagas: 0,
});
const { rules, config, haveError } = initVrequired()

const enviarFormulario = async () => {
  activeError.value = true;
  // Nova forma de validar, muito mais limpa.
  if (haveError()) {
    // entrou então tem erro e não deixa enviar
    // A rolagem para o erro já é gerenciada pela biblioteca
    return; 

  }
  await submitContent();
};

</script>

```
template:
```html
<template>
  <v-required name="nome_curso" :config="config" :rules="rules" :active-error="activeError">
          <input v-model="models.nome_curso" type="text"
          placeholder="Insira o nome do curso" />
          <v-rule message="O nome do
          curso é obrigatório." :error="() => !models.nome_curso" />
  </v-required>

  <v-required name="num_vagas" :config="config" :rules="rules" :active-error="activeError">
            <input v-model="models.num_vagas" type="number"
            placeholder="Número de vagas" />
            <v-rule message="Insira um número válido de vagas."
                  :error="() => (!models.num_vagas || models.num_vagas === 0) && models.modalidade === '0'" 
            />
            <v-rule 
            message="não pode ser menor que zero."
            :error="() => (models.num_vagas < 0)"
            />
  </v-required>
</template>
```

Exemplo 2: Validação de Campos Dinâmicos (com ```v-for```)
A nova abordagem simplifica drasticamente a validação de campos dinâmicos. Agora, você trata cada campo dinâmico como um campo simples, mas com um nome único que inclui o seu ```index```.

A lógica é a seguinte:

Você mantém o controle total do seu ```v-for```.

Dentro do loop, cada campo a ser validado é envolvido por seu próprio ```<VRequired>```.

A prop ```:name``` do ```<VRequired>``` é construída dinamicamente para ser única (ex: ```:name="'unidade_nome_' + index"```).

Isso "simplifica" a estrutura de regras, tornando-a compatível com a lógica simples, garantindo performance.

Script:
```html
<script setup>
import { ref, reactive } from "vue";
/* ====== IMPORTS DA BIBLIOTECA V-REQUIRED ====== */
import { initVrequired, VRequired, VRule } from "v-required/validation";
/* ========================================= */
const optionsTurnos = ref([
  { name: "Manhã" },
  { name: "Tarde" },
  { name: "Noite" },
]);
const activeError = ref(false);
const models = reactive({
  unidades: [{ nome: "", turnos: "" }],
});

const { rules, config, haveError } = initVrequired()

const enviarFormulario = async () => {
  activeError.value = true;

  if (haveError()) {
    return; 
  }
  await submitContent();
};
/* id serve apenas para ser usado no template como key="unidade.id"
 isso para garantir que quando um item seja deletado não afete os
 outros e o v-for vai saber exatamente quem é dono de cada item */
const id_unico = ref(1);
function addUnidade() {
  // Agora só precisamos nos preocupar com o modelo de dados.
  // A reatividade do Vue e do v-required cuidará da validação.
  models.unidades.push({ nome: "", turnos: "", id: ++id_unico.value });
}
function delUnidade(index) {
  models.unidades.splice(index, 1);
}
</script>

```

Template:
```html
<template>
  <div v-for="(unidade, index) in models.unidades" :key="unidade.id" class="row align-items-center mb-3">
      <v-required :name="`unidade_nome_${unidade.id}`" :config="config" :rules="rules" :active-error="activeError">
        <div class="col-5">
          <input v-model="unidade.nome" type="text" class="form-control"
            placeholder="Nome da unidade" />
        </div>
        <v-rule
        message="O nome da unidade é obrigatório."
        :error="() => !unidade.nome"
        />
      </v-required>

      <v-required :name="`unidade_turnos_${unidade.id}`" :config="config" :rules="rules" :active-error="activeError">
        <div class="col-5">
          <select name="unidade_turnos" v-model="unidade.turnos" class="form-select">
            <option value="" selected disabled hidden>Selecione o turno</option>
            <option v-for="turno in optionsTurnos" :value="turno.name">{{ turno.name }}</option>
          </select>
        </div>
        <v-rule
        message="Selecione um turno válido para a unidade"
        :error="() => !unidade.turnos"
        />
      </v-required>
      <div class="">
        <button @click="delUnidade(index)" class="btn btn-primary">
          Remover Unidade
        </button>
      </div>
    </div>


    <div class="d-flex justify-content-center mt-3">
      <button @click="addUnidade" class="btn btn-primary">
        <span v-html="svgs.plus"></span>Adicionar nova Unidade
      </button>
    </div>
  </div>
</template>
```

## Resumidamente:

- Regras de cada campo são criadas automaticamente quando você insere uma nova ```<v-rule>``` dentro de um ```<v-required>```.

- Quando ```activeError``` for ```true``` o erro será exibido 'caso exista' (mesma lógica da versão antiga)

- Para saber se tem erro em algum campo e fazer o scroll automatico para eles (usar a função ```hasError```)

- Agora rules e config são gerenciadas automaticamente (mas precisam ser passadas como props para o componente)

- Assim como a versão antiga a nova possui exatamente a mesma instalação (a diretiva precisa ser adicionada no main.js)

- Importante lembrar que para os dinâmicos, se for ter uma função para deletar, será preciso um id único para cada campo, garantindo a reatividade correta

# Versão antiga (ainda funcional):

## ✅ Como funciona
🔹 **Lista de validações**

Cada campo pode ter uma lista de validações, onde cada item representa uma regra com:

* ```message```: mensagem que será exibida

* ```condition```: quando essa condição for true, o erro será ativado



#### **Exemplo:**

```javascript
num_vagas = [
    {
      message: "Insira um número válido de vagas.",
      condition:
        (models.num_vagas === 0 ||
        models.num_vagas === null ||
        models.num_vagas === undefined)
    },
    {
        message: "O número máximo de vagas é 10",
        condition: models.num_vagas > 10
    }
  ]
```
🔹 **Ordem de ativação**

A diretiva exibe **apenas o primeiro erro da lista** que for verdadeiro, então a ordem em que estão na lista importa, já que o próximo erro só será exibido caso todas as condições anteriores a ele não são mais verdadeiras.

## 🎯 Abstração: Definindo regras com menos repetição

Para evitar repetir ```message``` e ```condition``` o tempo todo, você pode usar uma estrutura simplificada com arrays:

```javascript
const rules = {
    name: [
        ["O nome do solicitante é obrigatório.", () => (models.name === "" || models.name === undefined)],
    ],
    email: [
        ["O email é obrigatório.", () => (models.email === "" || models.email === undefined)],
        ["Email invalido.", () => !regexEmail.test(models.email)],
    ],

}
```

Essas regras são convertidas internamente para o formato ```message``` **+** ```condition```.


## 🧩 Como aplicar v-required nos inputs

Você envolve o ```<input>``` (textarea, select ou qualquer outro) em uma ```<div>``` com ```v-required```, passando a lista de erros:

```vue
<div
  v-required="{
    list: [
      {
        message: 'O nome do solicitante é obrigatório.',
        condition: models.nome_curso === ''
      }
    ]
  }"
>
  <input
    v-model="models.nome_curso"
    type="text"
    placeholder="Insira o nome do curso"
  />
</div>
```

## 🕹️ Controlando quando os erros aparecem

Use o atributo ```activeError```:

Quando ```false```, **não mostra as mensagens de erro**

Quando ```true```, **mostra as mensagens de erro, caso existam**


```vue
<div
  v-required="{
    list: [...],
    activeError: activeError /*true ou false*/
  }"
>
  <input v-model="..." />
</div>

```





## 🔁 Exemplo 1: Vue 3 + v-required

Você pode visualizar os exemplos no playcode 

- Para ver o exemplo do código: https://playcode.io/vrequired

- Deploy do código de exemplo: https://vrequired.playcode.io/

**Setup**:

* Campos do formulário são reativos

* Regras de validação definidas em rules

* watchEffect para monitorar e aplicar validações em "tempo real"

* Scroll automático para o campo com erro (caso o id seja definido corretamente para o input)

```vue
<script setup>
import { ref, watchEffect, reactive } from "vue"

/*--------------------- Imports da biblioteca v-required ----------------------*/
import { validForm, senderErrors, validate } from "v-required/utils"
/*------------------- Fim dos imports da biblioteca v-required ----------------*/

// Expressão regular para validar o formato de e-mail
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+[^\s@]+$/

// Lista de institutos disponíveis
const dataInstitutos = ref([
    { id: 1, nome: "Instituto de Computação" },
    { id: 2, nome: "Instituto de Biologia" },
    { id: 3, nome: "Instituto de Física" },
    { id: 4, nome: "Instituto de Química" },
    { id: 5, nome: "Instituto de Matemática" },
    { id: 6, nome: "Instituto de Ciências Sociais" },
    { id: 7, nome: "Instituto de História" },
    { id: 8, nome: "Instituto de Geociências" },
])

// Controla se os erros devem ser exibidos na interface
const activeError = ref(false)

/*------------- Modelos dos campos do formulário ----------------*/
const models = reactive({
    name: "",
    email: "",
    instituto: "",
    setor: "",
    predio: "",
    sala: "",
    ramal: "",
    observacoes: "",
})

/*-------------- Configuração dos erros por campo ---------------*/
// campo sala não é obrigatório logo não está sendo avaliado
const errosSettings = reactive({
    name: [],
    email: [],
    instituto: [],
    setor: [],
    predio: [],
    ramal: [],
    observacoes: [],
});

/*-------------------------- Regras de validação --------------------------
 *
 * Cada campo recebe uma lista de regras, onde:
 * - O primeiro item do array é a mensagem de erro a ser exibida.
 * - O segundo item é a função que retorna `true` caso o valor seja inválido.
 * 
 * A validação será reavaliada automaticamente através do `watchEffect`.
 -------------------------------------------------------------------------
 */
const rules = {
    name: [
        ["O nome do solicitante é obrigatório.", () => validate.isEmptyString(models.name)],
    ],
    email: [
        ["O email é obrigatório.", () => validate.isEmptyString(models.email)],
        ["Email invalido.", () => !regexEmail.test(models.email)],
    ],
    instituto: [
        ["O instituto é obrigatório.", () => models.instituto === "" || models.instituto === null || models.instituto === undefined],
    ],
    setor: [
        ["O setor é obrigatório.", () => validate.isEmptyString(models.setor)],
    ],
    predio: [
        ["O número do prédio é obrigatório.", () => models.predio === "" || models.predio === null || models.predio === undefined],
    ],
    ramal: [
        ["O número do ramal é obrigatório.", () => models.ramal === "" || models.ramal === null || models.ramal === undefined],
    ],
    observacoes: [
        ["As observações são obrigatórias.", () => validate.isEmptyString(models.observacoes)],
    ],
};

/*-------------------------- Observador de validação --------------------------
 *
 * O watchEffect irá monitorar reativamente os campos de entrada.
 * A função senderErrors atualiza os erros com base nas regras fornecidas.
 *
 * Comportamento:
 * - Ao detectar alterações nos campos, verifica se os valores são válidos.
 * - Se o valor for inválido, adiciona a mensagem correspondente ao campo.
 * - Caso contrário, remove qualquer erro anteriormente atribuído.
 * - Cada campo é avaliado individualmente, permitindo que o usuário 
 *   veja os erros em "tempo real".
 ------------------------------------------------------------------------------
*/
watchEffect(() => {
    senderErrors(rules, errosSettings)
});


/*-------------------------- Função para envio de dados --------------------------
 *
 * - O envio dos dados só será realizado se todos os campos forem válidos.
 * - Se houver erro, o metodo `validForm()` retornará `true`, impedindo o envio.
 * - `activeError` exibi as mensagens de erro (caso exista) se for true.
 * - Caso exista um erro, o scroll automático será feito até o campo com erro,
 *   se existir um elemento com id `scroll_<nome_do_campo>`.
 * - o <nome_do_campo> é o mesmo nome do campo avaliado no `errosSettings`.
 * 
 * Exemplo: erro no campo "name" → scroll para elemento com id "scroll_name".
 * 
 * - o id "scroll_<nome_do_campo>" deve existir no template 
 *   para que o scroll funcione, e deve ser adicionado manualmente.
 ------------------------------------------------------------------------------*/
async function enviarDados() {

    activeError.value = true

    if (validForm(errosSettings)) {
        return // há pelo menos 1 erro, não envia
    }else{
        try {
            // lógica para enviar os dados
            alert("Dados enviados com sucesso!")
        } catch (e) {
            // lógica para tratar o erros
            alert("Erro ao enviar os dados!")
        }
    }
}
</script>
<template>
    <form class="mt-2" action="">
        <h1 class="title-form">Exemplo de formulário</h1>
        <div class="page-body">
            <div class="container-xl">
                <div class="card">
                    <div class="card-body">
                        <h1 class="title-form">Dados do Solicitante</h1>
                        <div class="row row-cards">
                            <div class="col-sm-6 col-md-6">
                                <label class="form-label required">Nome do Solicitante</label>
                                <div v-required="{
                                    list: errosSettings.name,
                                    activeError: activeError,
                                }
                                    ">
   
                                      <input id="scroll_name" v-model="models.name" type="text"
                                          name="nome_solicitante" maxlength="128"  class="form-control"
                                          placeholder="Nome do Solicitante">

                                </div>

                            </div>
                            <div class="col-sm-6 col-md-6">
                                <div class="md-3 ">
                                    <label class="form-label required">Email do Solicitante</label>
                                    <div v-required="{
                                        list: errosSettings.email,
                                        activeError: activeError,
                                    }">
                                          <input id="scroll_email" v-model="models.email" type="email"
                                              name="email_solicitante" maxlength="254" 
                                              class="form-control" placeholder="Email do Solicitante">
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-6 col-md-6">
                                <div class="md-3" v-required="{
                                    list: errosSettings.instituto,
                                    activeError: activeError,
                                }">
                                    <label class="form-label required">Instituto</label>
                                    <select id="scroll_instituto" v-model="models.instituto"  
                                        class="form-select">
                                        <option value="" selected disabled hidden>Selecione um instituto</option>
                                        <option v-for="(item, index) in dataInstitutos" :key="index" :value="item.id">
                                            {{ item.nome }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-6 col-md-6">
                                <div class="md-3" v-required="{
                                    list: errosSettings.setor,
                                    activeError: activeError,
                                }">
                                    <label class="form-label required">Departamento</label>
                                    <input id="scroll_setor" v-model="models.setor" type="text" name="setor"
                                        maxlength="128"  class="form-control"
                                        placeholder="Nome do Departamento">
                                </div>
                            </div>

                            <div class="col-sm-4 col-md-4">
                                <div class="md-3" v-required="{
                                    list: errosSettings.predio,
                                    activeError: activeError,
                                }">
                                    <label class="form-label required">Número do Prédio</label>
                                    <input id="scroll_predio" v-model="models.predio" type="text" name="num_predio"
                                         class="form-control" placeholder="Número do Prédio">
                                </div>
                            </div>
                            <div class="col-sm-4 col-md-4">
                                <label class="form-label ">Número da Sala</label>
                                <input id="scroll_sala" v-model="models.sala" type="text" name="num_sala"
                                    class="form-control" placeholder="Número da Sala" maxlength="20">
                            </div>
                            <div class="col-sm-4 col-md-4">
                                <div class="md-3" v-required="{
                                    list: errosSettings.ramal,
                                    activeError: activeError,
                                }">
                                    <label class="form-label required">Número do Ramal</label>
                                    <input id="scroll_ramal" v-model="models.ramal" type="text" name="num_ramal"
                                         class="form-control" placeholder="Número do Ramal">
                                </div>
                            </div>

                            <div class="mb-3" v-required="{
                                list: errosSettings.observacoes,
                                activeError: activeError
                            }">
                                <label class="form-label required">Observações</label>
                                <textarea id="scroll_observacoes" v-model="models.observacoes" name="observacoes"
                                    cols="40" rows="10" class="form-control" style="height: 100px;"
                                    placeholder="Observações e testes realizados"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="botoes d-flex justify-content-end">
                        <div class="py-3">
                            <button @click.prevent="enviarDados" type="submit" class="btn btn-primary w-100 bold">
                                Enviar dados
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>
<style scoped>
.title-form {
    display: flex;
    justify-content: center;
}

.bold {
    font-weight: bold;
}

.botoes {
    display: flex;
    justify-content: space-between;
}
</style>
```

## 🔁 Exemplo 2: v-required com campos dinâmicos

Você pode visualizar os exemplos no playcode 

- Para ver o exemplo do código: https://playcode.io/vrequired

- Deploy do código de exemplo: https://vrequired.playcode.io/

Neste exemplo, você poderá adicionar múltiplas unidades ao formulário. As unidades são campos dinâmicos que permitem inserir diferentes opções de nome da unidade e turnos de aulas de forma interativa.

O formulário está configurado para permitir que o usuário adicione quantas unidades forem necessárias, com validação de campos para garantir que os dados sejam inseridos corretamente.

Você pode adicionar mais unidades clicando no botão "Adicionar nova Unidade" e, caso necessário, remover as unidades já adicionadas.

Além disso, a validação dinâmica garante que todos os campos obrigatórios sejam preenchidos antes do envio.


```vue
<script setup>
import { ref, watchEffect, reactive } from "vue"

/*--------------------- Imports da biblioteca v-required ----------------------*/
import { validForm, senderErrorsDynamic , validate } from "v-required/utils"
/*------------------- Fim dos imports da biblioteca v-required ----------------*/

const unidades = ref([
    {"nome": "Vila da folha"},
    {"nome": "Cidade do Oeste"},
    {"nome": "Casa do Kame"},
    {"nome": "Hogwarts"},
    {"nome": "U.A."},
    {"nome": "Instituto Alien"},
    {"nome": "Associação de Heróis"},
    {"nome": "Hunter"},
])
// Controla se os erros devem ser exibidos na interface
const activeError = ref(false)

/*------------------------ Modelo de dados ------------------------
 * Ao contrário da validação simples, aqui usamos um array de objetos
 * pois o número de "unidades" pode variar dinamicamente durante o uso.
 ------------------------------------------------------------------*/
const models = reactive({
  unidades: [
    {
      nome: "",
      turnos: "",
    },
  ],
})

/*------------------------ Estrutura de erros ------------------------
 * A estrutura de erros acompanha o modelo de dados dinâmico.
 * Cada item do array `unidades` terá seu próprio objeto com arrays de erro.
 * Obs: Campos simples podem coexistir com campos dinâmicos normalmente.
 ----------------------------------------------------------------------*/
const errosSettings = reactive({
  unidades: [
    {
      nome: [],
      turnos: [],
    },
  ],
});

/*---------------------- Regras de validação dinâmicas ------------------------
 * Aqui definimos as regras de forma que recebam o `index`, pois os dados
 * estão dentro de arrays. Essa é a principal diferença para o uso com campos simples.
 * As funções de validação devem acessar os dados por `models.unidades[index]`.
 ------------------------------------------------------------------------------*/
const rules_dynamic = {
  unidades: {
    nome: [
      ["O nome da unidade é obrigatório.", (index) => models.unidades[index].nome === "" || models.unidades[index].nome === null || models.unidades[index].nome === undefined,],
    ],
    turnos: [
      ["O turno da unidade é obrigatório.",(index) => (models.unidades[index].turnos === "" || models.unidades[index].turnos === null || models.unidades[index].turnos === undefined || models.unidades[index].turnos.length === 0) ],
    ],
  },
}



/*---------------------- Observador de validação -----------------------
 * Diferença principal em relação à validação simples:
 * Utilizamos `senderErrorsDynamic` em vez de `senderErrors`,
 * pois estamos lidando com campos replicáveis e dinâmicos (arrays).
 * Ambas funções podem coexistir na mesma aplicação.
 * 
 * Atenção: o nome dos campos devem ter o mesmo nome na rules_dynamic e 
 * no erroSettings, caso contrário não funcionará corretamente.
 * 
 * exemplo: se você tem um campo chamado `nome` no erroSettings,
 *          você deve trata-lo com o mesmo nome na rules_dynamic.
 ----------------------------------------------------------------------*/
watchEffect(() => {
    senderErrorsDynamic(rules_dynamic, errosSettings)
});

/*-------------------------- Função para envio de dados --------------------------
 * Diferença em relação à validação simples:
 * → A função `validForm` continua funcionando normalmente, mesmo com campos dinâmicos.
 *
 * → Contudo, **scrolls automáticos para erro** devem ser tratados **diferentemente** agora:
 *    como os campos fazem parte de um array, você precisa garantir que o elemento alvo tenha um `id` único,
 *    isso é feito acompanhado pelo índice do item.
 *
 * Exemplo: `scroll_unidades_nome_0`, `scroll_unidades_turnos_1`, etc.
 * Isso permite rolar a página corretamente até o campo com erro.
 ------------------------------------------------------------------------------*/
async function enviarDados() {

    activeError.value = true

    if (validForm(errosSettings)) {
        return // há pelo menos 1 erro, não envia
    }else{
        try {
            // lógica para enviar os dados
            alert("Dados enviados com sucesso!")
        } catch (e) {
            // lógica para tratar o erros
            alert("Erro ao enviar os dados!")
        }
    }
}
/*---------------------- Gerenciamento dinâmico -----------------------
 * Permite adicionar ou remover unidades no formulário.
 * Importante: ao adicionar uma unidade, também adicionamos um objeto
 * correspondente na estrutura de erros.
 ----------------------------------------------------------------------*/
function addUnidade() {
  models.unidades.push({ nome: "", turnos: "" });
  errosSettings.unidades.push({ nome: [], turnos: [] });
}
function delUnidade(index) {
  models.unidades.splice(index, 1);
  errosSettings.unidades.splice(index, 1);
}
</script>
<template>
    <form class="mt-2" action="">
        <h1 class="title-form">Exemplo de formulário</h1>
        <div class="page-body">
            <div class="container-xl">
                <div class="card">
                    <div class="card-body">
                        <h1 class="title-form">Vlidação dinâmica </h1>
                        <div class="row row-cards">
                            
                            <h1 class="text-center">Unidades</h1>
                            <template v-if="models.unidades.length > 0">
                              <div class="d-flex gap-3 justify-content-center position-relative"
                                :class="models.unidades.length !== index + 1 ? 'mb-3' : ''" v-for="(item, index) in models.unidades"
                                :key="index">
                                <h2 class="p-0 m-0 fs-4" :class="index === 0 ? 'mt-4' : ''">
                                  Dados Unidade {{ index + 1 }}:
                                </h2>
                                <div v-required="{
                                  list: errosSettings.unidades[index].nome,
                                  activeError: activeError,
                                }">
                                  <label class="fs-3 bold texto-unidades" for="" v-if="index === 0">Nome da unidade:</label>
                                  <select v-model="models.unidades[index].nome" :class="index === 0 ? 'mt-4' : ''"
                                    :id="`scroll_unidades_nome_${index}`" class="form-select" name="">
                                    <option value="" selected disabled hidden>
                                      Selecione a unidade
                                    </option>
                                    <option v-for="unidade in unidades" :key="unidade.nome" :value="unidade.nome">
                                      {{ unidade.nome }}
                                    </option>
                                  </select>

                                </div>
                                <div v-required="{
                                  list: errosSettings.unidades[index].turnos,
                                  activeError: activeError,
                                }">
                                  <label class="fs-3 bold texto-unidades" for="" v-if="index === 0">Turnos de aula:</label>

                                   <input type="text" name="" 
                                      v-model="models.unidades[index].turnos" 
                                      :id="`scroll_unidades_turnos_${index}`" class="form-control" 
                                      :class="index === 0 ? 'mt-4' : ''" placeholder="Escreva os turnos"
                                   >

                                </div>
                                <div v-if="index > 0" class="space-padrao">
                                  <button @click="delUnidade(index)" class="btn-custom">
                                    <span class="" >Del</span>
                                  </button>
                                </div>
                                <div v-if="index === 0 && models.unidades.length > 1" class="space-padrao"></div>
                              </div>
                            </template>
                            <span v-else class="text-center text-primary">Nenhuma Unidade Informada</span>
                            <div class="d-flex justify-content-center mt-3">
                              <button @click="addUnidade" type="button" class="btn btn-primary">
                                Adicionar nova Unidade
                              </button>
                            </div>
                            
                        </div>
                    </div>
                    <div class="botoes d-flex justify-content-end">
                        <div class="py-3">
                            <button @click.prevent="enviarDados" type="submit" class="btn btn-primary w-100 bold">
                                Enviar dados
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>
<style scoped>
.title-form {
    display: flex;
    justify-content: center;
}

.bold {
    font-weight: bold;
}

.botoes {
    display: flex;
    justify-content: space-between;
}


.space-padrao {
  width: 40px;
}

.btn-custom {
  background: none;
  border: 2px solid #00000045;
  color: black;
  border-radius: 50%;
  padding: 0.2rem;
  cursor: pointer;
}

.texto-unidades {
  position: absolute;
  top: 0;

}
</style>
```

## Usando o `v-required` com TypeScript

O `v-required` oferece suporte completo à tipagem com TypeScript, o que torna a validação de formulários mais segura e previsível durante o desenvolvimento.

Ao importar as tipagens disponibilizadas pelo pacote, como `RulesMap` e `ErrosSettings`, você garante:

- **Prevenção de erros** ao usar os campos de validação;
- **Maior legibilidade** e manutenção do código.

### Exemplo de uso com tipagem:

```ts
import { reactive, ref, watchEffect } from "vue";

/*--------------------- Imports do v-required ----------------------*/
import { validForm, senderErrors, validate } from "v-required/utils";
import type { RulesMap, ErrosSettings } from "v-required/types";
/*------------------ Fim dos imports ---------------------*/

// Tipagem reativa para armazenar os erros dos campos
const errosSettings: ErrosSettings = reactive({
  titulo: [],
  editorContent: [],
  file: [],
});

// Funções auxiliares de validação
function checkHasFile(file: File | null): boolean {
  return !file;
}
function checkFileSize(file: File | null): boolean {
  if (!file) return true;
  const maxSize = 5 * 1024 * 1024; // 5MB
  return file.size <= maxSize;
}
function checkFileType(file: File | null): boolean {
  if (!file) return true;
  const allowedTypes = ["application/pdf"];
  return allowedTypes.includes(file.type);
}

// Regras com tipagem garantida
const rules: RulesMap = {
  titulo: [
    [
      "O nome do curso é obrigatório.",
      () => validate.isEmptyString(models.titulo),
    ],
  ],
  editorContent: [
    [
      "O conteúdo é obrigatório.",
      () => validate.isEmptyString(models.editorContent),
    ],
  ],
  file: [
    ["O arquivo é obrigatório.", () => checkHasFile(models.file)],
    ["O arquivo deve ser do tipo PDF.", () => !checkFileType(models.file)],
    ["O arquivo deve ter no máximo 5MB.", () => !checkFileSize(models.file)],
  ],
};

watchEffect(() => {
  senderErrors(rules, errosSettings);
});

```


## 📦 Atualização v1.1.2

### ✨ Novidade

A partir da versão 1.1.2, agora é possível inicializar `errosSettings` como um objeto vazio!

```js
const errosSettings = reactive({});
```
As funções:

- `senderErrors`

- `senderErrorsDynamic`

passam a montar automaticamente a estrutura do objeto reativo `errosSettings` com base nas regras (`rules`) definidas, eliminando a necessidade de declarar previamente todas as chaves.

### ✅ Benefícios

- Menos repetição e código

- Inicialização dinâmica e automática

- Melhor escalabilidade para formulários grandes





















