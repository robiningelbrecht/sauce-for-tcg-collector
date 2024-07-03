import {PrintBinderPlaceholdersFeature} from "./Feature/PrintBinderPlaceholdersFeature";

export class Page {
    constructor(currentLocation) {
        this.currentLocation = currentLocation;
    }

    needsCollectionHistoryFeature = () => {
        return this.currentLocation.pathname.includes('/dashboard');
    }

    needsDashboardRearrangementFeature = () => {
        return this.currentLocation.pathname.includes('/dashboard');
    }

    needsQuickAccessLinksFeature = () => {
        return this.currentLocation.pathname.includes('/dashboard');
    }

    needsPurchasePriceFeature = () => {
        const regex = /cards\/[\d]+\/[\S]+/mi;
        return regex.test(this.currentLocation.pathname);
    }

    needsPrintBinderPlaceholdersFeature = () => {
        if (this.currentLocation.pathname === '/cards') {
            return true;
        }
        if (this.currentLocation.pathname === '/cards/intl') {
            return true;
        }
        if (this.currentLocation.pathname === '/cards/jp') {
            return true;
        }
        return this.currentLocation.pathname.includes('/cards/jp/') || this.currentLocation.pathname.includes('/cards/intl/');
    }
}