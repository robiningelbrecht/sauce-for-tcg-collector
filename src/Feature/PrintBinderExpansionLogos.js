import {loadAppState, toValidCssClassName} from "../Infrastructure/Utils/Functions";

export class PrintBinderExpansionLogos {
    constructor() {

    }

    getId = () => {
        return 'print-binder-expansion-logos';
    };

    needsToBeAppliedForLocation = () => {
        const appState = loadAppState();
        return appState.routeName === 'sets_page';
    }

    apply = async () => {
        const $expansions = document.querySelectorAll('.set-logo-grid-item');

        const $printWrapper = document.createElement('div');
        $printWrapper.setAttribute('id', 'print');

        $expansions.forEach($expansion => {
            const logoUri = $expansion.querySelector('img.set-logo-grid-item-set-logo').getAttribute('src');
            const expansionName = $expansion.querySelector('.set-logo-grid-item-set-name').innerText;
            const cleanExpansionName = toValidCssClassName(expansionName);

            const $placeholder = document.createElement('div');
            $placeholder.classList.add(...['expansion']);
            $placeholder.setAttribute('data-expansions-name', cleanExpansionName);
            $placeholder.innerHTML += `<img src="${logoUri}" class="logo" alt="Expansion logo"/>`;

            if ($expansion.querySelectorAll('img.set-logo-grid-item-set-symbol').length > 0) {
                const symbolUri = $expansion.querySelector('img.set-logo-grid-item-set-symbol').getAttribute('src');
                $placeholder.innerHTML += `<img src="${symbolUri}" class="symbol" alt="Expansion Symbol"/>`;
            }

            $printWrapper.appendChild($placeholder.cloneNode(true));
            $printWrapper.appendChild($placeholder.cloneNode(true));

            // Add a checkbox to select the expansion in print-selection-mode.
            const $checkbox = document.createElement('input');
            $checkbox.setAttribute('type', 'checkbox');
            $checkbox.setAttribute('data-expansions-name', cleanExpansionName);
            $checkbox.addEventListener('click', () => {
                document.querySelector('button span.count').innerHTML = document.querySelectorAll('input[type="checkbox"][data-expansions-name]:checked').length;
            })
            $expansion.appendChild($checkbox);
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
        $printButton.innerHTML = `<span class="fa-solid fa-print"></span><div>Print <span class="count">0</span> expansion logo(s)</div>`;
        $printButton.addEventListener('click', () => {
            // Hide all unchecked expansions.
            document.querySelectorAll(`div.expansion[data-expansions-name]`).forEach($placeholder => {
                $placeholder.style.display = null;
            });
            document.querySelectorAll('input[type="checkbox"][data-expansions-name]:not(:checked)').forEach($checkbox => {
                const expansionName = $checkbox.getAttribute('data-expansions-name');
                document.querySelectorAll(`div.expansion[data-expansions-name="${expansionName}"]`).forEach($placeholder => {
                    $placeholder.style.display = 'none';
                });

            });
            $body.classList.add('printing');
            window.print();
        })

        $inner.appendChild($printButton);
        $inner.appendChild($cancelPrintSelectionModeButton);


        const $togglePrintSelectionModeButton = document.createElement('button');
        $togglePrintSelectionModeButton.classList.add(...['button', 'button-plain-alt', 'toggle-print-selection']);
        $togglePrintSelectionModeButton.setAttribute('title', 'Print expansion logos');
        $togglePrintSelectionModeButton.innerHTML = `<span class="fa-solid fa-print"></span><div>Print expansion logos</div>`;
        $togglePrintSelectionModeButton.addEventListener('click', () => {
            $body.classList.add('in-print-selection-mode');
        });

        const $appendTo = document.querySelector('div#set-search-result-header');
        $appendTo.appendChild($togglePrintSelectionModeButton);

        addEventListener("afterprint", () => {
            $body.classList.remove('in-print-selection-mode');
            $body.classList.remove('printing');
        });

    }
}