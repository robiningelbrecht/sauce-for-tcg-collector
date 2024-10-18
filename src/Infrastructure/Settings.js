export const SETTING_GOOGLE_SPREADSHEET_ID = 'googleSpreadSheetId';
export const SETTING_JAPANESE_CARD_PRICES_URL = 'japaneseCardPricesUrl';
export const SETTING_HIDE_PRICES = 'hidePrices';
export const SETTING_MARKET_PLACE_LINKS = 'marketPlaceLinks';
export const SETTING_CARD_MARKET_CARD_LANGUAGES = 'cardMarketCardLanguages';
export const SETTING_CARD_MARKET_SELLER_LOCATIONS = 'cardMarketSellerLocations';
export const SETTING_CARD_MARKET_MIN_CONDITION = 'cardMarketMinCondition';
export const SETTING_EBAY_URL = 'ebayUrl';
export const SETTING_EBAY_LISTING_TYPE = 'ebayListingType';
export const SETTING_EBAY_LOCATION = 'ebayLocation';
export const SETTING_EBAY_SORT_BY = 'ebaySortBy';

export class Settings {
    constructor(storage) {
        this.storage = storage;
    }

    getGoogleSpreadSheetId = () => {
        return this.storage[SETTING_GOOGLE_SPREADSHEET_ID] || '';
    }

    getJapaneseCardPricesUrl = () => {
        return this.storage[SETTING_JAPANESE_CARD_PRICES_URL] || '';
    }

    hidePrices = () => {
        return this.storage[SETTING_HIDE_PRICES] || false;
    }

    getMarketPlaceLinks = () => {
        return this.storage[SETTING_MARKET_PLACE_LINKS] || [];
    }

    getCardMarketCardLanguages = () => {
        return this.storage[SETTING_CARD_MARKET_CARD_LANGUAGES] || [];
    }

    getCardMarketSellerLocations = () => {
        return this.storage[SETTING_CARD_MARKET_SELLER_LOCATIONS] || [];
    }

    getCardMarketMinCondition = () => {
        return this.storage[SETTING_CARD_MARKET_MIN_CONDITION] || 2;
    }

    getEbayUrl = () => {
        return this.storage[SETTING_EBAY_URL] || '';
    }

    getEbayListingType = () => {
        return this.storage[SETTING_EBAY_LISTING_TYPE] || 'All';
    }

    getEbayLocation = () => {
        return this.storage[SETTING_EBAY_LOCATION] || 98;
    }

    getEbaySortBy = () => {
        return this.storage[SETTING_EBAY_SORT_BY] || 12;
    }

    get = (property) => {
        return this.storage[property] || [];
    }

    static getSettingsWithMultipleValues = () => {
        return [
            SETTING_MARKET_PLACE_LINKS,
            SETTING_CARD_MARKET_CARD_LANGUAGES,
            SETTING_CARD_MARKET_SELLER_LOCATIONS
        ];
    }

    static fromSyncStorage = async () => {
        let {settings} = await chrome.storage.sync.get("settings");
        return new Settings(settings || {});
    }

    static save = async (formData) => {
        const formJSON = Object.fromEntries(formData.entries());

        Settings.getSettingsWithMultipleValues().forEach(prop => {
            formJSON[prop] = formData.getAll(prop);
        });

        await chrome.storage.sync.set({
            settings: formJSON
        });
    }
}