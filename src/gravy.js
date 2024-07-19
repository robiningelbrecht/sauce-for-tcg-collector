import {Settings} from "./Infrastructure/Settings";
import {Toast} from "./Component/Toast";
import {consolePrint} from "./Infrastructure/Utils/Console";

const pourGravy = async () => {
    const settings = await Settings.fromSyncStorage();
    if (settings.getMarketPlaceLinks() !== 'cardMarket') {
        return;
    }

    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.size !== 0) {
        return;
    }

    const query = {};
    if (settings.getCardMarketMinCondition()) {
        query.minCondition = settings.getCardMarketMinCondition();
    }
    if (settings.getCardMarketCardLanguages()) {
        query.language = settings.getCardMarketCardLanguages();
    }
    if (settings.getCardMarketSellerLocations()) {
        query.sellerCountry = settings.getCardMarketSellerLocations();
    }

    window.location.replace(`${window.location.href.replace(/\/$/, "")}?${(new URLSearchParams(query)).toString()}`);
}


pourGravy().catch(error => {
    Toast.error(`Oops, something 🐟y is going on. Check console for details.`).show();
    consolePrint(error.message);
    consolePrint(error.stack);
});

