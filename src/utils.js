const PublicGoogleSheetsParser = require('public-google-sheets-parser');

const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

export class Region {
    constructor(name) {
        this.name = name;
    }

    filterRows(rows, filterAll = false) {
        if (this.name === 'all' && !filterAll) {
            return rows;
        }

        return rows.filter(row => row.region === this.name);
    }

    static fromCurrentUrl() {
        const href = window.location.href.replace('#', '');
        if (href.split('/').length === 4) {
            return new Region('all');
        }
        return new Region(href.split('/').slice(-1)[0]);
    }
}

export const contains = (selector, text) => {
    return [...document.querySelectorAll(selector)].filter(element => element.childNodes?.[0]?.nodeValue?.match(text))
}

export const parseSheet = async (sheetName) => {
    const {settings} = await chrome.storage.sync.get("settings");
    if (!settings.googleSpreadSheetId) {
        return;
    }

    const parser = new PublicGoogleSheetsParser(settings.googleSpreadSheetId, {sheetName: sheetName, useFormat: true});
    const rows = await parser.parse();

    return rows.map(row => {
        const camelizedRow = {};

        Object.keys(row)
            .forEach((k) => {
                camelizedRow[camelize(k)] = row[k];
            });

        return camelizedRow;
    });
}