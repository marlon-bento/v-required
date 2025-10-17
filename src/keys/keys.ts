// src/keys.ts
import type { InjectionKey, Slot } from 'vue'

export interface VRequiredApi {
  error: () => boolean;
  message: string;
  bodySlot?: Slot;
}

export interface VRequiredKey {
  addRule: (config: VRequiredApi) => void;
}

export const vRequiredApiKey: InjectionKey<VRequiredKey> = Symbol('v-required-key')

export interface PaginationObject {
  current_page: number;
  count: number;
  limit_per_page: number;
  search: string;
  filter: string;
}