export class DashboardRearrangementFeature {
    constructor($html) {
        this.$html = $html;
    }

    getFeatureDescription = () => {
        return 'Dashboard re-arrangement';
    };

    getReasonsForFailure = async () => {
        const failureReasons = [];
        if (this.$html.querySelectorAll('div.dashboard-sections-region').length !== 2) {
            failureReasons.push('Proper dashboard regions to re-arrange dashboard not found');
        }

        return failureReasons;
    }


}