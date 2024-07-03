import {PurchasePriceFeature} from "./PurchasePriceFeature";
import {Settings} from "../Settings";
import {NewMenuItemFeature} from "./NewMenuItemFeature";
import {CollectionHistoryFeature} from "./CollectionHistoryFeature";
import {DashboardRearrangementFeature} from "./DashboardRearrangementFeature";
import {PrintBinderPlaceholdersFeature} from "./PrintBinderPlaceholdersFeature";
import {HidePricesFeature} from "./HidePricesFeature";
import {QuickAccessLinksFeature} from "./QuickAccessLinksFeature";
import {Console} from "../Console";

export class FeatureList {
    constructor(featureList) {
        this.featureList = featureList;
    }

    debug = async () => {
        const console = new Console();
        console.printLogo('Loading debug info...');

        const settings = await Settings.load();
        const $cardDetailHtml = await this.loadHtmlNode('https://www.tcgcollector.com/cards/42567');
        const $dashboardHtml = await this.loadHtmlNode('https://www.tcgcollector.com/dashboard');
        const $expansionHtml = await this.loadHtmlNode('https://www.tcgcollector.com/cards/intl/scarlet-and-violet-151');

        const features = [
            new PurchasePriceFeature(settings, $cardDetailHtml),
            new NewMenuItemFeature(settings),
            new CollectionHistoryFeature(settings, $dashboardHtml),
            new QuickAccessLinksFeature(settings, $dashboardHtml),
            new DashboardRearrangementFeature($dashboardHtml),
            new PrintBinderPlaceholdersFeature($expansionHtml),
            new HidePricesFeature(),
        ]

        const list = await Promise.all(
            features.map(async feature => {
                const reasonsForFailure = await feature.getReasonsForFailure();
                return (reasonsForFailure.length === 0 ? '✅' : '❌') + " " + feature.getFeatureDescription()
            })
        );

        console.printList(list);
    }

    async loadHtmlNode(url) {
        const response = await fetch(url);
        const html = await response.text();

        const template = document.createElement('template');
        template.innerHTML = '<div>' + html + '</div>';
        return template.content.children[0];
    }
}