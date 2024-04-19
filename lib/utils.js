const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

const parseSheet = async () => {
    const {settings} = await chrome.storage.sync.get("settings");
    if (!settings.googleSpreadSheetId) {
        return;
    }

    const parser = new PublicGoogleSheetsParser(settings.googleSpreadSheetId, {useFormat: true});
    const rows = await parser.parse();

    const parsedRows = rows.map(row => {
        const camelizedRow = {};

        Object.keys(row)
            .forEach((k) => {
                camelizedRow[camelize(k)] = row[k];
            });

        return camelizedRow;
    });

    return parsedRows.filter(
        row =>
            row.hasOwnProperty('cardId') && row.hasOwnProperty('price')
            && row.hasOwnProperty('purchaseDate') && row.hasOwnProperty('region')
            && row.hasOwnProperty('type')
    );
}