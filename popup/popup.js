const initPopup = async () => {
    let {settings} = await chrome.storage.sync.get("settings");
    const $form = document.querySelector("form");
    const $reminder = document.getElementById('reminder');

    if (!settings) {
        settings = {};
    }

    $form.elements['googleSpreadSheetId'].value = settings.googleSpreadSheetId || ''
    $form.elements['hidePrices'].checked = settings.hidePrices || false;
    $form.elements['enableDebugMode'].checked = settings.enableDebugMode || false;

    $form.addEventListener('input', function () {
        $reminder.style.display = 'flex';
    });

    $form.addEventListener("submit", async (e) => {
        e.preventDefault();
        $reminder.style.display = 'none';

        settings.googleSpreadSheetId = $form.elements['googleSpreadSheetId'].value;
        settings.hidePrices = $form.elements['hidePrices'].checked;
        settings.enableDebugMode = $form.elements['enableDebugMode'].checked;
        await chrome.storage.sync.set({settings: settings});
    });
};

initPopup();