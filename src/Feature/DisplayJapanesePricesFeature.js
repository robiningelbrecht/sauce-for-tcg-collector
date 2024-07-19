import {Toast} from "../Component/Toast";
import {SyncJpnCardPricesMessage} from "../Domain/JpnCards/SyncJpnCardPricesMessage";
import {FetchJapaneseCardPricesMessage} from "../Domain/TcgCollector/FetchJapaneseCardPricesMessage";

export class DisplayJapanesePricesFeature {
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

        return currentLocation.pathname.includes('/cards/jp');
    }

    apply = async () => {
        const cardIds = [...document.querySelectorAll(`div.card-image-grid-item[data-card-id]`)]
            .map(el => parseInt(el.getAttribute('data-card-id')));
        const cards = await chrome.runtime.sendMessage({
            cmd: FetchJapaneseCardPricesMessage.getId(),
            payload: {cardIds: cardIds}
        });

        cards.forEach(card => {
            const $card = document.querySelector(`div.card-image-grid-item[data-card-id="${card.tcgCardId}"]`);
            if ($card && card.priceInUsd) {
                $card.querySelector('.card-image-controls-item-price').innerHTML =
                    `<a href="${card.urlToListing}" target="_blank">$${card.priceInUsd}</a>`;
            }
        });
    }

}