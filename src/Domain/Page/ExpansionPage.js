export class ExpansionPage{
    constructor($element, appState) {
        this.$element = $element;
        this.appState = appState;
    }

    buildPrintPlaceholders = () => {
        const cardVariantTypes = this.appState.cardIdToCardVariantTypeIdsMap;
        const variantTypes = this.appState.idToCardVariantTypeDtoMap;

        const $cards = this.$element.querySelectorAll('div#card-image-grid div.card-image-grid-item');

        const $printWrapper = document.createElement('div');
        $printWrapper.setAttribute('id', 'print');

        $cards.forEach($card => {
            const cardId = $card.getAttribute('data-card-id');
            const cardName = $card.querySelector('a').getAttribute('title').split('(')[0].trim();
            const cardNumber = $card.querySelector('span.card-image-grid-item-info-overlay-text-part').innerText.trim();

            cardVariantTypes[cardId].forEach(cardVariantId => {
                const variantName = variantTypes[cardVariantId].name;

                const $placeholder = document.createElement('div');
                $placeholder.classList.add('placeholder');
                $placeholder.innerHTML = `<div>${cardName}</div><div>${cardNumber}</div><div>${variantName}</div>`;

                $printWrapper.appendChild($placeholder);
            });
        });

        return $printWrapper;
    }
}