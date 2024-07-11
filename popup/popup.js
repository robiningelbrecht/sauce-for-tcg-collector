import {
    SETTING_CARD_MARKET_CARD_LANGUAGES,
    SETTING_CARD_MARKET_MIN_CONDITION, SETTING_CARD_MARKET_SELLER_LOCATIONS, SETTING_EBAY_URL,
    SETTING_GOOGLE_SPREADSHEET_ID,
    SETTING_HIDE_PRICES,
    SETTING_MARKET_PLACE_LINKS,
    Settings
} from "../src/Domain/Settings";

const initPopup = async () => {
    const settings = await Settings.load();
    const $form = document.querySelector("form");

    $form.elements[SETTING_GOOGLE_SPREADSHEET_ID].value = settings[SETTING_GOOGLE_SPREADSHEET_ID];
    $form.elements[SETTING_HIDE_PRICES].checked = settings[SETTING_HIDE_PRICES];
    $form.elements[SETTING_MARKET_PLACE_LINKS].value = settings[SETTING_MARKET_PLACE_LINKS];
    $form.elements[SETTING_CARD_MARKET_MIN_CONDITION].value = settings[SETTING_CARD_MARKET_MIN_CONDITION];
    $form.elements[SETTING_EBAY_URL].value = settings[SETTING_EBAY_URL];

    Settings.getPropertiesWithMultipleValues().forEach(prop => {
        settings[prop].forEach(value => {
            $form.elements[prop + '[' + value + ']'].checked = true;
        });
    });

    const targetId = $form.querySelector('input[data-target-toggle]:checked').getAttribute('data-target-toggle');
    if (targetId) {
        $form.querySelector('[data-toggle-id="' + targetId + '"]').style.display = 'flex';
    }

    $form.addEventListener('input', function (event) {
        const el = event.target;

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