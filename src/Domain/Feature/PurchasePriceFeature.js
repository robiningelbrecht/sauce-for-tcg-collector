import {GoogleSheet} from "../GoogleSheet";

export class PurchasePriceFeature {
    constructor(settings, $html) {
        this.settings = settings;
        this.$html = $html;
    }

    getId = () => {
        return 'purchase-price-feature';
    };

    needsToBeAppliedForLocation = (currentLocation) => {
        const regex = /cards\/[\d]+\/[\S]+/mi;
        return regex.test(currentLocation.pathname);
    }

    getReasonsForFailure = async () => {
        const failureReasons = [];
        if (this.$html.querySelectorAll('div#card-page-inner-content div.card-image-controls').length === 0) {
            failureReasons.push('Proper html element to attach prices to not found');
        }
        if (this.$html.querySelector('[data-card-id]').getAttribute('data-card-id').length === 0) {
            failureReasons.push('Card id could not be determined');
        }
        if (!this.settings.googleSpreadSheetId) {
            failureReasons.push('Google Spreadsheet ID not configured');
        }

        return failureReasons;
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
            $priceRowDiv.innerHTML = `<div>${row.purchaseDate}</div><div>${row.price}</div><div title="${row.gradingCompany || row.type}">${row.type}</div>`
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