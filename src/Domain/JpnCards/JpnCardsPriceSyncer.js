import {JpnCardsApi} from "./JpnCardsApi";

export class JpnCardsPriceSyncer {
    constructor() {
        this.api = new JpnCardsApi();
    }

    syncAndPersistForExpansion = async (expansionCode) => {
        const sets = (await this.api.getSets()).filter(set => set.set_code.toLowerCase() === expansionCode);
        if (sets.length !== 1) {
            throw new Error('Could not sync set');
        }

        console.log(sets.at(0));

        const cards = await this.api.getCardsForSet(expansionCode);
        console.log(cards);
    }
}