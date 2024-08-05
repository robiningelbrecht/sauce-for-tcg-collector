import './../scss/sauce.scss';
import {consolePrint, consolePrintLogo} from "./Infrastructure/Utils/Console";
import {Toast} from "./Component/Toast";
import Container from "./Infrastructure/Container";
import {AppState} from "./Infrastructure/AppState";

if (!Container.Settings.getGoogleSpreadSheetId()) {
    Toast.error(`Google Spreadsheet ID not configured`).show();
    throw new Error('Google Spreadsheet ID not configured');
}
const appState = AppState.fromHtml();

// Update navbar logo and start adding the sauce.
document.querySelector('a.navbar-logo-link img').setAttribute('src', chrome.runtime.getURL('dist/assets/tcgc-logo.png'));

consolePrintLogo('Applying that sweet sauce 🥫');
const $body = document.body;
for (const feature of Container.Features) {
    if (feature.needsToBeApplied(appState)) {
        $body.classList.add(feature.getId());

        feature.apply().catch(error => {
            Toast.error(`Oops, something 🐟y is going on. Check console for details.`).show();
            consolePrint(error.message);
            consolePrint(error.stack);
        });

    }
}



