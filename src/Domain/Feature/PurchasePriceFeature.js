import {GoogleSheet} from "../GoogleSheet";
import {GradingCompany} from "../GradingCompany";

export class PurchasePriceFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getId = () => {
        return 'purchase-price-feature';
    };

    needsToBeAppliedForLocation = (currentLocation) => {
        const regex = /cards\/[\d]+\/[\S]+/mi;
        return regex.test(currentLocation.pathname);
    }

    apply = async () => {
        const cardId = document.querySelector('[data-card-id]').getAttribute('data-card-id');
        const $wrapperDiv = document.createElement("div");
        $wrapperDiv.classList.add('tcg-collector-card-prices-wrapper');

        const $priceRowsDiv = document.createElement("div");
        $priceRowsDiv.classList.add('tcg-collector-card-prices');

        const googleSheet = new GoogleSheet(
            this.settings.googleSpreadSheetId,
            'Slabs / Singles',
        )
        const parsedRows = await googleSheet.parse();
        const matchedRows = parsedRows.filter((row) => row.cardId === cardId);
        if (matchedRows.length === 0) {
            return $wrapperDiv;
        }

        matchedRows.forEach(function (row) {
            const $priceRowDiv = document.createElement("div");
            $priceRowDiv.innerHTML = `<div>${row.purchaseDate}</div><div>${row.price}</div>`;

            try {
                const gradingCompany = new GradingCompany(row.gradingCompany);
                if(row.certNumber){
                    $priceRowDiv.innerHTML += `
<div class="grading">
    <span>${row.type}</span>
    <a href="${gradingCompany.getGetCertUrl(row.certNumber)}" target="_blank" title="${gradingCompany.getLabel()}" class="icon ${gradingCompany.getName()}">
        ${gradingCompany.getLabel()}
    </a>
</div>`;
                }else{
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