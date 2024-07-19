import './../scss/sauce.scss';
import {consolePrint, consolePrintLogo} from "./Infrastructure/Utils/Console";
import {Toast} from "./Component/Toast";
import Command from "./Infrastructure/Commands";
import Container from "./Infrastructure/Container";

const currentLocation = window.location;

if (!Container.Settings.getGoogleSpreadSheetId()) {
    Toast.error(`Google Spreadsheet ID not configured`).show();
    throw new Error('Google Spreadsheet ID not configured');
}

// Update navbar logo and start adding the sauce.
document.querySelector('a.navbar-logo-link img').setAttribute('src', chrome.runtime.getURL('dist/assets/tcgc-logo.png'));

consolePrintLogo('Applying that sweet sauce 🥫');
const $body = document.body;
for (const feature of Container.Features) {
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
    if (message.cmd === Command.ShowToast) {
        (new Toast(message.payload.type, message.payload.msg)).show();
    }
});


