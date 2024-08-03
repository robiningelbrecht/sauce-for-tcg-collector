export class KeyValueRepository {
    constructor(connection) {
        this.connection = connection;
    }

    find = async (key) => {
        return await this.connection.KeyValue.get(key);
    }

    save = async (key, value, updatedOn) => {
        await this.connection.KeyValue.put({
            key: key,
            value: value,
            updatedOn: updatedOn
        });
    }
}

export const KEY_CURRENCY_RATE_JPY_TO_USD = 'currencyRateJpyToUsd';
export const KEY_JPN_PRICES_LAST_AUTO_SYNC = 'jpnPricesLastAutoSync';