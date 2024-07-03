import {Settings} from "./Domain/Settings";
import {FeatureList} from "./Domain/Feature/FeatureList";
import {Page} from "./Domain/Page";
import {NewMenuItemFeature} from "./Domain/Feature/NewMenuItemFeature";
import {HidePricesFeature} from "./Domain/Feature/HidePricesFeature";
import {CollectionHistoryFeature} from "./Domain/Feature/CollectionHistoryFeature";
import {Region} from "./Domain/Region";
import {DashboardRearrangementFeature} from "./Domain/Feature/DashboardRearrangementFeature";
import {QuickAccessLinksFeature} from "./Domain/Feature/QuickAccessLinksFeature";
import {PurchasePriceFeature} from "./Domain/Feature/PurchasePriceFeature";
import {PrintBinderPlaceholdersFeature} from "./Domain/Feature/PrintBinderPlaceholdersFeature";

const settings = await Settings.load();
const currentRegion = Region.fromCurrentUrl();
const currentLocation = window.location;

const newMenuItemFeature = new NewMenuItemFeature(settings);
const hidePricesFeature = new HidePricesFeature(settings);
const collectionHistoryFeature = new CollectionHistoryFeature(settings, currentRegion);
const dashboardRearrangementFeature = new DashboardRearrangementFeature();
const quickAccessLinksFeature = new QuickAccessLinksFeature(settings, currentRegion);
const purchasePriceFeature = new PurchasePriceFeature(settings);
const printBinderPlaceholdersFeature = new PrintBinderPlaceholdersFeature();

if (settings.enableDebugMode) {
    (new FeatureList([
        newMenuItemFeature,
        hidePricesFeature,
        collectionHistoryFeature,
        dashboardRearrangementFeature,
        quickAccessLinksFeature,
        purchasePriceFeature,
        printBinderPlaceholdersFeature
    ])).debug();
}

if (!settings.googleSpreadSheetId) {
    throw new Error('Google Spreadsheet ID not configured');
}

const $body = document.body;
const page = new Page(currentLocation);

newMenuItemFeature.apply();
hidePricesFeature.apply();

if (page.needsCollectionHistoryFeature()) {
    $body.classList.add('collection-history-feature');
    collectionHistoryFeature.apply();
}
if (page.needsDashboardRearrangementFeature()) {
    dashboardRearrangementFeature.apply();
}
if (page.needsQuickAccessLinksFeature()) {
    quickAccessLinksFeature.apply();
}
if (page.needsPurchasePriceFeature()) {
    $body.classList.add('purchase-price-feature');
    purchasePriceFeature.apply();
}
if (page.needsPrintBinderPlaceholdersFeature()) {
    $body.classList.add('print-binder-placeholders-feature');
    printBinderPlaceholdersFeature.apply();
}

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && window.location.hash === '#modal') {
        window.location.hash = ""
    }
})


