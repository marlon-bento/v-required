//-------------------- types v-required -------------------------
type ValidationRule = [message: string, condition: () => boolean];
type DynamicValidationRule = [message: string, condition: (index: number) => boolean];
export type ErrosDynamicField = Array<Record<string, ValidationError[]>>;
export type ValidationError = {
  message: string;
  condition: boolean;
};

export type RulesMap = Record<string, ValidationRule[] >;
export type RulesDynamicMap = Record<string, Record<string, DynamicValidationRule[]>>;
export type ErrosSettings = Record<string, ValidationError[] | ErrosDynamicField>;
//--------------------- fim types v-required --------------------