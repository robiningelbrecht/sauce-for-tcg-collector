import {DateTime} from "luxon";

export class SyncExpansionJpnCardPricesMessageHandler {
    constructor(api, tcgExpansionRepository, tcgCardPriceRepository) {
        this.api = api;
        this.tcgExpansionRepository = tcgExpansionRepository;
        this.tcgCardPriceRepository = tcgCardPriceRepository;
    }

    static getId = () => {
        return 'SyncJapanesePrices';
    }

    getSuccessMessage = (payload) => {
        return `Prices for expansion "${payload.expansionCode}" have been synced`;
    }

    handle = async (payload) => {
        const expansionCode = payload.expansionCode;
        const sets = (await this.api.getSets()).filter(set => set.set_code.toLowerCase() === expansionCode);
        if (sets.length !== 1) {
            throw new Error(`Prices for expansion "${expansionCode}" not found`);
        }

        const set = sets.at(0);
        const cards = await this.api.getCardsForSet(expansionCode);

        await this.tcgExpansionRepository.save({
            expansionCode: set.set_code.toLowerCase(),
            expansionName: set.name,
            updatedOn: DateTime.now().toISO()
        });

        await this.tcgCardPriceRepository.deleteForExpansion(expansionCode);

        for (const card of cards.data) {
            await this.tcgCardPriceRepository.save({
                tcgCardId: parseInt(card.cardUrl.replace('https://tcgcollector.com/cards/', '')),
                cardNumber: card.sequenceNumber,
                expansionCode: expansionCode,
                prices: card.prices,
            });
        }
    }
}