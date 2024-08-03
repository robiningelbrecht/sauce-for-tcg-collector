import {
    SETTING_CARD_MARKET_MIN_CONDITION,
    SETTING_EBAY_LISTING_TYPE, SETTING_EBAY_LOCATION, SETTING_EBAY_SORT_BY,
    SETTING_EBAY_URL,
    SETTING_GOOGLE_SPREADSHEET_ID,
    SETTING_HIDE_PRICES,
    Settings
} from "../src/Infrastructure/Settings";
import Container from "../src/Infrastructure/Container";

const initPopup = async () => {
    const settings = Container.Settings;
    const $form = document.querySelector("form");
    const $submitButton = $form.querySelector('button[type="submit"]');
    const $clearIndexedDbButton = $form.querySelector('button[type="button"]');

    $form.elements[SETTING_GOOGLE_SPREADSHEET_ID].value = settings.getGoogleSpreadSheetId();
    $form.elements[SETTING_HIDE_PRICES].checked = settings.hidePrices();
    $form.elements[SETTING_CARD_MARKET_MIN_CONDITION].value = settings.getCardMarketMinCondition();
    $form.elements[SETTING_EBAY_URL].value = settings.getEbayUrl();
    $form.elements[SETTING_EBAY_LISTING_TYPE].value = settings.getEbayListingType();
    $form.elements[SETTING_EBAY_LOCATION].value = settings.getEbayLocation();
    $form.elements[SETTING_EBAY_SORT_BY].value = settings.getEbaySortBy();

    Settings.getSettingsWithMultipleValues().forEach(prop => {
        settings.get(prop).forEach(value => {
            $form.elements[prop + '[' + value + ']'].checked = true;
        });
    });

    $form.querySelectorAll('input[data-target-toggle]:checked').forEach($checked => {
        const targetId = $checked.getAttribute('data-target-toggle');
        $form.querySelector('[data-toggle-id="' + targetId + '"]').style.display = 'flex';
    });

    $form.addEventListener('input', function (event) {
        const el = event.target;
        $submitButton.disabled = false;

        if (el.hasAttribute('data-target-toggle')) {
            const targetId = el.getAttribute('data-target-toggle');
            if (el.checked) {
                $form.querySelector('[data-toggle-id="' + targetId + '"]').style.display = 'flex';
            }else{
                $form.querySelector('[data-toggle-id="' + targetId + '"]').style.display = 'none';
            }
        }
    });

    $form.addEventListener('submit', async (e) => {
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

    $clearIndexedDbButton.addEventListener('click', (e) => {
        e.preventDefault();
        Container.Connection.delete();
    })
};

initPopup();