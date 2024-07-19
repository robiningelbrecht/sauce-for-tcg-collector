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
import {SyncJpnCardPricesCommand} from "../Domain/JpnCards/SyncJpnCardPricesCommand";
import {FetchJapaneseCardPricesCommand} from "../Domain/TcgCollector/FetchJapaneseCardPricesCommand";
import {UpdateCurrencyConversionRatesCommand} from "../Domain/JpnCards/UpdateCurrencyConversionRatesCommand";

const connection = new Dexie('TcgCollector');
connection.version(1).stores({
    TcgExpansion: `expansionCode,expansionName`,
    TcgCardPrice: `tcgCardId,cardNumber,expansionCode`,
    KeyValue: `key,value`
});

const settings = await Settings.fromSyncStorage();
const keyValueRepository = new KeyValueRepository(connection);
const tcgExpansionRepository = new TcgExpansionRepository(connection);
const tcgCardPriceRepository = new TcgCardPriceRepository(connection, keyValueRepository);

const Container = {
    Settings: settings,
    TcgExpansionRepository: tcgExpansionRepository,
    KeyValueRepository: keyValueRepository,
    TcgCardPriceRepository: tcgCardPriceRepository,
    Features: [
        new NewMenuItemFeature(settings),
        new HidePricesFeature(settings),
        new CollectionHistoryFeature(settings),
        new DashboardRearrangementFeature(),
        new QuickAccessLinksFeature(settings),
        new PurchasePriceFeature(settings),
        new PrintBinderPlaceholdersFeature(),
        new MarketPlaceLinksFeature(settings),
        new SyncAndDisplayJapanesePrices(settings),
    ],
    Commands: {
        FetchJapaneseCardPrices: new FetchJapaneseCardPricesCommand(tcgCardPriceRepository),
        ShowToast: 'ShowToast',
        SyncJapanesePrices: new SyncJpnCardPricesCommand(
            new JpnCardsApi(),
            tcgExpansionRepository,
            tcgCardPriceRepository
        ),
        UpdateCurrencyConversionRates: new UpdateCurrencyConversionRatesCommand(
            keyValueRepository,
            new CurrencyApi()
        )
    }
}

export default Container;