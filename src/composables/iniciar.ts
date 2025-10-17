import {  onMounted, reactive } from 'vue';
import { validForm, senderErrors } from "../utils"

type AnyObject = any;

export function initVrequired() {
    const rules = reactive<AnyObject>({})
    const config = reactive<AnyObject>({})
    
    const haveError = () => {
        senderErrors(rules, config);
        return validForm(config)
    }

    onMounted(() => {
        senderErrors(rules, config);
    });


    return { rules, config, haveError };
}