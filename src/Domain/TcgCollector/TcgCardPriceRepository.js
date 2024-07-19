import {KEY_CURRENCY_RATE_JPY_TO_USD, KeyValueRepository} from "../KeyValueRepository";

export class TcgCardPriceRepository{
    constructor(connection, keyValueRepository) {
        this.connection = connection;
        this.keyValueRepository = keyValueRepository;
    }

    deleteForExpansion = async (expansionCode) => {
        const cardIds = await this.connection.TcgCardPrice.where('expansionCode').equals(expansionCode).primaryKeys();
        await this.connection.TcgCardPrice.bulkDelete(cardIds);
    }

    findByExpansion = async (expansionCode)=> {
        const conversionRate = await this.keyValueRepository.find(KEY_CURRENCY_RATE_JPY_TO_USD);
        const cards = await this.connection.TcgCardPrice.where('expansionCode').equals(expansionCode).toArray();

        cards.forEach(card => {
            card.priceInUsdInCents = null;
            if (card.prices.length > 0) {
                card.priceInUsdInCents = (card.prices[0].priceAmount * conversionRate.value).toFixed(2);
            }
        });
        return cards;
    }

    save = async (tcgCardPrice) => {
        await this.connection.TcgCardPrice.put(tcgCardPrice);
    }
}