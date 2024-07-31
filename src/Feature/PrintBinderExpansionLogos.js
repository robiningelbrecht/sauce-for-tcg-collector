import {toValidCssClassName} from "../Infrastructure/Utils/Functions";

export class PrintBinderExpansionLogos {
    constructor() {

    }

    getId = () => {
        return 'print-binder-expansion-logos';
    };

    needsToBeAppliedForLocation = (currentLocation) => {
        return currentLocation.pathname.includes('/expansions/');
    }

    apply = async () => {
        const $expansions = document.querySelectorAll('.expansion-logo-grid-item');

        const $printWrapper = document.createElement('div');
        $printWrapper.setAttribute('id', 'print');

        $expansions.forEach($expansion => {
            const logoUri = $expansion.querySelector('img.expansion-logo-grid-item-expansion-logo').getAttribute('src');
            const expansionName = $expansion.querySelector('.expansion-logo-grid-item-expansion-name').innerText;

            const $placeholder = document.createElement('div');
            $placeholder.classList.add(...['expansion', toValidCssClassName(expansionName)]);
            $placeholder.innerHTML += `<img src="${logoUri}" class="logo" alt="Expansion logo"/>`;

            if ($expansion.querySelectorAll('img.expansion-logo-grid-item-expansion-symbol').length > 0) {
                const symbolUri = $expansion.querySelector('img.expansion-logo-grid-item-expansion-symbol').getAttribute('src');
                $placeholder.innerHTML += `<img src="${symbolUri}" class="symbol" alt="Expansion Symbol"/>`;
            }

            $printWrapper.appendChild($placeholder.cloneNode(true));
            $printWrapper.appendChild($placeholder.cloneNode(true));
        });


        document.body.appendChild($printWrapper);

        const $printButton = document.createElement('button');
        $printButton.classList.add(...['button', 'button-primary', 'print']);
        $printButton.setAttribute('title', 'Print expansion logos');
        $printButton.innerHTML = `<span class="fa-solid fa-print"></span><div>Print expansion logos</div>`;
        $printButton.addEventListener('click', () => {
            document.body.classList.add('printing');
            window.print();
        });

        const $appendTo = document.querySelector('div#expansion-search-result-header');
        $appendTo.appendChild($printButton);

        addEventListener("afterprint", () => {
            document.body.classList.remove('printing');
        });

    }
}