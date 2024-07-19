import {KEY_CURRENCY_RATE_JPY_TO_USD} from "../KeyValueRepository";
import {DateTime} from "luxon";

export class FetchJapaneseCardPricesMessageHandler {
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
        const today = DateTime.now();

        if (!rate || !today.hasSame(DateTime.fromJSDate(new Date(rate.updatedOn)), 'day', {})) {
            // Currency need to be imported for today.
            const rates = await this.currencyApi.getRatesForJpy();

            await this.keyValueRepository.save(
                KEY_CURRENCY_RATE_JPY_TO_USD,
                rates.jpy.usd,
                new Date(),
            );
        }

        const conversionRate = await this.keyValueRepository.find(KEY_CURRENCY_RATE_JPY_TO_USD);
        const cards = await this.tcgCardPriceRepository.findByCardsIds(payload.cardIds);

        cards.forEach(card => {
            card.priceInUsd = null;
            if (card.prices.length > 0) {
                // First try to find a price in JPY for "NM" card.
                let price = card.prices.find(
                    price => price.priceCurrency === 'JPY' && price.condition === 'NM'
                );

                if (!price) {
                    // If not found, use any price in JYP.
                    price = card.prices.find(price => price.priceCurrency === 'JPY');
                }

                if (!price) {
                    // If not found, use price in USD for "Ungraded" card.
                    price = card.prices.find(
                        price => price.priceCurrency === 'USD Cents' && price.condition === 'Ungraded'
                    );
                }

                if (!price) {
                    // If not found, use first price.
                    price = card.prices[0];
                }

                if (price.priceCurrency === 'USD Cents') {
                    card.priceInUsd = (price.priceAmount / 100).toFixed(2);
                } else if (price.priceCurrency === 'JPY') {
                    card.priceInUsd = (price.priceAmount * conversionRate.value).toFixed(2);
                }

                card.urlToListing = price.listingUrl;
            }
        });

        return cards;
    }
}