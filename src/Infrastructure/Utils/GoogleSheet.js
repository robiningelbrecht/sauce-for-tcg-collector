import PublicGoogleSheetsParser from "public-google-sheets-parser";
import {camelize} from "./Functions";

export class GoogleSheet{
    constructor(spreadSheetId, sheetName) {
        this.spreadSheetId = spreadSheetId;
        this.sheetName = sheetName;
    }

    parse = async () => {
        const parser = new PublicGoogleSheetsParser(this.spreadSheetId, {sheetName: this.sheetName, useFormat: true});
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
}