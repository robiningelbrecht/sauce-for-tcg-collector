import {contains} from "../Utils";

export class HidePricesFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getId = () => {
        return 'hide-prices-feature';
    };

    needsToBeAppliedForLocation = (currentLocation) => {
        return true;
    }

    getReasonsForFailure = async () => {
        return [];
    }

    apply = () => {
        if (!this.settings.hidePrices) {
            return;
        }

        contains('*', /\$([\d]+\.?\d*)/g).forEach(element => {
            element.innerHTML = element.innerHTML.replace(/\$([\d]+\.?\d*)/g, '$—')
        });
    }

}