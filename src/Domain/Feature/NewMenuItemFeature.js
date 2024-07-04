export class NewMenuItemFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getId = () => {
        return 'new-menu-item-feature';
    };

    needsToBeAppliedForLocation = (currentLocation) => {
        return document.querySelectorAll('div#navbar-buttons').length > 0;
    }

    apply = () => {
        const $menu = document.querySelector('div#navbar-buttons');

        const $menuItem = document.createElement("a");
        $menuItem.classList.add('navbar-button');
        $menuItem.setAttribute('href', 'https://docs.google.com/spreadsheets/d/' + this.settings.googleSpreadSheetId);
        $menuItem.setAttribute('title', 'Navigate to spreadsheet');
        $menuItem.setAttribute('target', '_blank');
        $menuItem.innerHTML = `<span aria-hidden="true" class="fa-solid fa-file-csv"></span>`;

        $menu.prepend($menuItem);
    }
}