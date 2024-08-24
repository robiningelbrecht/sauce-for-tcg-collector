import {GoogleSheet} from "../Infrastructure/Utils/GoogleSheet";
import {GradingCompany} from "../Domain/GradingCompany";
import {AppState} from "../Infrastructure/AppState";
import {Toast} from "../Component/Toast";

export class PurchasePriceFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getId = () => {
        return 'purchase-price-feature';
    };

    needsMutationObserver = () => {
        return false;
    };

    needsToBeApplied = (appState) => {
        if (appState.getRouteName() === 'cards_card_page') {
            return true;
        }

        if (appState.getRouteName() === 'cards_page') {
            return true;
        }

        return appState.getRouteName() === 'sets_set_cards_page';
    }

    apply = async () => {
        const appState = AppState.fromHtml();
        if (appState.getRouteName() === 'cards_card_page') {
            const cardId = AppState.fromHtml().getCardId();
            await navigator.clipboard.writeText(cardId);
            Toast.success(`Card id "${cardId}" copied to clipboard.`).show();

            const $wrapperDiv = document.createElement('div');
            $wrapperDiv.classList.add('tcg-collector-card-prices-wrapper');

            const $priceRowsDiv = document.createElement('div');
            $priceRowsDiv.classList.add('tcg-collector-card-prices');

            const googleSheet = new GoogleSheet(
                this.settings.getGoogleSpreadSheetId(),
                'Slabs / Singles',
            )
            const parsedRows = await googleSheet.parse();
            const matchedRows = parsedRows.filter((row) => parseInt(row.cardId) === cardId && row.price !== undefined);
            if (matchedRows.length === 0) {
                return $wrapperDiv;
            }

            matchedRows.forEach(function (row) {
                const $priceRowDiv = document.createElement("div");
                $priceRowDiv.innerHTML = `<div>${row.purchaseDate}</div><div>${row.price}</div>`;

                try {
                    const gradingCompany = new GradingCompany(row.gradingCompany);
                    if (row.certNumber) {
                        $priceRowDiv.innerHTML += `
<div class="grading">
    <span>${row.type}</span>
    <a href="${gradingCompany.getCertUrl(row.certNumber)}" target="_blank" title="${gradingCompany.getLabel()}" class="icon ${gradingCompany.getName()}">
        ${gradingCompany.getLabel()}
    </a>
</div>`;
                    } else {
                        $priceRowDiv.innerHTML += `
<div class="grading">
    <span>${row.type}</span>
    <span title="${gradingCompany.getLabel()}" class="icon ${gradingCompany.getName()}">
        ${gradingCompany.getLabel()}
    </span>
</div>`;
                    }
                } catch (e) {
                    $priceRowDiv.innerHTML += `<div>${row.type}</div>`;
                }

                $priceRowsDiv.appendChild($priceRowDiv);
            });

            const $titleDiv = document.createElement("div");
            $titleDiv.innerHTML = 'Purchase price(s)'
            $titleDiv.classList.add('title');
            $wrapperDiv.appendChild($titleDiv);
            $wrapperDiv.appendChild($priceRowsDiv);

            const $appendToDiv = document.querySelector('div#card-page-inner-content div.card-image-controls');
            $appendToDiv.appendChild($wrapperDiv);

            return;
        }

        const googleSheet = new GoogleSheet(
            this.settings.getGoogleSpreadSheetId(),
            'Slabs / Singles',
        )
        const parsedRows = await googleSheet.parse();

        const $cards = document.querySelectorAll('div#card-image-grid div.card-image-grid-item');
        $cards.forEach($card => {
            const cardId = parseInt($card.getAttribute('data-card-id'));
            const matchedRows = parsedRows.filter((row) => parseInt(row.cardId) === cardId && row.price === undefined);

            if (matchedRows.length > 0) {
                $card.setAttribute('data-is-en-route', '');
            }
        });

    }
}