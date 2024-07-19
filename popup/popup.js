import {
    SETTING_CARD_MARKET_MIN_CONDITION,
    SETTING_EBAY_LISTING_TYPE, SETTING_EBAY_SORT_BY,
    SETTING_EBAY_URL,
    SETTING_GOOGLE_SPREADSHEET_ID,
    SETTING_HIDE_PRICES,
    SETTING_MARKET_PLACE_LINKS,
    Settings
} from "../src/Infrastructure/Settings";
import Container from "../src/Infrastructure/Container";

const initPopup = async () => {
    const settings = Container.Settings;
    const $form = document.querySelector("form");
    const $submitButton = $form.querySelector('button');

    $form.elements[SETTING_GOOGLE_SPREADSHEET_ID].value = settings.getGoogleSpreadSheetId();
    $form.elements[SETTING_HIDE_PRICES].checked = settings.hidePrices();
    $form.elements[SETTING_MARKET_PLACE_LINKS].value = settings.getMarketPlaceLinks();
    $form.elements[SETTING_CARD_MARKET_MIN_CONDITION].value = settings.getCardMarketMinCondition();
    $form.elements[SETTING_EBAY_URL].value = settings.getEbayUrl();
    $form.elements[SETTING_EBAY_LISTING_TYPE].value = settings.getEbayListingType();
    $form.elements[SETTING_EBAY_SORT_BY].value = settings.getEbaySortBy();

    Settings.getSettingsWithMultipleValues().forEach(prop => {
        settings.get(prop).forEach(value => {
            $form.elements[prop + '[' + value + ']'].checked = true;
        });
    });

    const targetId = $form.querySelector('input[data-target-toggle]:checked').getAttribute('data-target-toggle');
    if (targetId) {
        $form.querySelector('[data-toggle-id="' + targetId + '"]').style.display = 'flex';
    }

    $form.addEventListener('input', function (event) {
        const el = event.target;
        $submitButton.disabled = false;

        if (el.hasAttribute('data-target-toggle')) {
            $form.querySelectorAll('[data-toggle-id]').forEach(function (el) {
                el.style.display = 'none';
            });
            const targetId = el.getAttribute('data-target-toggle');
            if (el.checked && targetId) {
                $form.querySelector('[data-toggle-id="' + targetId + '"]').style.display = 'flex';
            }
        }
    });

    $form.addEventListener("submit", async (e) => {
        e.preventDefault();
        $submitButton.disabled = true;
        const formData = new FormData($form);
        await Settings.save(formData);

        // Reload all tcgcollector.com tabs to reflect new settings.
        chrome.tabs.query({
            url: 'https://www.tcgcollector.com/*'
        }, ([tab]) => {
            chrome.tabs.update(tab.id, {url: tab.url});
        });
    });
};

initPopup();