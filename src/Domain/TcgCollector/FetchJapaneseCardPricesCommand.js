export class FetchJapaneseCardPricesCommand {
    constructor(tcgCardPriceRepository) {
        this.tcgCardPriceRepository = tcgCardPriceRepository;
    }

    static getCommandName = () => {
        return 'FetchJapaneseCardPrices';
    }

    handle = async (payload) => {
        return await this.tcgCardPriceRepository.findByExpansion(payload.expansionCode);
    }
}