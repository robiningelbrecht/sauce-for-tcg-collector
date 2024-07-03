export class QuickAccessLinksFeature {
    constructor(settings, $html) {
        this.settings = settings;
        this.$html = $html;
    }

    getFeatureDescription = () => {
        return 'Quick access links';
    };

    getReasonsForFailure = async () => {
        const failureReasons = [];
        if (this.$html.querySelectorAll('div.dashboard-section div.list-group').length === 0) {
            failureReasons.push('Proper html element to attach quick access links to not found');
        }
        if (!this.settings.googleSpreadSheetId) {
            failureReasons.push('Google Spreadsheet ID not configured');
        }

        return failureReasons;
    }


}