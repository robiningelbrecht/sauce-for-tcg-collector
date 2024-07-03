import {Settings} from "./Domain/Settings";
import {NewMenuItemFeature} from "./Domain/Feature/NewMenuItemFeature";
import {HidePricesFeature} from "./Domain/Feature/HidePricesFeature";
import {CollectionHistoryFeature} from "./Domain/Feature/CollectionHistoryFeature";
import {Region} from "./Domain/Region";
import {DashboardRearrangementFeature} from "./Domain/Feature/DashboardRearrangementFeature";
import {QuickAccessLinksFeature} from "./Domain/Feature/QuickAccessLinksFeature";
import {PurchasePriceFeature} from "./Domain/Feature/PurchasePriceFeature";
import {PrintBinderPlaceholdersFeature} from "./Domain/Feature/PrintBinderPlaceholdersFeature";
import {consolePrintLogo} from "./Domain/Utils";

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

const featureList = [
    newMenuItemFeature,
    hidePricesFeature,
    collectionHistoryFeature,
    dashboardRearrangementFeature,
    quickAccessLinksFeature,
    purchasePriceFeature,
    printBinderPlaceholdersFeature
];

if (!settings.googleSpreadSheetId) {
    throw new Error('Google Spreadsheet ID not configured');
}

const $body = document.body;
for (const feature of featureList) {
    $body.classList.add(feature.getId());

    if (feature.needsToBeAppliedForLocation(currentLocation)) {
        consolePrintLogo('Applying that sweet sauce 🥫');
        feature.apply();
    }
}

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && window.location.hash === '#modal') {
        window.location.hash = ""
    }
})


