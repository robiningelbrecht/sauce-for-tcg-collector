import {Toast} from "../Component/Toast";

export class SyncAndDisplayJapanesePrices {
    constructor(settings) {
        this.settings = settings;
    }

    getId = () => {
        return 'display-japanese-prices-feature';
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
                cmd: 'SyncJapanesePrices',
                payload: {expansionCode: expansionCode}
            });
            Toast.success('Price update started. You can navigate away from this page.').show();
        });
        document.querySelector('div#cards-page-buttons').appendChild($syncPricesButton);

        const cards = await chrome.runtime.sendMessage({
            cmd: 'FetchJapaneseCardPrices',
            payload: {expansionCode: expansionCode}
        });

        cards.forEach(card => {
            const $card = document.querySelector(`div.card-image-grid-item[data-card-id="${card.tcgCardId}"]`);
            if (card.prices.length > 0) {
                $card.querySelector('.card-image-controls-item-price').innerHTML = `¥${card.prices[0].priceAmount}`;
            }
        });
    }

}