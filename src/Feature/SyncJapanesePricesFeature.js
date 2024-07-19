import {Toast} from "../Component/Toast";
import {SyncJpnCardPricesMessageHandler} from "../Domain/JpnCards/SyncJpnCardPricesMessageHandler";

export class SyncJapanesePricesFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getId = () => {
        return 'sync-japanese-prices-feature';
    };

    needsToBeAppliedForLocation = (currentLocation) => {
        if (this.settings.hidePrices()) {
            return false;
        }

        return currentLocation.pathname.includes('/cards/jp/');
    }

    apply = async () => {
        if (document.querySelectorAll('#card-search-result-title-expansion-code').length === 0) {
            return;
        }
        const expansionCode = document.querySelector('#card-search-result-title-expansion-code').innerText.trim().toLowerCase();

        const $syncPricesButton = document.createElement('button');
        $syncPricesButton.setAttribute('type', 'button');
        $syncPricesButton.setAttribute('title', 'Re-sync prices');
        $syncPricesButton.classList.add(...['button', 'button-plain-alt']);
        $syncPricesButton.innerHTML = `<span aria-hidden="true" class="button-icon fa-solid fa-rotate fa-fw"></span> Prices`;
        $syncPricesButton.addEventListener('click', () => {
            chrome.runtime.sendMessage({
                handler: SyncJpnCardPricesMessageHandler.getId(),
                payload: {expansionCode: expansionCode}
            });
            Toast.success('Price update started. You can navigate away from this page.').show();
        });
        document.querySelector('div#cards-page-buttons').appendChild($syncPricesButton);
    }

}