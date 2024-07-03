export class NewMenuItemFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getFeatureDescription = () => {
        return 'New menu item';
    };

    getReasonsForFailure = async () => {
        return [];
    }


}