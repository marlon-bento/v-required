import {  onMounted, reactive, provide } from 'vue';
import { validForm, senderErrors } from "../utils"
import { vRequiredRulesKey, vRequiredConfigKey } from '../keys/keys';

type AnyObject = any;

export function initVrequired() {
    const rules = reactive<AnyObject>({})
    const config = reactive<AnyObject>({})

    provide(vRequiredRulesKey, rules);
    provide(vRequiredConfigKey, config);
    
    const haveError = () => {
        senderErrors(rules, config);
        return validForm(config)
    }

    onMounted(() => {
        senderErrors(rules, config);
    });


    return { rules, config, haveError };
}