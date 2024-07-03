export class PrintBinderPlaceholdersFeature {
    constructor($html) {
        this.$html = $html;
    }

    getFeatureDescription = () => {
        return 'Print placeholders for binders';
    };

    getReasonsForFailure = async () => {
        const failureReasons = [];
        if (this.$html.querySelectorAll('div#card-image-grid div.card-image-grid-item').length === 0) {
            failureReasons.push('Proper html element to build print page not found');
        }

        return failureReasons;
    }


}