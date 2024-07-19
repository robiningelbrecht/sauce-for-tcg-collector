export class TcgCardPriceRepository {
    constructor(connection) {
        this.connection = connection;
    }

    deleteForExpansion = async (expansionCode) => {
        const cardIds = await this.connection.TcgCardPrice.where('expansionCode').equals(expansionCode).primaryKeys();
        await this.connection.TcgCardPrice.bulkDelete(cardIds);
    }

    findByExpansion = async (expansionCode) => {
        const collection = await this.connection.TcgCardPrice.where('expansionCode').equals(expansionCode);
        return collection.toArray();
    }

    findByCardsIds = async (cardsIds) => {
        const collection = await this.connection.TcgCardPrice.where('tcgCardId').anyOf(cardsIds);
        return collection.toArray();
    }

    save = async (tcgCardPrice) => {
        await this.connection.TcgCardPrice.put(tcgCardPrice);
    }
}