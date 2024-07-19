export class FetchJapaneseCardPrices {
    constructor(tcgCardPriceRepository) {
        this.tcgCardPriceRepository = tcgCardPriceRepository;
    }

    getCommandName = () => {
        return 'FetchJapaneseCardPrices';
    }

    handle = async (payload) => {
        return await this.tcgCardPriceRepository.findByExpansion(payload.expansionCode);
    }
}