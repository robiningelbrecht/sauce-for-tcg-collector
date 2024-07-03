import {PurchasePriceFeature} from "./PurchasePriceFeature";
import {Settings} from "../Settings";
import {printListWithLogo} from "../Utils";
import {NewMenuItemFeature} from "./NewMenuItemFeature";
import {CollectionHistoryFeature} from "./CollectionHistoryFeature";
import {DashboardRearrangementFeature} from "./DashboardRearrangementFeature";
import {PrintBinderPlaceholdersFeature} from "./PrintBinderPlaceholdersFeature";
import {HidePricesFeature} from "./HidePricesFeature";

export class FeatureList {
    constructor() {
    }

    debug = async () => {
        const settings = await Settings.load();

        const features = [
            new PurchasePriceFeature(settings),
            new NewMenuItemFeature(settings),
            new CollectionHistoryFeature(settings),
            new DashboardRearrangementFeature(),
            new PrintBinderPlaceholdersFeature(),
            new HidePricesFeature(),
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