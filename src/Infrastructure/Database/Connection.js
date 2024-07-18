import Dexie from "dexie";
import {TcgExpansionRepository} from "../../Domain/TcgCollector/TcgExpansionRepository";
import {TcgCardPriceRepository} from "../../Domain/TcgCollector/TcgCardPriceRepository";

const connection = new Dexie('TcgCollector');
connection.version(1).stores({
    TcgExpansion: `expansionCode,expansionName`,
    TcgCardPrice: `tcgCardId,cardNumber,expansionCode`,
});

export const tcgExpansionRepository = new TcgExpansionRepository(connection);
export const tcgCardPriceRepository = new TcgCardPriceRepository(connection);
