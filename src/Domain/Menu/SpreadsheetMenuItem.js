export class SpreadsheetMenuItem {
    constructor(spreadSheetId) {
        this.spreadSheetId = spreadSheetId;
    }

    build = ()=> {
        const $menuItem = document.createElement("a");
        $menuItem.classList.add('navbar-button');
        $menuItem.setAttribute('href', 'https://docs.google.com/spreadsheets/d/' + this.spreadSheetId);
        $menuItem.setAttribute('title', 'Navigate to spreadsheet');
        $menuItem.setAttribute('target', '_blank');
        $menuItem.innerHTML = `<span aria-hidden="true" class="fa-solid fa-file-csv"></span>`;

        return $menuItem;
    };
}