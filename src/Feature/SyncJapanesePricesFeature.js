import {Toast} from "../Component/Toast";
import {SyncExpansionJpnCardPricesMessageHandler} from "../Domain/JpnCards/SyncExpansionJpnCardPricesMessageHandler";

export class SyncJapanesePricesFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getId = () => {
        return 'sync-japanese-prices-feature';
    };

    needsToBeAppliedForLocation = (appState) => {
        if (this.settings.hidePrices()) {
            return false;
        }

        return appState.routeName === 'sets_set_cards_page' && appState.tcgRegionId === 2;
    }

    apply = async () => {
        if (document.querySelectorAll('#card-search-result-title-set-like-name').length === 0) {
            return;
        }
        const expansionId = document.querySelector('#card-search-result-title-set-like-name')?.innerText.trim().toLowerCase() || null;

        const $syncPricesButton = document.createElement('button');
        $syncPricesButton.setAttribute('type', 'button');
        $syncPricesButton.setAttribute('title', 'Re-sync prices');
        $syncPricesButton.classList.add(...['button', 'button-plain-alt']);
        $syncPricesButton.innerHTML = `<span aria-hidden="true" class="button-icon fa-solid fa-rotate fa-fw"></span> Prices`;
        $syncPricesButton.addEventListener('click', () => {
            chrome.runtime.sendMessage({
                handler: SyncExpansionJpnCardPricesMessageHandler.getId(),
                payload: {expansionId: expansionId}
            });
            Toast.success('Price update started. You can navigate away from this page.').show();
        });
        document.querySelector('div#cards-page-buttons').appendChild($syncPricesButton);
    }

}