// Item de erro individual
interface ErrorItem {
    message: string;
    condition: boolean;
}

// Configurações de erro para qualquer campo
type ErrosSettings = Record<string, ErrorItem[]>;

// Para campos com subcampos dinâmicos (ex: arrays de objetos)
type ErrosSettingsDynamic = Record<string, Array<Record<string, ErrorItem[]>>>;

// Regras estáticas
type Rule = [string, () => boolean];

// Regras dinâmicas (com index)
// index é o que está sendo validado
type DynamicRule = [string, (index: number) => boolean];

// Utilitário de validação
interface ValidateUtils {
    isEmptyString(value: string | null | undefined): boolean;
}


// Diretiva de binding
interface ValidationItem {
    message: string;
    condition: boolean[];
}

interface BindingValue {
    list: ValidationItem[];
    activeError?: boolean;
}

// Declaração do módulo
declare module "v-required" {
    const directive: {
        mounted(el: HTMLElement, binding: { value: BindingValue }): void;
        updated(el: HTMLElement, binding: { value: BindingValue }): void;
    };
    export default directive;

}
declare module "v-required/utils" {
    const validate: ValidateUtils;
    function validForm(
        errosSettings: ErrosSettings | ErrosSettingsDynamic
    ): boolean;
    function senderErrors(
        rules: Record<string, Rule[]>,
        errosSettings: ErrosSettings
    ): void;
    function senderErrorsDynamic(
        rules: Record<string, Record<string, DynamicRule[]>>,
        errosSettings: ErrosSettingsDynamic
    ): void
    export {
        validate, senderErrors, senderErrorsDynamic, validForm 
    } ;
}
