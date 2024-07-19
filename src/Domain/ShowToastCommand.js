import {Toast} from "../Component/Toast";

export class ShowToastCommand {
    constructor() {

    }

    getCommandName = () => {
        return 'FetchJapaneseCardPrices';
    }

    handle = (payload) => {
        (new Toast(payload.type, payload.msg)).show()
    }


}