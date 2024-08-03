export class TcgCardPriceRepository {
    constructor(connection) {
        this.connection = connection;
    }

    findByCardsIds = async (cardsIds) => {
        const collection = await this.connection.TcgCardPrice.where('cardId').anyOf(cardsIds);
        return collection.toArray();
    }

    findUniqueExpansionIds = async (cardsIds) => {
        const cards = await this.connection.TcgCardPrice.toArray();

        cards.map(card => card.expansionId);
        return [...new Set(cards.map(card => card.expansionId))];
    }

    save = async (tcgCardPrice) => {
        await this.connection.TcgCardPrice.put(tcgCardPrice);
    }
}