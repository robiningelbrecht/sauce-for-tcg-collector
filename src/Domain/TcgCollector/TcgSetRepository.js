export class TcgSetRepository{
    constructor(connection) {
        this.connection = connection;
    }

    findAll = async () => {
        return await this.connection.TcgSet.toArray();
    };


}