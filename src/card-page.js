import {CardPage} from "./Domain/Page/CardPage";
import {Settings} from "./Domain/Settings";

const settings = await Settings.load();
if (!settings.googleSpreadSheetId) {
    throw new Error('Google Spreadsheet ID not configured');
}

const $appendToDiv = document.querySelector('div#card-page-inner-content div.card-image-controls');
if ($appendToDiv) {
    const cardPage = new CardPage(
        document.querySelector('[data-card-id]').getAttribute('data-card-id'),
        settings
    );

    $appendToDiv.appendChild(await cardPage.buildPurchasePrices());
}