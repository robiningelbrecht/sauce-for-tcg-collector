import {toValidCssClassName} from "../Infrastructure/Utils/Functions";
import {AppState} from "../Infrastructure/AppState";

export class PrintBinderPlaceholdersFeature {
    constructor() {

    }

    getId = () => {
        return 'print-binder-placeholders-feature';
    };

    needsMutationObserver = () => {
        return false;
    };

    needsToBeApplied = (appState) => {
        return appState.getRouteName() === 'sets_set_cards_page'
    }

    apply = async () => {
        const appState = AppState.fromHtml();

        const cardVariantTypes = appState.getCardIdToCardVariantTypeIdsMap();
        const variantTypes = appState.getIdToCardVariantTypeDtoMap();

        const $printWrapper = document.createElement('div');
        $printWrapper.setAttribute('id', 'print');

        appState.getCardIds().forEach(cardId => {
            const $card = document.querySelector(`div.card-image-grid-item[data-card-id="${cardId}"]`);
            const cardName = $card.querySelector('a').getAttribute('title').split('(')[0].trim();
            const cardNumber = $card.querySelector('span.card-image-grid-item-info-overlay-text-part').innerText.trim();

            cardVariantTypes[cardId].forEach(cardVariantId => {
                const variantName = variantTypes[cardVariantId].name;

                const $placeholder = document.createElement('div');
                $placeholder.classList.add(...['placeholder', toValidCssClassName(cardName), toValidCssClassName(variantName)]);
                $placeholder.setAttribute('data-card-id', cardId);
                $placeholder.innerHTML = `<div>${cardName}</div><div>${cardNumber}</div><div>${variantName}</div>`;

                $printWrapper.appendChild($placeholder);
            });

            // Add a checkbox to select the expansion in print-selection-mode.
            const $checkbox = document.createElement('input');
            $checkbox.setAttribute('type', 'checkbox');
            $checkbox.setAttribute('data-card-id', cardId);
            $checkbox.addEventListener('click', () => {
                document.querySelector('button span.count').innerHTML = document.querySelectorAll('input[type="checkbox"][data-card-id]:checked').length;
            })

            const $checkboxLabel = document.createElement('label');
            $checkboxLabel.appendChild($checkbox);
            $card.appendChild($checkboxLabel);
        });

        const $body = document.body;
        $body.appendChild($printWrapper);

        const $printNavigation = document.createElement('div');
        $printNavigation.classList.add(...['print-navigation']);
        const $inner = document.createElement('div');
        $inner.classList.add(...['inner']);
        $printNavigation.appendChild($inner);
        $body.appendChild($printNavigation);

        const $cancelPrintSelectionModeButton = document.createElement('button');
        $cancelPrintSelectionModeButton.classList.add(...['cancel']);
        $cancelPrintSelectionModeButton.innerHTML = `<span class="fa-solid fa-ban"></span><div>Exit print mode</div>`;
        $cancelPrintSelectionModeButton.addEventListener('click', () => {
            $body.classList.remove('in-print-selection-mode');
        });

        const $printButton = document.createElement('button');
        $printButton.classList.add(...['print']);
        $printButton.innerHTML = `<span class="fa-solid fa-print"></span><div>Print <span class="count">0</span> binder placeholder(s)</div>`;
        $printButton.addEventListener('click', () => {
            // Hide all unchecked cards.
            document.querySelectorAll(`div.placeholder[data-card-id]`).forEach($placeholder => {
                $placeholder.style.display = null;
            });
            document.querySelectorAll('input[type="checkbox"][data-card-id]:not(:checked)').forEach($checkbox => {
                const cardId = $checkbox.getAttribute('data-card-id');
                document.querySelectorAll(`div.placeholder[data-card-id="${cardId}"]`).forEach($placeholder => {
                    $placeholder.style.display = 'none';
                });

            });
            $body.classList.add('printing');
            window.print();
        })

        $inner.appendChild($printButton);
        $inner.appendChild($cancelPrintSelectionModeButton);

        const $togglePrintSelectionModeButton$ = document.createElement('button');
        $togglePrintSelectionModeButton$.classList.add(...['button', 'button-plain-alt', 'toggle-print-selection']);
        $togglePrintSelectionModeButton$.setAttribute('title', 'Print binder placeholders');
        $togglePrintSelectionModeButton$.innerHTML = `<span class="fa-solid fa-print"></span><div>Print binder placeholders</div>`;
        $togglePrintSelectionModeButton$.addEventListener('click', () => {
            $body.classList.add('in-print-selection-mode');
        });

        document.querySelector('#card-search-result-header-actions-dropdown').appendChild($togglePrintSelectionModeButton$);

        addEventListener("afterprint", () => {
            $body.classList.remove('printing');
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                $body.classList.remove('in-print-selection-mode');
            }
        });
    }
}