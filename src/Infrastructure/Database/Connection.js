import Dexie from "dexie";

const connection = new Dexie('TcgCollector');
connection.version(1).stores({
    TcgSet: `setId,setName,setCode`,
    TcgCardPrice: `TcgCardId,cardNumber`,
});

export default connection;