import Dexie from "dexie";

const connection = new Dexie('TcgCollector');
connection.version(1).stores({
    TcgExpansion: `expansionCode,expansionName`,
    TcgCardPrice: `tcgCardId,cardNumber,expansionCode`,
});

export default connection;