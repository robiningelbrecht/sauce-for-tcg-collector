export class TcgExpansionMetadataRepository {
    constructor(connection) {
        this.connection = connection;
    }

    find = async (expansionId) => {
        return await this.connection.TcgExpansionMetadata.get(expansionId);
    }

    save = async (tcgExpansionMetadata) => {
        return await this.connection.TcgExpansionMetadata.put(tcgExpansionMetadata);
    }
}