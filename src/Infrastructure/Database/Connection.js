import Dexie from "dexie";
import {TcgExpansionRepository} from "../../Domain/TcgCollector/TcgExpansionRepository";

const connection = new Dexie('TcgCollector');
connection.version(1).stores({
    TcgExpansion: `expansionCode,expansionName`,
    TcgCardPrice: `tcgCardId,cardNumber,expansionCode`,
});

const tcgExpansionRepository = new TcgExpansionRepository(connection);
export default tcgExpansionRepository;