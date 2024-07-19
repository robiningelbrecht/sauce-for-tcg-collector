import {KEY_CURRENCY_RATE_JPY_TO_USD} from "./Domain/KeyValueRepository";
import Container from "./Infrastructure/Container";

chrome.runtime.onInstalled.addListener(async () => {
    // @TODO: Save default settings.
});

// @TODO: Auto refresh price after a week.
/*chrome.webNavigation.onCompleted.addListener(
    function () {
        chrome.tabs.query({active: true, currentWindow: true}, async function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "myMessage"});
        });
    },
    {url: [{hostSuffix: 'tcgcollector.com'}]}
);*/

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.cmd === Container.Commands.SyncJapanesePrices.getCommandName()) {
            Container.Commands.SyncJapanesePrices.handle(request.payload)
                .then(() => {
                    pushMessageToContent(`Prices for expansion "${request.payload.expansionCode}" have been synced`);
                })
                .catch(e => {
                    pushErrorToContent(`Could not sync prices: ${e.message}`);
                });
        }
        if (request.cmd === Container.Commands.FetchJapaneseCardPrices.getCommandName()) {
            Container.Commands.FetchJapaneseCardPrices.handle(request.payload).then(cards => {
                sendResponse(cards);
            }).catch(e => {
                pushErrorToContent(`Could not fetch prices: ${e.message}`);
            });

            return true;
        }

        if (request.cmd === Container.Commands.UpdateCurrencyConversionRates) {
            Container.KeyValueRepository.find(KEY_CURRENCY_RATE_JPY_TO_USD).then(rate => {
                if (rate && (new Date()).setHours(0, 0, 0, 0) === (new Date(rate.updatedOn)).setHours(0, 0, 0, 0)) {
                    // Currency rate has already been updated today.
                    sendResponse({});
                }

                Container.CurrencyApi.getRatesForJpy().then(rates => {
                    Container.KeyValueRepository.save(
                        KEY_CURRENCY_RATE_JPY_TO_USD,
                        rates.jpy.usd,
                        new Date(),
                    );

                    sendResponse({});
                });
            }).catch(e => {
                pushErrorToContent(`Could update currency conversion rates: ${e.message}`);
            });

            return true;
        }
    }
);

const pushMessageToContent = (msg) => {
    chrome.tabs.query({active: true, currentWindow: true}, async function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {cmd: Container.Commands.ShowToast, payload: {type: 'success', msg: msg}});
    });
}

const pushErrorToContent = (msg) => {
    chrome.tabs.query({active: true, currentWindow: true}, async function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {cmd: Container.Commands.ShowToast, payload: {type: 'error', msg: msg}});
    });
}