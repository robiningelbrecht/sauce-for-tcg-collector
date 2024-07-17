import {MarketPlaceLinkFactory} from "../Domain/MarketPlaceLinkFactory";

export class MarketPlaceLinksFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getId = () => {
        return 'market-place-links-feature';
    };

    needsToBeAppliedForLocation = (currentLocation) => {
        if (!this.settings.getMarketPlaceLinks()) {
            return false;
        }

        if (this.settings.getMarketPlaceLinks() === 'none') {
            return false;
        }

        if (currentLocation.pathname === '/cards') {
            return true;
        }
        if (currentLocation.pathname === '/cards/intl') {
            return true;
        }
        if (currentLocation.pathname === '/cards/jp') {
            return true;
        }
        return currentLocation.pathname.includes('/cards/jp/') || currentLocation.pathname.includes('/cards/intl/');
    }

    apply = () => {
        const $cards = document.querySelectorAll('div#card-image-grid div.card-image-grid-item');
        const expansionCode = document.querySelector('span#card-search-result-title-expansion-code')?.innerText || '';
        const marketPlaceLinkFactory = new MarketPlaceLinkFactory(this.settings);

        $cards.forEach($card => {
            $card.querySelector('div.card-image-controls-item').appendChild(marketPlaceLinkFactory.buildFor($card, expansionCode));
        });
    }
}