export class AppState {
    constructor(state) {
        this.state = state;
    }

    getRouteName = () => {
        return this.state.routeName;
    }

    getTcgRegionId = () => {
        return this.state.tcgRegionId
    }

    getCardIdToCardVariantTypeIdsMap = () => {
        return this.state.cardIdToCardVariantTypeIdsMap;
    }

    getIdToCardVariantTypeDtoMap = () => {
        return this.state.idToCardVariantTypeDtoMap;
    }

    static fromHtml = () => {
        const bodyHtml = document.body.innerHTML;
        const regex = /window.tcgcollector[\s]*=[\s]*{[\s]*appState:(.*),[\s]*}/mi;
        if (!regex.test(bodyHtml)) {
            throw new Error('AppState could not be determined');
        }

        return new AppState(JSON.parse(bodyHtml.match(regex)[1]));
    }
}