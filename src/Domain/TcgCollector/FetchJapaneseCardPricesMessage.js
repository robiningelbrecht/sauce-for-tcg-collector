import {KEY_CURRENCY_RATE_JPY_TO_USD} from "../KeyValueRepository";

export class FetchJapaneseCardPricesMessage {
    constructor(tcgCardPriceRepository, keyValueRepository, currencyApi) {
        this.tcgCardPriceRepository = tcgCardPriceRepository;
        this.keyValueRepository = keyValueRepository;
        this.currencyApi = currencyApi;
    }

    static getId = () => {
        return 'FetchJapaneseCardPrices';
    }

    handle = async (payload) => {
        const rate = await this.keyValueRepository.find(KEY_CURRENCY_RATE_JPY_TO_USD);
        if (!rate || (new Date()).setHours(0, 0, 0, 0) !== (new Date(rate.updatedOn)).setHours(0, 0, 0, 0)) {
            // Currency need to be imported for today.
            const rates = await this.currencyApi.getRatesForJpy();

            await this.keyValueRepository.save(
                KEY_CURRENCY_RATE_JPY_TO_USD,
                rates.jpy.usd,
                new Date(),
            );
        }

        const conversionRate = await this.keyValueRepository.find(KEY_CURRENCY_RATE_JPY_TO_USD);
        const cards = await this.tcgCardPriceRepository.findByExpansion(payload.expansionCode);

        cards.forEach(card => {
            card.priceInUsdInCents = null;
            if (card.prices.length > 0) {
                // @TODO: Use correct price source.
                card.priceInUsdInCents = (card.prices[0].priceAmount * conversionRate.value).toFixed(2);
            }
        });

        return cards;
    }
}