import {contains} from './Domain/Utils';
import {Settings} from "./Domain/Settings";
import {SpreadsheetMenuItem} from "./Domain/Menu/SpreadsheetMenuItem";
import {Console} from "./Domain/Console";
import {PurchasePriceFeature} from "./Domain/Feature/PurchasePriceFeature";
import {DebugMenuItem} from "./Domain/Menu/DebugMenuItem";

const $menu = document.querySelector('div#navbar-buttons');
$menu.prepend((new DebugMenuItem().build()));

const settings = await Settings.load();
if (!settings.googleSpreadSheetId) {
    throw new Error('Google Spreadsheet ID not configured');
}

if (settings.hidePrices) {
    contains('*', /\$([\d]+\.?\d*)/g).forEach(element => {
        element.innerHTML = element.innerHTML.replace(/\$([\d]+\.?\d*)/g, '$—')
    });
}

$menu.prepend((new SpreadsheetMenuItem(settings.googleSpreadSheetId).build()));