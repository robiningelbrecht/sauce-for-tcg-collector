import {contains} from './Domain/Utils';
import {Settings} from "./Domain/Settings";
import {MenuItem} from "./Domain/Menu/MenuItem";
import {Console} from "./Domain/Console";

const settings = await Settings.load();
if (!settings.googleSpreadSheetId) {
    throw new Error('Google Spreadsheet ID not configured');
}

if (settings.hidePrices) {
    contains('*', /\$([\d]+\.?\d*)/g).forEach(element => {
        element.innerHTML = element.innerHTML.replace(/\$([\d]+\.?\d*)/g, '$—')
    });
}

const $menu = document.querySelector('div#navbar-buttons');
$menu.prepend((new MenuItem(settings.googleSpreadSheetId).build()));

(new Console()).checkAndReportFeatures();