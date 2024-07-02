import {PurchasePriceFeature} from "./PurchasePriceFeature";
import {Console} from "../Console";
import {Settings} from "../Settings";

export const logFeatureList = async () => {
    const settings = await Settings.load();
    const reasonsForFailure = await (new PurchasePriceFeature(settings)).getReasonsForFailure();

    const list = [
        "✅ Purchase prices for cards",
        "✅ New menu item",
        "❌ Collection history",
        "❌ Dashboard re-arrangement",
        "❌ Print placeholders for binders",
        "✅ Hide prices",
    ];
    (new Console()).printListWithLogo(list);
}