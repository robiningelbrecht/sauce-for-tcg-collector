import {NewMenuItemFeature} from "../Feature/NewMenuItemFeature";
import {HidePricesFeature} from "../Feature/HidePricesFeature";
import {DashboardFeature} from "../Feature/DashboardFeature";
import {QuickAccessLinksFeature} from "../Feature/QuickAccessLinksFeature";
import {PurchasePriceFeature} from "../Feature/PurchasePriceFeature";
import {PrintBinderPlaceholdersFeature} from "../Feature/PrintBinderPlaceholdersFeature";
import {MarketPlaceLinksFeature} from "../Feature/MarketPlaceLinksFeature";
import {Settings} from "./Settings";
import {PrintBinderExpansionLogosFeature} from "../Feature/PrintBinderExpansionLogosFeature";
import {FilterExpansionsFeature} from "../Feature/FilterExpansionsFeature";

const settings = await Settings.fromSyncStorage();

const features = [
    new NewMenuItemFeature(settings),
    new HidePricesFeature(settings),
    new DashboardFeature(settings),
    new QuickAccessLinksFeature(settings),
    new PurchasePriceFeature(settings),
    new PrintBinderPlaceholdersFeature(),
    new PrintBinderExpansionLogosFeature(),
    new MarketPlaceLinksFeature(settings),
    new FilterExpansionsFeature()
];


const Container = {
    Settings: settings,
    Features: features
}

export default Container;