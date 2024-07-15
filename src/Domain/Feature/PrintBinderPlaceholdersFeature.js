export class PrintBinderPlaceholdersFeature {
    constructor() {

    }

    getId = () => {
        return 'print-binder-placeholders-feature';
    };

    needsToBeAppliedForLocation = (currentLocation) => {
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
        const bodyHtml = document.body.innerHTML;
        const regex = /window.tcgcollector[\s]*=[\s]*{[\s]*appState:(.*),[\s]*}/mi;
        if (!regex.test(bodyHtml)) {
            throw new Error('AppState could not be determined');
        }

        const appState = JSON.parse(bodyHtml.match(regex)[1]);

        const cardVariantTypes = appState.cardIdToCardVariantTypeIdsMap;
        const variantTypes = appState.idToCardVariantTypeDtoMap;

        const $cards = document.querySelectorAll('div#card-image-grid div.card-image-grid-item');

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
        document.body.appendChild($printWrapper);

        const $printButton = document.createElement('button');
        $printButton.classList.add(...['button', 'button-primary', 'print-placeholders']);
        $printButton.setAttribute('title', 'Print binder placeholders');
        $printButton.innerHTML = `<span class="fa-solid fa-print"></span>`;
        $printButton.addEventListener('click', () => {
            document.body.classList.add('printing');
            window.print();
        });

        const $appendAfter = document.querySelector('div#card-search-result-title');
        $appendAfter.parentNode.insertBefore($printButton, $appendAfter.nextSibling);

        addEventListener("afterprint", () => {
            document.body.classList.remove('printing');
        });

    }
}