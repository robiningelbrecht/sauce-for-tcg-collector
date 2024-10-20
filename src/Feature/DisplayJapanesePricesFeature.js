import {AppState} from "../Infrastructure/AppState";

export class DisplayJapanesePricesFeature {
    constructor(settings, JapaneseCardPriceRepository) {
        this.settings = settings;
        this.japaneseCardPriceRepository = JapaneseCardPriceRepository;
    }

    getId = () => {
        return 'display-japanese-prices-feature';
    };

    needsMutationObserver = () => {
        return true;
    };

    needsToBeApplied = (appState) => {
        if (this.settings.hidePrices()) {
            return false;
        }
        if (!this.settings.getJapaneseCardPricesUrl()) {
            return false;
        }

        return appState.getRouteName() === 'sets_set_cards_page' && appState.isJapaneseTcgRegionContext();
    }

    apply = async () => {
        const appState = AppState.fromHtml();
        const cardIds = appState.getCardIds();

        const cards = await this.japaneseCardPriceRepository.findByCardIds(cardIds);
        cards.forEach(card => {
            const $card = document.querySelector(`div.card-image-grid-item[data-card-id="${card.cardId}"]`);
            if ($card && card.cardPrice) {
                const usd = (card.cardPrice.amount / 100).toFixed(2);
                $card.querySelector('.card-image-controls-item-price').innerHTML =
                    `$${usd}`;
            }
        });
    }
}