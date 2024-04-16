const renderMenu = () => {
    const $menu = document.querySelector('div#navbar-buttons');
    const $menuItem = document.createElement("a");
    $menuItem.classList.add('navbar-button');
    $menuItem.setAttribute('href', 'https://docs.google.com/spreadsheets/d/1wJQc9-QIBdzfJdqVkQTXpbdCWepL-Pmf_m4rdaUBFYk/edit#gid=0');
    $menuItem.setAttribute('title', 'Navigate to spreadsheet');
    $menuItem.setAttribute('target', '_blank');
    $menuItem.innerHTML = `<span aria-hidden="true" class="fa-solid fa-file-csv"></span>`;

    $menu.prepend($menuItem);
}

renderMenu();