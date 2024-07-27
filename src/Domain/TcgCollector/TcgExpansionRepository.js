export class TcgExpansionRepository {
    constructor(connection) {
        this.connection = connection;
    }

    save = async (tcgExpansion) => {
        await this.connection.TcgExpansion.put(tcgExpansion);
    }

    find = async (expansionCode) => {
        return await this.connection.TcgExpansion.get(expansionCode);
    };

    findAll = async () => {
        const collection = this.connection.TcgExpansion;
        return collection.toArray();
    };


}