import {GoogleSheet} from "../GoogleSheet";

export class QuickAccessLinksFeature {
    constructor(settings, currentRegion) {
        this.settings = settings;
        this.currentRegion = currentRegion;
    }

    getId = () => {
        return 'quick-access-links-feature';
    };

    needsToBeAppliedForLocation = (currentLocation) => {
        return currentLocation.pathname.includes('/dashboard');
    }

    apply = async () => {
        const $quickAccessContainer = document.querySelectorAll('div.dashboard-section div.list-group')[1];
        $quickAccessContainer.innerHTML = '<div class="loading-state-loading-spinner-underlay" style="display: flex; justify-content: center"><div class="loading-state-loading-spinner loading-spinner"></div></div>';

        const googleSheetSlabsAndSingles = new GoogleSheet(
            this.settings.getGoogleSpreadSheetId(),
            'Slabs / Singles'
        );
        const slabsAndSingles = this.currentRegion.filterRows(await googleSheetSlabsAndSingles.parse());
        const singlesCardIds = slabsAndSingles.filter(row => row.type === 'Single').map(row => parseInt(row.cardId));
        const uri = `/cards?releaseDateOrder=newToOld&cardsPerPage=120&displayAs=images&sortBy=cardNameAsc&cards=${singlesCardIds.join(',')}`;

        const googleSheetQuickAccessLinks = new GoogleSheet(
            this.settings.getGoogleSpreadSheetId(),
            'Quick access links',
        );
        const quickAccessLinks = (await googleSheetQuickAccessLinks.parse()).filter(row => {
            return row[this.currentRegion.name] === "TRUE";
        });
        quickAccessLinks.push({
            'title': 'Singles',
            'url': uri,
            'icon': 'fa-database'
        });

        $quickAccessContainer.innerHTML = '';
        quickAccessLinks.forEach(link => {
            const $quickAccessLink = document.createElement("a");
            $quickAccessLink.classList.add('list-group-item');
            $quickAccessLink.setAttribute('href', this.currentRegion.buildUri(link.url));
            $quickAccessLink.innerHTML = `
        <span class="list-group-item-left-item-container">
          <span aria-hidden="true" class="list-group-item-side-item-icon fa-solid ${link.icon} fa-fw"></span>
        </span>
        ${link.title}
        <span class="list-group-item-right-item-container">
          <span aria-hidden="true" class="list-group-item-side-item-icon fa-solid fa-chevron-right"></span>
        </span>`;
            $quickAccessContainer.appendChild($quickAccessLink);
        });
    }
}