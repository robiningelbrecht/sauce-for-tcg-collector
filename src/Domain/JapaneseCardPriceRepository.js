import Dinero from 'dinero.js'

export class JapaneseCardPriceRepository {
    constructor(settings) {
        this.settings = settings;
    }

    findByCardIds = async (cardsIds) => {
        const response = await fetch(this.settings.getJapaneseCardPricesUrl());
        const json = await response.json();

        return json.cards.filter((card) => cardsIds.includes(card.cardId));
    }

    findTotalCollectionValueFor = async (region) => {
        const response = await fetch(this.settings.getJapaneseCardPricesUrl());
        const json = await response.json();

        return Dinero(json.totalCollectionValue[region]);
    }

    findTotalCollectionValue = async () => {
        const response = await fetch(this.settings.getJapaneseCardPricesUrl());
        const json = await response.json();

        return Dinero(json.totalCollectionValue.jp).add(Dinero(json.totalCollectionValue.intl));
    }
}