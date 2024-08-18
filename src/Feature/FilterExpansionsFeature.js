export class FilterExpansionsFeature {
    constructor() {

    }

    getId = () => {
        return 'filter-expansions';
    };

    needsToBeApplied = (appState) => {
        return appState.getRouteName() === 'sets_page';
    }

    apply = async () => {
        const customFilters = JSON.parse(decodeURIComponent(new URLSearchParams(window.location.search).get('customFilters') || '{}'));
        if (!customFilters.hasOwnProperty('expansionIds')) {
            return;
        }

        const expansionIdsToFilter = customFilters.expansionIds;
        const $expansions = document.querySelectorAll('.set-logo-grid-item');
        $expansions.forEach($expansion => {
            const setId = $expansion.querySelector("*[data-set-like-id]").getAttribute('data-set-like-id');
            if (!expansionIdsToFilter.includes(parseInt(setId))) {
                $expansion.remove();
            }
        });

        // Hide all era's that do not have any expansions visible.
        document.querySelectorAll('.set-logo-grid').forEach($setGrid => {
            if ($setGrid.querySelectorAll('.set-logo-grid-item').length === 0) {
                $setGrid.remove();
            }
        });
    }
}