const contains = (selector, text) => {
    return [...document.querySelectorAll(selector)].filter(element => element.childNodes?.[0]?.nodeValue?.match(text))
}

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

