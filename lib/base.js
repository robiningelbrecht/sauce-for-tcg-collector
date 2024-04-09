init();

async function init() {
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

    const parser = new PublicGoogleSheetsParser(settings.googleSpreadSheetId, {useFormat: true});
    parser.parse().then((rows) => {
        const matchedRows = rows.filter((row) => row.CardId === cardId);
        if (matchedRows.length === 0) {
            return;
        }
        matchedRows.forEach(function (row) {
            const data = Object.entries(row).map((entry) => entry[1]);
            const $priceRowDiv = document.createElement("div");
            $priceRowDiv.innerHTML = `<div>${data[1]}</div><div>${data[2]}</div><div>${data[3]}</div>`
            $priceRowsDiv.appendChild($priceRowDiv);
        });

        const $titleDiv = document.createElement("div");
        $titleDiv.innerHTML = 'Purchase prices'
        $titleDiv.classList.add('title');
        $wrapperDiv.appendChild($titleDiv);
        $wrapperDiv.appendChild($priceRowsDiv);

        $appendToDiv.appendChild($wrapperDiv);
    });
}