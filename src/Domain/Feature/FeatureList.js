import {PurchasePriceFeature} from "./PurchasePriceFeature";
import {Settings} from "../Settings";
import {printListWithLogo} from "../Utils";

export class FeatureList{
    constructor() {
    }

    debug = async () => {
        const settings = await Settings.load();

        const features = [
            new PurchasePriceFeature(settings)
        ]

        const list = await Promise.all(
            features.map(async feature => {
                const reasonsForFailure = await feature.getReasonsForFailure();
                return (reasonsForFailure.length === 0 ? '✅' : '❌') + " " + feature.getFeatureDescription()
            })
        );

        printListWithLogo(list);
    }
}