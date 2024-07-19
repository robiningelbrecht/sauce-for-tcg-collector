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
import {SyncAndDisplayJapanesePrices} from "../Feature/SyncAndDisplayJapanesePrices";
import {Settings} from "./Settings";
import {SyncJpnCardPricesMessage} from "../Domain/JpnCards/SyncJpnCardPricesMessage";
import {FetchJapaneseCardPricesMessage} from "../Domain/TcgCollector/FetchJapaneseCardPricesMessage";
import {ShowToastMessage} from "../Domain/ShowToastMessage";

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
    new SyncAndDisplayJapanesePrices(settings),
];

const messages = [];
messages[FetchJapaneseCardPricesMessage.getId()] = new FetchJapaneseCardPricesMessage(
    tcgCardPriceRepository,
    keyValueRepository,
    new CurrencyApi()
);
messages[ShowToastMessage.getId()] = new ShowToastMessage();
messages[SyncJpnCardPricesMessage.getId()] = new SyncJpnCardPricesMessage(
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
    getMessage: (messageName) => {
        if (!messages.hasOwnProperty(messageName)) {
            throw new Error(`Message ${messageName} not found`);
        }

        return messages[messageName];
    }
}

export default Container;