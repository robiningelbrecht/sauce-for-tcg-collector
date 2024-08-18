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
import {SyncExpansionJpnCardPricesMessageHandler} from "../Domain/JpnCards/SyncExpansionJpnCardPricesMessageHandler";
import {FetchJapaneseCardPricesMessageHandler} from "../Domain/TcgCollector/FetchJapaneseCardPricesMessageHandler";
import {DisplayJapanesePricesFeature} from "../Feature/DisplayJapanesePricesFeature";
import {PrintBinderExpansionLogosFeature} from "../Feature/PrintBinderExpansionLogosFeature";
import {TcgExpansionMetadataRepository} from "../Domain/TcgCollector/TcgExpansionMetadataRepository";
import {FilterExpansionsFeature} from "../Feature/FilterExpansionsFeature";

const connection = new Dexie('TcgCollector');
connection.version(1).stores({
    TcgCardPrice: `cardId,cardNumber,expansionId`,
    TcgExpansionMetadata: `expansionId,lastPriceSync`,
    KeyValue: `key,value`
});

const settings = await Settings.fromSyncStorage();
const keyValueRepository = new KeyValueRepository(connection);
const tcgCardPriceRepository = new TcgCardPriceRepository(connection);
const tcgExpansionMetadataRepository = new TcgExpansionMetadataRepository(connection);

const features = [
    new NewMenuItemFeature(settings),
    new HidePricesFeature(settings),
    new CollectionHistoryFeature(settings),
    new DashboardRearrangementFeature(),
    new QuickAccessLinksFeature(settings),
    new PurchasePriceFeature(settings),
    new PrintBinderPlaceholdersFeature(),
    new PrintBinderExpansionLogosFeature(),
    new MarketPlaceLinksFeature(settings),
    new SyncJapanesePricesFeature(settings),
    new DisplayJapanesePricesFeature(settings),
    new FilterExpansionsFeature()
];

const messagesHandlers = [];
messagesHandlers[FetchJapaneseCardPricesMessageHandler.getId()] = new FetchJapaneseCardPricesMessageHandler(
    tcgCardPriceRepository,
    keyValueRepository,
    new CurrencyApi()
);
messagesHandlers[SyncExpansionJpnCardPricesMessageHandler.getId()] = new SyncExpansionJpnCardPricesMessageHandler(
    new JpnCardsApi(),
    tcgCardPriceRepository,
    tcgExpansionMetadataRepository
);

const Container = {
    Settings: settings,
    Connection: connection,
    KeyValueRepository: keyValueRepository,
    TcgCardPriceRepository: tcgCardPriceRepository,
    TcgExpansionMetadataRepository: tcgExpansionMetadataRepository,
    Features: features,
    getMessageHandler: (handlerName) => {
        if (!messagesHandlers.hasOwnProperty(handlerName)) {
            throw new Error(`MessageHandler ${handlerName} not found`);
        }

        return messagesHandlers[handlerName];
    }
}

export default Container;