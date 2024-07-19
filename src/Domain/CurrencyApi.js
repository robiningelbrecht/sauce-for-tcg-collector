export class CurrencyApi {
    constructor() {
        this.baseUrl = 'https://latest.currency-api.pages.dev/v1';
    }

    async request(path) {
        let response = await fetch(this.baseUrl + path);
        return await response.json();
    }

    getRatesForJpy = async () => {
        return await this.request('/currencies/jpy.json');
    }
}