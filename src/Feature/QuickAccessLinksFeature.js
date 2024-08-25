import {GoogleSheet} from "../Infrastructure/Utils/GoogleSheet";
import {TcgRegion} from "../Domain/TcgCollector/TcgRegion";

export class QuickAccessLinksFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getId = () => {
        return 'quick-access-links-feature';
    };

    needsMutationObserver = () => {
        return false;
    };

    needsToBeApplied = (appState) => {
        return appState.getRouteName() === 'dashboard_page';
    }

    apply = async () => {
        const currentRegion = TcgRegion.fromCurrentUrl();
        const $quickAccessContainer = document.querySelectorAll('div.dashboard-section div.list-group')[1];
        $quickAccessContainer.innerHTML = '<div class="loading-state-loading-spinner-underlay" style="display: flex; justify-content: center"><div class="loading-state-loading-spinner loading-spinner"></div></div>';

        const googleSheetSlabsAndSingles = new GoogleSheet(
            this.settings.getGoogleSpreadSheetId(),
            'Slabs / Singles'
        );
        const slabsAndSingles = currentRegion.filterRows(await googleSheetSlabsAndSingles.parse());
        const singlesCardIds = slabsAndSingles.filter(row => row.type === 'Single').map(row => parseInt(row.cardId));
        const uri = `/cards?cardSource=inCardCollection&cardsPerPage=120&sortBy=cardNameAsc&cards=${singlesCardIds.join(',')}`;

        const googleSheetQuickAccessLinks = new GoogleSheet(
            this.settings.getGoogleSpreadSheetId(),
            'Quick access links',
        );
        const quickAccessLinks = (await googleSheetQuickAccessLinks.parse()).filter(row => {
            return row[currentRegion.name] === "TRUE";
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
            $quickAccessLink.setAttribute('href', currentRegion.buildUri(link.url));
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