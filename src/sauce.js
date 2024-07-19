import './../scss/sauce.scss';
import {Settings} from "./Infrastructure/Settings";
import {NewMenuItemFeature} from "./Feature/NewMenuItemFeature";
import {HidePricesFeature} from "./Feature/HidePricesFeature";
import {CollectionHistoryFeature} from "./Feature/CollectionHistoryFeature";
import {DashboardRearrangementFeature} from "./Feature/DashboardRearrangementFeature";
import {QuickAccessLinksFeature} from "./Feature/QuickAccessLinksFeature";
import {PurchasePriceFeature} from "./Feature/PurchasePriceFeature";
import {PrintBinderPlaceholdersFeature} from "./Feature/PrintBinderPlaceholdersFeature";
import {MarketPlaceLinksFeature} from "./Feature/MarketPlaceLinksFeature";
import {consolePrint, consolePrintLogo} from "./Infrastructure/Utils/Console";
import {TcgRegion} from "./Domain/TcgCollector/TcgRegion";
import {Toast} from "./Component/Toast";
import {SyncAndDisplayJapanesePrices} from "./Feature/SyncAndDisplayJapanesePrices";

const settings = await Settings.fromSyncStorage();
const currentRegion = TcgRegion.fromCurrentUrl();
const currentLocation = window.location;

if (!settings.getGoogleSpreadSheetId()) {
    Toast.error(`Google Spreadsheet ID not configured`).show();
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
const syncAndDisplayJapanesePrices = new SyncAndDisplayJapanesePrices(settings);

const featureList = [
    newMenuItemFeature,
    hidePricesFeature,
    collectionHistoryFeature,
    dashboardRearrangementFeature,
    quickAccessLinksFeature,
    purchasePriceFeature,
    printBinderPlaceholdersFeature,
    includeMarketPlaceLinksFeature,
    syncAndDisplayJapanesePrices
];

consolePrintLogo('Applying that sweet sauce 🥫');
const $body = document.body;
for (const feature of featureList) {
    if (feature.needsToBeAppliedForLocation(currentLocation)) {
        $body.classList.add(feature.getId());

        feature.apply().catch(error => {
            Toast.error(`Oops, something 🐟y is going on. Check console for details.`).show();
            consolePrint(error.message);
            consolePrint(error.stack);
        });

    }
}

chrome.runtime.onMessage.addListener(function (message) {
    if (message.cmd === 'showToast') {
        (new Toast(message.payload.type, message.payload.msg)).show();
    }
});


