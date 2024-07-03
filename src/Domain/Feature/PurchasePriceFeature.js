export class PurchasePriceFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getFeatureDescription = () => {
      return 'Purchase prices for cards';
    };

    getReasonsForFailure = async () => {
        const response = await fetch('https://www.tcgcollector.com/cards/42567');
        const html = await response.text();

        const template = document.createElement('template');
        template.innerHTML = '<div>' + html + '</div>';
        const result = template.content.children;

        const failureReasons = [];
        if (result[0].querySelectorAll('div#card-page-inner-content div.card-image-controls').length === 0) {
            failureReasons.push('Proper html element not found to attach prices to');
        }
        if (!this.settings.googleSpreadSheetId) {
            failureReasons.push('Google Spreadsheet ID not configured');
        }

        return failureReasons;
    }


}