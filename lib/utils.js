const parseSheet = async () => {
    const {settings} = await chrome.storage.sync.get("settings");
    if (!settings.googleSpreadSheetId) {
        return;
    }

    const parser = new PublicGoogleSheetsParser(settings.googleSpreadSheetId, {useFormat: true});
    const rows = await parser.parse();
    const parsedRows = [];
    rows.map(row => Object.entries(row).map((entry) => entry[1])).forEach(function (row) {
        parsedRows.push(Object.entries(row).map((entry) => entry[1]));
    });

    return parsedRows.filter(row => row.length >= 5);
}