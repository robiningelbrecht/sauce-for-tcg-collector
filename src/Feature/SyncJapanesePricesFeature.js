import {Toast} from "../Component/Toast";
import {SyncExpansionJpnCardPricesMessageHandler} from "../Domain/JpnCards/SyncExpansionJpnCardPricesMessageHandler";
import Container from "../Infrastructure/Container";
import {DateTime} from "luxon";

export class SyncJapanesePricesFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getId = () => {
        return 'sync-japanese-prices-feature';
    };

    needsToBeApplied = (appState) => {
        if (this.settings.hidePrices()) {
            return false;
        }

        return appState.getRouteName() === 'sets_set_cards_page' && appState.getTcgRegionId() === 2;
    }

    apply = async () => {
        if (document.querySelectorAll('#card-search-result-title-set-like-name').length === 0) {
            return;
        }

        const today = DateTime.now();
        const expansionId = document.querySelector('#card-search-result-title-set-like-name')?.innerText.trim().toLowerCase() || null;

        const tcgExpansionMetadata = await Container.TcgExpansionMetadataRepository.find(expansionId);
        const lastRefreshDate = DateTime.fromISO(tcgExpansionMetadata?.lastPriceSync || today.toISO());

        const $syncPricesButton = document.createElement('button');
        $syncPricesButton.setAttribute('type', 'button');
        $syncPricesButton.setAttribute('title', 'Sync prices');
        $syncPricesButton.classList.add(...['button', 'button-plain-alt', 'sync-prices']);
        $syncPricesButton.innerHTML = `<span aria-hidden="true" class="button-icon fa-solid fa-rotate fa-fw"></span>Prices`;

        if (lastRefreshDate.weekNumber !== today.weekNumber) {
            $syncPricesButton.classList.add(...['warning']);
            $syncPricesButton.innerHTML = `<span aria-hidden="true" class="button-icon fa-solid fa-rotate fa-fw"></span>Prices <span class="last-refresh-date">(${lastRefreshDate.toFormat('dd LLL yyyy')})</span>`;
        }
        $syncPricesButton.addEventListener('click', () => {
            Container.getMessageHandler(SyncExpansionJpnCardPricesMessageHandler.getId()).handle({expansionId: expansionId}).then(() => {
                Toast.success(`Prices for expansion "${expansionId}" have been synced.`).show();
            }).catch(e => {
                Toast.error(e.message);
            });

            Toast.success('Price update started. Please do NOT navigate away from this page.').show();
        });
        document.querySelector('div#cards-page-buttons').appendChild($syncPricesButton);
    }

}