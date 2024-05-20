let {settings} = await chrome.storage.sync.get("settings");
const $form = document.querySelector("form");
const $googleSpreadSheetId = document.getElementById('googleSpreadSheetId');
const $hideprices = document.getElementById('hidePrices');

if (!settings) {
    settings = {};
}
$googleSpreadSheetId.value = settings.googleSpreadSheetId || '';
$hideprices.checked = settings.hidePrices || false;

$form.addEventListener("submit", async () => {
    settings.googleSpreadSheetId = $googleSpreadSheetId.value;
    settings.hidePrices = $hideprices.checked;
    await chrome.storage.sync.set({settings: settings});
});