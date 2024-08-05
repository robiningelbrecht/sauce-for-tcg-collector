import {GoogleSheet} from "../Infrastructure/Utils/GoogleSheet";
import {GradingCompany} from "../Domain/GradingCompany";
import {AppState} from "../Infrastructure/AppState";

export class PurchasePriceFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getId = () => {
        return 'purchase-price-feature';
    };

    needsToBeApplied = (appState) => {
        return appState.getRouteName() === 'cards_card_page';
    }

    apply = async () => {
        const appState = AppState.fromHtml();
        const cardId = appState.getCardId();

        const $wrapperDiv = document.createElement("div");
        $wrapperDiv.classList.add('tcg-collector-card-prices-wrapper');

        const $priceRowsDiv = document.createElement("div");
        $priceRowsDiv.classList.add('tcg-collector-card-prices');

        const googleSheet = new GoogleSheet(
            this.settings.getGoogleSpreadSheetId(),
            'Slabs / Singles',
        )
        const parsedRows = await googleSheet.parse();
        const matchedRows = parsedRows.filter((row) => parseInt(row.cardId) === cardId);
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
    <a href="${gradingCompany.getGetCertUrl(row.certNumber)}" target="_blank" title="${gradingCompany.getLabel()}" class="icon ${gradingCompany.getName()}">
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
    }
}