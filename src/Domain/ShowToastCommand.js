import {Toast} from "../Component/Toast";

export class ShowToastCommand {
    constructor() {

    }

    static getCommandName = () => {
        return 'ShowToastCommand';
    }

    handle = (payload) => {
        (new Toast(payload.type, payload.msg)).show()
    }


}