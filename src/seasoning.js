import {JpnCardsPriceSyncer} from "./Domain/JpnCards/JpnCardsPriceSyncer";
import {JpnCardsApi} from "./Domain/JpnCards/JpnCardsApi";
import {tcgCardPriceRepository, tcgExpansionRepository} from "./Infrastructure/Database/Connection";

chrome.runtime.onInstalled.addListener(async () => {
    // @TODO: Save default settings.
});

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
        if (request.cmd === 'SyncJapanesePrices') {
            (new JpnCardsPriceSyncer(
                new JpnCardsApi(),
                tcgExpansionRepository,
                tcgCardPriceRepository
            )).syncAndPersistForExpansion(request.payload.expansionCode)
                .then(() => {
                    pushMessageToContent(`Prices for expansion "${request.payload.expansionCode}" have been synced`);
                })
                .catch(e => {
                    pushErrorToContent(e.message);
                });
        }
        if (request.cmd === 'FetchJapaneseCardPrices') {
            tcgCardPriceRepository.findByExpansion(request.payload.expansionCode).then(cards => {
                sendResponse(cards);
            }).catch(e => {
                pushErrorToContent(e.message);
            });

            return true;
        }
    }
);

const pushMessageToContent = (msg) => {
    chrome.tabs.query({active: true, currentWindow: true}, async function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {cmd: 'showToast', payload: {type: 'success', msg: msg}});
    });
}

const pushErrorToContent = (msg) => {
    chrome.tabs.query({active: true, currentWindow: true}, async function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {cmd: 'showToast', payload: {type: 'error', msg: msg}});
    });
}