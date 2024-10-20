import {AppState} from "../Infrastructure/AppState";

export class DashboardFeature {
    constructor(settings, JapaneseCardPriceRepository) {
        this.settings = settings;
        this.japaneseCardPriceRepository = JapaneseCardPriceRepository;
    }

    getId = () => {
        return 'dashboard-rearrangement-feature';
    };

    needsMutationObserver = () => {
        return false;
    };

    needsToBeApplied = (appState) => {
        return appState.getRouteName() === 'dashboard_page';
    }

    apply = async () => {
        const appState = AppState.fromHtml();

        const [$firstDashboardSectionsRegion, $secondDashboardSectionsRegion] = document.querySelectorAll('div.dashboard-sections-region');
        $firstDashboardSectionsRegion.querySelector('div#dashboard-sets-completed-section').style.display = 'none';
        $secondDashboardSectionsRegion.style.display = 'none';
        $firstDashboardSectionsRegion.appendChild($secondDashboardSectionsRegion.querySelectorAll('div.dashboard-sections-subregion')[1].querySelector('div.dashboard-section'));

        if (this.settings.hidePrices()) {
            return;
        }
        if (!this.settings.getJapaneseCardPricesUrl()) {
            return;
        }

        if (appState.isJapaneseTcgRegionContext()) {
            // Set real total market price.
            const totalCollectionValue = await this.japaneseCardPriceRepository.findTotalCollectionValueFor('jp');
            const $marketPrice = document.querySelectorAll('#dashboard-cards .dashboard-card')[3].querySelector('.dashboard-card-text');
            $marketPrice.innerHTML = `${totalCollectionValue.toFormat('$0')}`;
        }
        if (appState.isAllTcgRegionContext()) {
            const totalCollectionValue = await this.japaneseCardPriceRepository.findTotalCollectionValue();
            const $marketPrice = document.querySelectorAll('#dashboard-cards .dashboard-card')[3].querySelector('.dashboard-card-text');

            $marketPrice.innerHTML = `${totalCollectionValue.toFormat('$0')}`;
        }
    }
}