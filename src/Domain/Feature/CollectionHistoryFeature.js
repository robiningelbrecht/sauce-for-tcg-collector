export class CollectionHistoryFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getFeatureDescription = () => {
        return 'Collection history';
    };

    getReasonsForFailure = async () => {
        return [];
    }


}