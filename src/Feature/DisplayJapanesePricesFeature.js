import {FetchJapaneseCardPricesMessageHandler} from "../Domain/TcgCollector/FetchJapaneseCardPricesMessageHandler";
import Container from "../Infrastructure/Container";
import {Toast} from "../Component/Toast";
import {AppState} from "../Infrastructure/AppState";

export class DisplayJapanesePricesFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getId = () => {
        return 'display-japanese-prices-feature';
    };

    needsToBeApplied = (appState) => {
        if (this.settings.hidePrices()) {
            return false;
        }

        if (appState.getRouteName() === 'cards_page') {
            return true;
        }
        return appState.getRouteName() === 'sets_set_cards_page' && appState.getTcgRegionId() === 2;
    }

    apply = async () => {
        const appState = AppState.fromHtml();
        const cardIds = appState.getCardIds();

        Container.getMessageHandler(FetchJapaneseCardPricesMessageHandler.getId()).handle({cardIds: cardIds}).then((cards) => {
            cards.forEach(card => {
                const $card = document.querySelector(`div.card-image-grid-item[data-card-id="${card.cardId}"]`);
                if ($card && card.priceInUsd) {
                    $card.querySelector('.card-image-controls-item-price').innerHTML =
                        `<a href="${card.urlToListing}" target="_blank">$${card.priceInUsd}</a>`;
                }
            });
        }).catch(e => {
            Toast.error(e.message);
        });
    }

}