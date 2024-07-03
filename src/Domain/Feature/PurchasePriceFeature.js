export class PurchasePriceFeature {
    constructor(settings, $html) {
        this.settings = settings;
        this.$html = $html;
    }

    getFeatureDescription = () => {
        return 'Purchase prices for cards';
    };

    getReasonsForFailure = async () => {
        const failureReasons = [];
        if (this.$html.querySelectorAll('div#card-page-inner-content div.card-image-controls').length === 0) {
            failureReasons.push('Proper html element to attach prices to not found');
        }
        if (this.$html.querySelector('[data-card-id]').getAttribute('data-card-id').length === 0) {
            failureReasons.push('Card id could not be determined');
        }
        if (!this.settings.googleSpreadSheetId) {
            failureReasons.push('Google Spreadsheet ID not configured');
        }

        return failureReasons;
    }


}