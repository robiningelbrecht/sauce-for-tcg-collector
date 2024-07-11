import {SETTING_MARKET_PLACE_LINKS} from "./Settings";

export class MarketPlaceLinkFactory {
    constructor(settings) {
        this.settings = settings;

        if (this.settings[SETTING_MARKET_PLACE_LINKS] === 'cardMarket') {
            this.iconUrl = chrome.runtime.getURL('dist/assets/card-market.jpg');
        } else {
            this.iconUrl = chrome.runtime.getURL('dist/assets/ebay.png');
        }
    }

    buildFor = ($card, expansionCode) => {
        const $marketPlaceLink = document.createElement('a');

        const cardName = $card.querySelector('a').getAttribute('title').split('(')[0].trim();
        if (this.settings[SETTING_MARKET_PLACE_LINKS] === 'cardMarket') {
            const cardNumber = parseInt($card.querySelector('span.card-image-grid-item-info-overlay-text-part').innerText.split('/')[0].replace(/\D/g, "").trim());

            const query = {};
            if (this.settings.minCondition) {
                query.minCondition = this.settings.minCondition;
            }
            if (this.settings.cardMarketCardLanguages) {
                query.language = this.settings.cardMarketCardLanguages;
            }
            if (this.settings.cardMarketSellerLocations) {
                query.sellerCountry = this.settings.cardMarketSellerLocations;
            }

            // return `${su.api_url}/sch/i.html?_from=R40&_nkw=${name}+${number}&_sacat=0&rt=nc&LH_${listing_types[lt.listing_type]}=1&_sop=${sort_orders[so.sort_order]}`

            $marketPlaceLink.classList.add('market-place-link');
            $marketPlaceLink.setAttribute('href', `https://www.cardmarket.com/en/Pokemon/Products/Search?searchString=${cardName}+${cardNumber}+${expansionCode}&${(new URLSearchParams(query)).toString()}`);
            $marketPlaceLink.setAttribute('title', 'Find this card on cardmarket.com');
            $marketPlaceLink.setAttribute('target', '_blank');

            $marketPlaceLink.innerHTML = `<img src="${this.iconUrl}" alt="Card market" />`;

            return $marketPlaceLink;
        }

        const cardNumber = $card.querySelector('span.card-image-grid-item-info-overlay-text-part').innerText.trim();
        const query = {
            '_from': 'R40'
        };
        if (this.settings.ebayListingType) {
            query['LH_' + this.settings.ebayListingType] = 1;
        }
        if (this.settings.ebaySortBy) {
            query._sop = this.settings.ebaySortBy;
        }

        $marketPlaceLink.classList.add('market-place-link');
        $marketPlaceLink.setAttribute('href', `${this.settings.ebayUrl.replace(/\/$/, "")}/sch/i.html?_nkw=${cardName}+${cardNumber}&${(new URLSearchParams(query)).toString()}`);
        $marketPlaceLink.setAttribute('title', `Find this card on ${this.settings.ebayUrl}`);
        $marketPlaceLink.setAttribute('target', '_blank');

        $marketPlaceLink.innerHTML = `<img src="${this.iconUrl}" alt="Ebay" />`;

        return $marketPlaceLink;
    }
}