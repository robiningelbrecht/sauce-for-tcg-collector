const hidePrices = async () => {
    const {settings} = await chrome.storage.sync.get("settings");
    if (!settings.hidePrices) {
        return;
    }

    contains('*', /\$([\d]+\.?\d*)/g).forEach(element => {
        element.innerHTML = element.innerHTML.replace(/\$([\d]+\.?\d*)/g, '$—')
    });
};

hidePrices();

