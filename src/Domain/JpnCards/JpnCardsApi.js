export class JpnCardsApi {
    constructor() {
        this.baseUrl = 'https://www.jpn-cards.com/v2';
    }

    async request(path) {
        let response = await fetch(this.baseUrl + path);
        return await response.json();
    }

    getSets = async () => {
        return await this.request('/set/');
    }

    getCardsForSet = async (setCode) => {
        return await this.request(`/card/set_code=${setCode}`);
    }
}