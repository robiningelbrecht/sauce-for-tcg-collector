export class CollectionHistoryFeature {
    constructor(settings, $html) {
        this.settings = settings;
        this.$html = $html;
    }

    getFeatureDescription = () => {
        return 'Collection history';
    };

    getReasonsForFailure = async () => {
        const failureReasons = [];
        if (this.$html.querySelectorAll('div#tcg-region-button-group-container').length === 0) {
            failureReasons.push('Proper html element to attach collection history to not found');
        }
        if (!this.settings.googleSpreadSheetId) {
            failureReasons.push('Google Spreadsheet ID not configured');
        }

        return failureReasons;
    }


}