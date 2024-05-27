const renderMenu = async () => {
    const {settings} = await chrome.storage.sync.get("settings");
    if (!settings.googleSpreadSheetId) {
        return;
    }

    const $menu = document.querySelector('div#navbar-buttons');
    const $menuItem = document.createElement("a");
    $menuItem.classList.add('navbar-button');
    $menuItem.setAttribute('href', 'https://docs.google.com/spreadsheets/d/' + settings.googleSpreadSheetId);
    $menuItem.setAttribute('title', 'Navigate to spreadsheet');
    $menuItem.setAttribute('target', '_blank');
    $menuItem.innerHTML = `<span aria-hidden="true" class="fa-solid fa-file-csv"></span>`;

    $menu.prepend($menuItem);
}

renderMenu();