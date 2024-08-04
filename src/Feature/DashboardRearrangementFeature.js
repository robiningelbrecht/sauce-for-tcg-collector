export class DashboardRearrangementFeature {
    constructor() {
    }

    getId = () => {
        return 'dashboard-rearrangement-feature';
    };

    needsToBeApplied = (appState) => {
        return appState.getRouteName() === 'dashboard_page';
    }

    apply = async () => {
        const [$firstDashboardSectionsRegion, $secondDashboardSectionsRegion] = document.querySelectorAll('div.dashboard-sections-region');
        $firstDashboardSectionsRegion.querySelector('div#dashboard-sets-completed-section').style.display = 'none';
        $secondDashboardSectionsRegion.style.display = 'none';
        $firstDashboardSectionsRegion.appendChild($secondDashboardSectionsRegion.querySelectorAll('div.dashboard-sections-subregion')[1].querySelector('div.dashboard-section'));

    }
}