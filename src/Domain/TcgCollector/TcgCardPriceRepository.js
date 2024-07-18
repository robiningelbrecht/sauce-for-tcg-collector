export class TcgCardPriceRepository{
    constructor(connection) {
        this.connection = connection;
    }

    deleteForExpansion = async (expansionCode) => {
        const cardIds = await this.connection.TcgCardPrice.where('expansionCode').equals(expansionCode).primaryKeys();
        await this.connection.TcgCardPrice.bulkDelete(cardIds);
    }

    findByExpansion = async (expansionCode)=> {
        return this.connection.TcgCardPrice.where('expansionCode').equals(expansionCode).toArray();
    }

    save = async (tcgCardPrice) => {
        await this.connection.TcgCardPrice.put(tcgCardPrice);
    }
}