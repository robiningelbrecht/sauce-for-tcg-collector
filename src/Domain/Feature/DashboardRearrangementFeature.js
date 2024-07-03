export class DashboardRearrangementFeature {
    constructor() {
    }

    getId = () => {
        return 'dashboard-rearrangement-feature';
    };

    needsToBeAppliedForLocation = (currentLocation) => {
        return currentLocation.pathname.includes('/dashboard');
    }

    getReasonsForFailure = async () => {
        const failureReasons = [];
        if (document.querySelectorAll('div.dashboard-sections-region').length !== 2) {
            failureReasons.push('Proper dashboard regions to re-arrange dashboard not found');
        }

        return failureReasons;
    }

    apply = async () => {
        const [$firstDashboardSectionsRegion, $secondDashboardSectionsRegion] = document.querySelectorAll('div.dashboard-sections-region');
        $firstDashboardSectionsRegion.querySelector('div#dashboard-expansions-completed-section').style.display = 'none';
        $secondDashboardSectionsRegion.style.display = 'none';
        $firstDashboardSectionsRegion.appendChild($secondDashboardSectionsRegion.querySelectorAll('div.dashboard-sections-subregion')[1].querySelector('div.dashboard-section'));

    }
}