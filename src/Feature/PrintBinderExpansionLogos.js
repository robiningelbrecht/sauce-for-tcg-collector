import {toValidCssClassName} from "../Infrastructure/Utils/Functions";

export class PrintBinderExpansionLogos {
    constructor() {

    }

    getId = () => {
        return 'print-binder-expansion-logos';
    };

    needsToBeApplied = (appState) => {
        return appState.getRouteName() === 'sets_page';
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

            const $checkboxLabel = document.createElement('label');
            $checkboxLabel.appendChild($checkbox);
            $expansion.appendChild($checkboxLabel);
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
            const size = parseInt(document.querySelector('.size input').value);
            const shape = document.querySelector('.shape select').value;

            const pageBreakAfterElementCount = Math.floor(210 / (size + 2.5)) * Math.floor(297 / (size + 2.5));

            document.querySelectorAll(`div.expansion[data-expansions-name]`).forEach($placeholder => {
                $placeholder.style.display = 'none';
                $placeholder.style.setProperty('--expansion-width', `${size}mm`);
                $placeholder.style.setProperty('--expansion-border-radius', shape);
                $placeholder.classList.remove(...['page-break']);
            });

            let count = 0;
            document.querySelectorAll('input[type="checkbox"][data-expansions-name]:checked').forEach($checkbox => {
                const expansionName = $checkbox.getAttribute('data-expansions-name');
                document.querySelectorAll(`div.expansion[data-expansions-name="${expansionName}"]`).forEach($placeholder => {
                    $placeholder.style.display = null;
                    count++;
                    if (count % pageBreakAfterElementCount === 0) {
                        $placeholder.classList.add(...['page-break']);
                    }
                });
            });

            $body.classList.add('printing');
            window.print();
        });

        const $shapeSelect = document.createElement('div');
        $shapeSelect.classList.add(...['shape']);
        $shapeSelect.innerHTML = `<span class="fa-swatchbook fa-solid"></span>
            <select>
            <option value="50%" selected>Circle</option>
            <option value="0">Rectangle</option>
            </select>`;

        const $sizeInput = document.createElement('div');
        $sizeInput.classList.add(...['size']);
        $sizeInput.innerHTML = `<span class="fa-up-right-and-down-left-from-center fa-solid"></span><input type="number" min="1" max="99" value="39"/><span class="unit">mm</span>`;

        $inner.appendChild($shapeSelect);
        $inner.appendChild($sizeInput);
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
            $body.classList.remove('printing');
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                $body.classList.remove('in-print-selection-mode');
            }
        });


    }
}