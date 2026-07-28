import './../scss/sauce.scss';
import {consolePrint, consolePrintLogo} from "./Infrastructure/Utils/Console";
import {Toast} from "./Component/Toast";
import Container from "./Infrastructure/Container";
import {AppState} from "./Infrastructure/AppState";

const appState = AppState.fromHtml();

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

        if (feature.needsMutationObserver()) {
            const observer = new MutationObserver((mutations) => {
                feature.apply();
            });

            observer.observe(document.querySelector('#page-content > .container'), {
                childList: true,
            });
        }
    }
}
