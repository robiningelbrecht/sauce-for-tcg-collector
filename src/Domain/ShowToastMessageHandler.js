import {Toast} from "../Component/Toast";

export class ShowToastMessageHandler {
    constructor() {

    }

    static getId = () => {
        return 'ShowToast';
    }

    handle = (payload) => {
        (new Toast(payload.type, payload.msg)).show()
    }


}