import {contains} from "../Utils";

export class MarketPlaceLinksFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getId = () => {
        return 'market-place-links-feature';
    };

    needsToBeAppliedForLocation = (currentLocation) => {
        if (!this.settings.marketPlaceLinks) {
            return false;
        }

        if (this.settings.marketPlaceLinks === 'none') {
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
        const cardMarketIconUrl = chrome.runtime.getURL('dist/assets/card-market.jpg');
        const expansionCode = document.querySelector('span#card-search-result-title-expansion-code')?.innerText || '';

        $cards.forEach($card => {
            const cardName = $card.querySelector('a').getAttribute('title').split('(')[0].trim();
            const cardNumber = parseInt($card.querySelector('span.card-image-grid-item-info-overlay-text-part').innerText.split('/')[0].replace(/\D/g, "").trim());

            const $marketPlaceLink = document.createElement('a');

            const query = {};
            if(this.settings.minCondition){
                query.minCondition = this.settings.minCondition;
            }
            if(this.settings.cardMarketCardLanguages){
               query.language = this.settings.cardMarketCardLanguages;
            }
            if(this.settings.cardMarketSellerLocations){
                query.sellerCountry = this.settings.cardMarketSellerLocations;
            }

            $marketPlaceLink.classList.add('market-place-link');
            $marketPlaceLink.setAttribute('href', `https://www.cardmarket.com/en/Pokemon/Products/Search?searchString=${cardName}+${cardNumber}+${expansionCode}&${(new URLSearchParams(query)).toString()}`);
            $marketPlaceLink.setAttribute('title', 'Navigate to cardmarket.com');
            $marketPlaceLink.setAttribute('target', '_blank');
            $marketPlaceLink.innerHTML = `<img src="${cardMarketIconUrl}" alt="Card market" />`;

            $card.querySelector('div.card-image-controls-item').appendChild($marketPlaceLink);
        });
    }
}