export class MarketPlaceLinkFactory {
    constructor(settings) {
        this.settings = settings;

        this.cardMarketiconUrl = chrome.runtime.getURL('dist/assets/card-market.jpg');
        this.ebayIconUrl = chrome.runtime.getURL('dist/assets/ebay.png');
    }

    buildFor = ($card, expansionCode) => {
        const marketPlaceLinks = [];
        const cardName = $card.querySelector('a').getAttribute('title').split('(')[0].trim();

        if (this.settings.getMarketPlaceLinks().includes('cardMarket')) {
            const $marketPlaceLink = document.createElement('a');
            const cardNumber = parseInt($card.querySelector('span.card-image-grid-item-info-overlay-text-part').innerText.split('/')[0].replace(/\D/g, "").trim());

            $marketPlaceLink.classList.add('market-place-link');
            $marketPlaceLink.setAttribute('href', `https://www.cardmarket.com/en/Pokemon/Products/Search?searchString=${encodeURIComponent(cardName)}+${encodeURIComponent(cardNumber)}+${expansionCode}`);
            $marketPlaceLink.setAttribute('title', 'Find this card on cardmarket.com');
            $marketPlaceLink.setAttribute('target', '_blank');

            $marketPlaceLink.innerHTML = `<img src="${this.cardMarketiconUrl}" alt="Card market" />`;
            marketPlaceLinks.push($marketPlaceLink);
        }

        if (this.settings.getMarketPlaceLinks().includes('ebay')) {
            const $marketPlaceLink = document.createElement('a');
            const cardNumber = $card.querySelector('span.card-image-grid-item-info-overlay-text-part').innerText.trim();
            const query = {
                '_from': 'R40'
            };
            if (this.settings.getEbayListingType()) {
                query['LH_' + this.settings.getEbayListingType()] = 1;
            }
            if (this.settings.getEbaySortBy()) {
                query._sop = this.settings.getEbaySortBy();
            }
            if (this.settings.getEbayLocation()) {
                query.LH_PrefLoc = this.settings.getEbayLocation();
            }

            $marketPlaceLink.classList.add('market-place-link');
            $marketPlaceLink.setAttribute('href', `${this.settings.getEbayUrl().replace(/\/$/, "")}/sch/i.html?_nkw=${encodeURIComponent(cardName)}+${encodeURIComponent(cardNumber)}&${(new URLSearchParams(query)).toString()}`);
            $marketPlaceLink.setAttribute('title', `Find this card on ${this.settings.getEbayUrl()}`);
            $marketPlaceLink.setAttribute('target', '_blank');

            $marketPlaceLink.innerHTML = `<img src="${this.ebayIconUrl}" alt="Ebay" />`;
            marketPlaceLinks.push($marketPlaceLink);
        }

        return marketPlaceLinks;
    }
}