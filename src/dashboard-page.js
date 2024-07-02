import {DashboardPage} from "./Domain/Page/DashboardPage";
import {Region} from "./Domain/Region";
import {Settings} from "./Domain/Settings";

const settings = await Settings.load();
if (!settings.googleSpreadSheetId) {
    throw new Error('Google Spreadsheet ID not configured');
}

const dashboardPage = new DashboardPage(
    document.querySelector('main#page-content'),
    Region.fromCurrentUrl(),
    settings
);
dashboardPage.reorder();
dashboardPage.renderQuickLinks();
dashboardPage.renderCollectionHistory();

window.addEventListener('keydown', (e) => {
    if (e.key == "Escape" && window.location.hash === '#modal') {
        window.location.hash = ""
    }
})