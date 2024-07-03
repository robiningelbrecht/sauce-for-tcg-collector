import {GoogleSheet} from "../GoogleSheet";

export class CardPage {
    constructor(cardId, settings) {
        this.cardId = cardId;
        this.settings = settings;
    }

    buildPurchasePrices = async () => {
        const $wrapperDiv = document.createElement("div");
        $wrapperDiv.classList.add('tcg-collector-card-prices-wrapper');

        const $priceRowsDiv = document.createElement("div");
        $priceRowsDiv.classList.add('tcg-collector-card-prices');

        const googleSheet = new GoogleSheet(
            this.settings.googleSpreadSheetId,
            'Slabs / Singles',
        )
        const parsedRows = await googleSheet.parse();
        const matchedRows = parsedRows.filter((row) => row.cardId === this.cardId);
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

        return $wrapperDiv;
    }
}