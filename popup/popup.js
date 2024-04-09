let { settings } = await chrome.storage.sync.get("settings");
const $form = document.querySelector("form");
const $googleSpreadSheetId = document.getElementById('googleSpreadSheetId');

if(!settings){
    settings = {};
}
$googleSpreadSheetId.value = settings.googleSpreadSheetId || '';

$form.addEventListener("submit", async () => {
    settings.googleSpreadSheetId = $googleSpreadSheetId.value;
    await chrome.storage.sync.set({ settings: settings });
});