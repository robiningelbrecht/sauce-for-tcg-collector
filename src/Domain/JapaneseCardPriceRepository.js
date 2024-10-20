export class JapaneseCardPriceRepository {
    constructor(settings) {
        this.settings = settings;
    }

    findByCardIds = async (cardsIds) => {
        const response = await fetch(this.settings.getJapaneseCardPricesUrl());
        const json = await response.json();

        return json.cards.filter((card) => cardsIds.includes(card.cardId));
    }

    findTotalCollectionValue = async () => {
        const response = await fetch(this.settings.getJapaneseCardPricesUrl());
        const json = await response.json();

        return json.totalCollectionValue;
    }
}