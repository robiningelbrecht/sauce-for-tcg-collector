import {TcgCardPriceRepository} from "../Domain/TcgCollector/TcgCardPriceRepository";
import {NewMenuItemFeature} from "../Feature/NewMenuItemFeature";
import {HidePricesFeature} from "../Feature/HidePricesFeature";
import {DashboardRearrangementFeature} from "../Feature/DashboardRearrangementFeature";
import {QuickAccessLinksFeature} from "../Feature/QuickAccessLinksFeature";
import {PurchasePriceFeature} from "../Feature/PurchasePriceFeature";
import {PrintBinderPlaceholdersFeature} from "../Feature/PrintBinderPlaceholdersFeature";
import {MarketPlaceLinksFeature} from "../Feature/MarketPlaceLinksFeature";
import {Settings} from "./Settings";
import {DisplayJapanesePricesFeature} from "../Feature/DisplayJapanesePricesFeature";
import {PrintBinderExpansionLogosFeature} from "../Feature/PrintBinderExpansionLogosFeature";
import {FilterExpansionsFeature} from "../Feature/FilterExpansionsFeature";

const settings = await Settings.fromSyncStorage();
const tcgCardPriceRepository = new TcgCardPriceRepository(settings);

const features = [
    new NewMenuItemFeature(settings),
    new HidePricesFeature(settings),
    new DashboardRearrangementFeature(),
    new QuickAccessLinksFeature(settings),
    new PurchasePriceFeature(settings),
    new PrintBinderPlaceholdersFeature(),
    new PrintBinderExpansionLogosFeature(),
    new MarketPlaceLinksFeature(settings),
    new DisplayJapanesePricesFeature(tcgCardPriceRepository, settings),
    new FilterExpansionsFeature()
];


const Container = {
    Settings: settings,
    TcgCardPriceRepository: tcgCardPriceRepository,
    Features: features
}

export default Container;