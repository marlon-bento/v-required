# Documentação  `v-required`


[![npm version](https://img.shields.io/npm/v/v-required)](https://www.npmjs.com/package/v-required)
[![License: MIT](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)
[![Built with TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-blue)](https://www.typescriptlang.org/)
<!---
[![jsDelivr hits (monthly)](https://img.shields.io/jsdelivr/npm/hm/v-required)](https://www.jsdelivr.com/package/npm/v-required)
-->

<img align="center" width="50%" alt="js-icon"  src="./v-required-logo.jpeg">


Elimine a repetição de validações manuais nos seus projetos Vue.js. O `v-required` oferece uma abordagem **declarativa**, **automatizada** e **escalável** para gerenciar validações de campos de formulário.



---

## 🚀 O que é o `v-required`?

`v-required` é uma diretiva Vue 3 pensada para facilitar o gerenciamento de validações de formulários. Ela automatiza tarefas comuns como:

- Validação de campos obrigatórios
- Exibição de mensagens de erro
- Estilização visual de campos inválidos
- Scroll automático até o primeiro erro

Tudo isso com **mínima configuração** e foco em **manutenibilidade e legibilidade** do código.

---

## 🎯 Quando usar?

Este projeto é ideal para aplicações Vue 3 que precisam de:

- Gerenciamento centralizado de validações
- Scroll automático ao primeiro campo inválido
- Código mais limpo e padronizado
- Baixo acoplamento entre regras de validação e visualização

---

## 🔧 Como funciona?

A diretiva `v-required` age como uma camada de abstração para validações em formulários Vue. Ela utiliza os recursos do Vue de forma reativa, mantendo o controle visual e funcional dos inputs.

**Benefícios:**
- Não é intrusiva
- Usa `refs`, eventos e listeners do Vue
- Permite personalização por classes
- Torna fácil estender para regras mais complexas

---

## 📚 Sumário

- [Instalação](#📦instalação)
  - [Instalar a biblioteca](#instalar-a-biblioteca)
  - [Instanciar a diretiva](#instanciar-a-diretiva)
- [Introdução](introducao/README.md)
- [Estilização](estilizacao/README.md)

---

## 📦 Instalação

### Instalar a biblioteca

```sh
npm install v-required
```


## Instanciar a diretiva
```javascript
import vRequired from "v-required"
import { createApp } from 'vue'

const app = createApp(App)

// adicionar a diretiva v-required
app.directive("required", vRequired);

app.mount('#app')
```

