import {contains} from "../Infrastructure/Utils/Functions";

export class HidePricesFeature {
    constructor(settings) {
        this.settings = settings;
    }

    getId = () => {
        return 'hide-prices-feature';
    };

    needsToBeApplied = (appState) => {
        return this.settings.hidePrices();
    }

    apply = async () => {
        contains('*', /\$([\d]+\.?\d*)/g).forEach(element => {
            element.innerHTML = element.innerHTML.replace(/\$([\d]+\.?\d*)/g, '$—')
        });
    }

}