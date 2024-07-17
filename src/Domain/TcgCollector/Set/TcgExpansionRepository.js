export class TcgExpansionRepository {
    constructor(connection) {
        this.connection = connection;
    }

    findAll = async () => {
        return await this.connection.TcgExpansion.toArray();
    };


}