import {Settings} from "./Domain/Settings";

const pourGravy = async () => {
    const settings = await Settings.load();
    if (settings.marketPlaceLinks !== 'cardMarket') {
        return;
    }

    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.size !== 0) {
        return;
    }

    const query = {};
    if (settings.cardMarketMinCondition) {
        query.minCondition = settings.cardMarketMinCondition;
    }
    if (settings.cardMarketCardLanguages) {
        query.language = settings.cardMarketCardLanguages;
    }
    if (settings.cardMarketSellerLocations) {
        query.sellerCountry = settings.cardMarketSellerLocations;
    }

    window.location.replace(`${window.location.href.replace(/\/$/, "")}?${(new URLSearchParams(query)).toString()}`);
}


pourGravy();

