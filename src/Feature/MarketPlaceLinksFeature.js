import {MarketPlaceLinkFactory} from "../Infrastructure/Utils/MarketPlaceLinkFactory";
import Container from "../Infrastructure/Container";
import {Toast} from "../Component/Toast";
import {consolePrint} from "../Infrastructure/Utils/Console";

export class MarketPlaceLinksFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getId = () => {
        return 'market-place-links-feature';
    };

    needsToBeApplied = (appState) => {
        if (this.settings.getMarketPlaceLinks().length === 0) {
            return false;
        }

        if (appState.getRouteName() === 'cards_page') {
            return true;
        }
        return appState.getRouteName() === 'sets_set_cards_page';
    }

    apply = async () => {
        const attachMarketPlaceLinks = () => {
            const $cards = document.querySelectorAll('div#card-image-grid div.card-image-grid-item');
            const expansionCode = document.querySelector('span#card-search-result-title-expansion-code')?.innerText || '';
            const marketPlaceLinkFactory = new MarketPlaceLinkFactory(this.settings);

            $cards.forEach($card => {
                marketPlaceLinkFactory.buildFor($card, expansionCode).forEach($link => {
                    $card.querySelector('div.card-image-controls-item').appendChild($link);
                });
            });
        }

        attachMarketPlaceLinks();

        const observer = new MutationObserver((mutations) => {
            attachMarketPlaceLinks();
        });

        observer.observe(document.querySelector('#page-content > .container'), {
            childList: true,
        });
    }
}