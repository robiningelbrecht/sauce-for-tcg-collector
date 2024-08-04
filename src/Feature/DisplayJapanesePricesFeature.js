import {FetchJapaneseCardPricesMessageHandler} from "../Domain/TcgCollector/FetchJapaneseCardPricesMessageHandler";
import {loadAppState} from "../Infrastructure/Utils/Functions";

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

        const appState = loadAppState();
        if (appState.routeName === 'cards_page') {
            return true;
        }
        return appState.routeName === 'sets_set_cards_page' && appState.tcgRegionId === 2;
    }

    apply = async () => {
        const cardIds = [...document.querySelectorAll(`div.card-image-grid-item[data-card-id]`)]
            .map(el => parseInt(el.getAttribute('data-card-id')));

        const cards = await chrome.runtime.sendMessage({
            handler: FetchJapaneseCardPricesMessageHandler.getId(),
            payload: {cardIds: cardIds}
        });

        cards.forEach(card => {
            const $card = document.querySelector(`div.card-image-grid-item[data-card-id="${card.cardId}"]`);
            if ($card && card.priceInUsd) {
                $card.querySelector('.card-image-controls-item-price').innerHTML =
                    `<a href="${card.urlToListing}" target="_blank">$${card.priceInUsd}</a>`;
            }
        });
    }

}