import { parseSheet } from './utils';

const displayPurchasePrices = async () => {
    const {settings} = await chrome.storage.sync.get("settings");
    const $appendToDiv = document.querySelector('div#card-page-inner-content div.card-image-controls');
    if(!$appendToDiv){
        return;
    }

    const $wrapperDiv = document.createElement("div");
    $wrapperDiv.classList.add('tcg-collector-card-prices-wrapper');

    const $errorDiv = document.createElement("div");
    $errorDiv.classList.add('error');

    const cardId = document.querySelector('[data-card-id]').getAttribute('data-card-id');
    if (!cardId) {
        return;
    }

    if (!settings.googleSpreadSheetId) {
        $errorDiv.innerHTML = 'You need to configure a Google spreadsheet ID';
        $wrapperDiv.appendChild($errorDiv);
        $appendToDiv.appendChild($wrapperDiv);
        return;
    }

    const $priceRowsDiv = document.createElement("div");
    $priceRowsDiv.classList.add('tcg-collector-card-prices');

    const parsedRows = await parseSheet('Slabs / Singles');
    const matchedRows = parsedRows.filter((row) => row.cardId === cardId);
    if (matchedRows.length === 0) {
        return;
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

    $appendToDiv.appendChild($wrapperDiv);
}

displayPurchasePrices();