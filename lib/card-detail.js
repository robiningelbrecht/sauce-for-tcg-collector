const displayPurchasePrices = async () => {
    const {settings} = await chrome.storage.sync.get("settings");
    const $appendToDiv = document.querySelector('div.card-image-controls');

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

    const parsedRows = await parseSheet();
    const matchedRows = parsedRows.filter((row) => row[0] === cardId);
    if (matchedRows.length === 0) {
        return;
    }

    matchedRows.forEach(function (row) {
        const $priceRowDiv = document.createElement("div");
        $priceRowDiv.innerHTML = `<div>${row[1]}</div><div>${row[2]}</div><div title="${row[4] || row[3]}">${row[3]}</div>`
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