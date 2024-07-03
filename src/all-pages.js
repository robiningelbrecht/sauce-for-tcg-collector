import {contains} from './Domain/Utils';
import {Settings} from "./Domain/Settings";
import {SpreadsheetMenuItem} from "./Domain/Menu/SpreadsheetMenuItem";
import {FeatureList} from "./Domain/Feature/FeatureList";

const settings = await Settings.load();

if (settings.enableDebugMode) {
    (new FeatureList()).debug();
}

if (!settings.googleSpreadSheetId) {
    throw new Error('Google Spreadsheet ID not configured');
}

if (settings.hidePrices) {
    contains('*', /\$([\d]+\.?\d*)/g).forEach(element => {
        element.innerHTML = element.innerHTML.replace(/\$([\d]+\.?\d*)/g, '$—')
    });
}

const $menu = document.querySelector('div#navbar-buttons');
$menu.prepend((new SpreadsheetMenuItem(settings.googleSpreadSheetId).build()));