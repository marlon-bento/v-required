[< Voltar para README principal](../README.md)
# 🎨 Estilização do `v-required`

A diretiva `v-required` aplica automaticamente classes que ajudam a exibir e destacar erros de validação.

### 📋 Tabela de classes utilizadas

| Classe                             | Aplicada em            | Descrição                                                                 |
|-----------------------------------|-------------------------|---------------------------------------------------------------------------|
| `.v-required-span`                | `<span>` de erro        | Exibe a mensagem de erro após o input.                                   |
| `.style-custom-v-required-default` | `div` com `v-required`  | Sempre presente. Estilo base do container.                               |
| `.style-custom-v-required-error`   | `div` com erro          | Aplicada apenas quando há erro. Removida automaticamente ao corrigi-lo.  |

---

## 🛑 Sobre o scoped: cuidado!

Como o ```span``` de erro (```v-required-span```) é **injetado dinamicamente por fora do seu template Vue**, ele **não pode ser estilizado diretamente dentro de um** ```<style scoped>```, a não ser que você use o seletor **deep**.

#### ✅ Como fazer com deep:
```vue
<style scoped>
    ::v-deep(.v-required-span) {
        color: var(--color-error) !important;
        white-space: pre-wrap;
    }
</style>
```
## Exemplo de estilização

#### ✏️ Estilos padrão

📌 Span com mensagem de erro

```css
.v-required-span {
  color: var(--color-error) !important;
  white-space: pre-wrap;
}
```

📌 Estilização dos campos com erro (input, select, textarea, etc... )
```css
.style-custom-v-required-error input {
  border: 2px solid var(--color-error) !important;
  color: var(--color-error) !important;
}

.style-custom-v-required-error select {
  border: 2px solid var(--color-error) !important;
  color: var(--color-error) !important;
}

.style-custom-v-required-error textarea {
  border: 2px solid var(--color-error) !important;
  color: var(--color-error) !important;
}
```


