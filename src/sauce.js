import './../scss/sauce.scss';
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
import {MarketPlaceLinksFeature} from "./Domain/Feature/marketPlaceLinksFeature";

const settings = await Settings.fromSyncStorage();
const currentRegion = Region.fromCurrentUrl();
const currentLocation = window.location;

if (!settings.getGoogleSpreadSheetId()) {
    throw new Error('Google Spreadsheet ID not configured');
}

// Update navbar logo and start adding the sauce.
document.querySelector('a.navbar-logo-link img').setAttribute('src', chrome.runtime.getURL('dist/assets/tcgc-logo.png'));

const newMenuItemFeature = new NewMenuItemFeature(settings);
const hidePricesFeature = new HidePricesFeature(settings);
const collectionHistoryFeature = new CollectionHistoryFeature(settings, currentRegion);
const dashboardRearrangementFeature = new DashboardRearrangementFeature();
const quickAccessLinksFeature = new QuickAccessLinksFeature(settings, currentRegion);
const purchasePriceFeature = new PurchasePriceFeature(settings);
const printBinderPlaceholdersFeature = new PrintBinderPlaceholdersFeature();
const includeMarketPlaceLinksFeature = new MarketPlaceLinksFeature(settings);

const featureList = [
    newMenuItemFeature,
    hidePricesFeature,
    collectionHistoryFeature,
    dashboardRearrangementFeature,
    quickAccessLinksFeature,
    purchasePriceFeature,
    printBinderPlaceholdersFeature,
    includeMarketPlaceLinksFeature
];

consolePrintLogo('Applying that sweet sauce 🥫');
const $body = document.body;
for (const feature of featureList) {
    if (feature.needsToBeAppliedForLocation(currentLocation)) {
        $body.classList.add(feature.getId());
        feature.apply();
    }
}

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && window.location.hash === '#modal') {
        window.location.hash = ""
    }
})


