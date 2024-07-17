import Dexie from "dexie";

export class DbConnection{
    constructor(schema) {
        this.db = schema;
    }

    static fromDexieSchema = ()=> {
        const schema =  new Dexie('TcgCollector');
        schema.version(1).stores({
            friends: `id,name,age`,
        });

        return new DbConnection(schema);
    }

    listFriends = async () => {
        return await this.db.friends.toArray();
    };
}