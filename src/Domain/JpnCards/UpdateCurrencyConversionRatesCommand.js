import {KEY_CURRENCY_RATE_JPY_TO_USD} from "../KeyValueRepository";

export class UpdateCurrencyConversionRatesCommand {
    constructor(keyValueRepository, currencyApi) {
        this.keyValueRepository = keyValueRepository;
        this.currencyApi = currencyApi;
    }

    getCommandName = () => {
        return 'UpdateCurrencyConversionRates';
    }

    handle = async (payload) => {
        const rate = await this.keyValueRepository.find(KEY_CURRENCY_RATE_JPY_TO_USD);
        if (rate && (new Date()).setHours(0, 0, 0, 0) === (new Date(rate.updatedOn)).setHours(0, 0, 0, 0)) {
            // Currency rate has already been updated today.
            return;
        }

        const rates = await this.currencyApi.getRatesForJpy();

        await this.keyValueRepository.save(
            KEY_CURRENCY_RATE_JPY_TO_USD,
            rates.jpy.usd,
            new Date(),
        );
    }
}