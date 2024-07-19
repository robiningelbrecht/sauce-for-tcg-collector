import {TcgExpansionRepository} from "../Domain/TcgCollector/TcgExpansionRepository";
import Dexie from "dexie";
import {KeyValueRepository} from "../Domain/KeyValueRepository";
import {TcgCardPriceRepository} from "../Domain/TcgCollector/TcgCardPriceRepository";
import {JpnCardsApi} from "../Domain/JpnCards/JpnCardsApi";
import {CurrencyApi} from "../Domain/CurrencyApi";
import {NewMenuItemFeature} from "../Feature/NewMenuItemFeature";
import {HidePricesFeature} from "../Feature/HidePricesFeature";
import {CollectionHistoryFeature} from "../Feature/CollectionHistoryFeature";
import {DashboardRearrangementFeature} from "../Feature/DashboardRearrangementFeature";
import {QuickAccessLinksFeature} from "../Feature/QuickAccessLinksFeature";
import {PurchasePriceFeature} from "../Feature/PurchasePriceFeature";
import {PrintBinderPlaceholdersFeature} from "../Feature/PrintBinderPlaceholdersFeature";
import {MarketPlaceLinksFeature} from "../Feature/MarketPlaceLinksFeature";
import {SyncJapanesePricesFeature} from "../Feature/SyncJapanesePricesFeature";
import {Settings} from "./Settings";
import {SyncJpnCardPricesMessageHandler} from "../Domain/JpnCards/SyncJpnCardPricesMessageHandler";
import {FetchJapaneseCardPricesMessageHandler} from "../Domain/TcgCollector/FetchJapaneseCardPricesMessageHandler";
import {ShowToastMessageHandler} from "../Domain/ShowToastMessageHandler";
import {DisplayJapanesePricesFeature} from "../Feature/DisplayJapanesePricesFeature";

const connection = new Dexie('TcgCollector');
connection.version(1).stores({
    TcgExpansion: `expansionCode,expansionName`,
    TcgCardPrice: `tcgCardId,cardNumber,expansionCode`,
    KeyValue: `key,value`
});

const settings = await Settings.fromSyncStorage();
const keyValueRepository = new KeyValueRepository(connection);
const tcgExpansionRepository = new TcgExpansionRepository(connection);
const tcgCardPriceRepository = new TcgCardPriceRepository(connection);

const features = [
    new NewMenuItemFeature(settings),
    new HidePricesFeature(settings),
    new CollectionHistoryFeature(settings),
    new DashboardRearrangementFeature(),
    new QuickAccessLinksFeature(settings),
    new PurchasePriceFeature(settings),
    new PrintBinderPlaceholdersFeature(),
    new MarketPlaceLinksFeature(settings),
    new SyncJapanesePricesFeature(settings),
    new DisplayJapanesePricesFeature(settings),
];

const messagesHandlers = [];
messagesHandlers[FetchJapaneseCardPricesMessageHandler.getId()] = new FetchJapaneseCardPricesMessageHandler(
    tcgCardPriceRepository,
    keyValueRepository,
    new CurrencyApi()
);
messagesHandlers[ShowToastMessageHandler.getId()] = new ShowToastMessageHandler();
messagesHandlers[SyncJpnCardPricesMessageHandler.getId()] = new SyncJpnCardPricesMessageHandler(
    new JpnCardsApi(),
    tcgExpansionRepository,
    tcgCardPriceRepository
);

const Container = {
    Settings: settings,
    Connection: connection,
    TcgExpansionRepository: tcgExpansionRepository,
    KeyValueRepository: keyValueRepository,
    TcgCardPriceRepository: tcgCardPriceRepository,
    Features: features,
    getMessageHandler: (handlerName) => {
        if (!messagesHandlers.hasOwnProperty(handlerName)) {
            throw new Error(`MessageHandler ${handlerName} not found`);
        }

        return messagesHandlers[handlerName];
    }
}

export default Container;