export class TcgCardPriceRepository {
    constructor(connection) {
        this.connection = connection;
    }

    findByCardsIds = async (cardsIds) => {
        const collection = await this.connection.TcgCardPrice.where('cardId').anyOf(cardsIds);
        return collection.toArray();
    }

    save = async (tcgCardPrice) => {
        await this.connection.TcgCardPrice.put(tcgCardPrice);
    }
}