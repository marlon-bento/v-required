// src/keys.ts
import type { InjectionKey, Slot, Reactive } from 'vue'

export interface VRequiredApi {
  error: () => boolean;
  message: string;
  bodySlot?: Slot;
}

export interface VRequiredKey {
  addRule: (config: VRequiredApi) => void;
}
type AnyObject = any;

export const vRequiredApiKey: InjectionKey<VRequiredKey> = Symbol('v-required-key')
export const vRequiredRulesKey = Symbol('vRequiredRules') as InjectionKey<Reactive<AnyObject>>;
export const vRequiredConfigKey = Symbol('vRequiredConfig') as InjectionKey<Reactive<AnyObject>>;

export interface PaginationObject {
  current_page: number;
  count: number;
  limit_per_page: number;
  search: string;
  filter: string;
}