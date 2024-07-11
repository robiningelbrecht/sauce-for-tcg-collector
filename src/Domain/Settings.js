export const SETTING_GOOGLE_SPREADSHEET_ID = 'googleSpreadSheetId';
export const SETTING_HIDE_PRICES = 'hidePrices';
export const SETTING_MARKET_PLACE_LINKS = 'marketPlaceLinks';
export const SETTING_CARD_MARKET_CARD_LANGUAGES = 'cardMarketCardLanguages';
export const SETTING_CARD_MARKET_SELLER_LOCATIONS = 'cardMarketSellerLocations';
export const SETTING_CARD_MARKET_MIN_CONDITION = 'cardMarketMinCondition';
export const SETTING_EBAY_URL = 'ebayUrl';
export const SETTING_EBAY_LISTING_TYPE = 'ebayListingType';
export const SETTING_EBAY_SORT_BY = 'ebaySortBy';

export class Settings {
    static load = async () => {
        let {settings} = await chrome.storage.sync.get("settings");

        if (!settings) {
            settings = {};
            // Set default values.
            settings[SETTING_GOOGLE_SPREADSHEET_ID] = '';
            settings[SETTING_HIDE_PRICES] = false;
            settings[SETTING_MARKET_PLACE_LINKS] = 'none';
            settings[SETTING_CARD_MARKET_CARD_LANGUAGES] = [];
            settings[SETTING_CARD_MARKET_SELLER_LOCATIONS] = [];
            settings[SETTING_CARD_MARKET_MIN_CONDITION] = 2;
            settings[SETTING_EBAY_URL] = '';
            settings[SETTING_EBAY_LISTING_TYPE] = 'all';
            settings[SETTING_EBAY_SORT_BY] = 'best_match';
        }

        return settings;
    }

    static save = async (formData) => {
        const formJSON = Object.fromEntries(formData.entries());

        Settings.getPropertiesWithMultipleValues().forEach(prop => {
            formJSON[prop] = formData.getAll(prop);
        });

        await chrome.storage.sync.set({
            settings: formJSON
        });
    }

    static getPropertiesWithMultipleValues = () => {
        return [SETTING_CARD_MARKET_CARD_LANGUAGES, SETTING_CARD_MARKET_SELLER_LOCATIONS];
    }
}