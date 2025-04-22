//-------------------- types v-required -------------------------
type ValidationRule = [message: string, condition: () => boolean];
type ValidationError = {
  message: string;
  condition: boolean;
};
export type RulesMap = Record<string, ValidationRule[]>;
export type ErrosSettings = Record<string, ValidationError[]>;
//--------------------- fim types v-required --------------------