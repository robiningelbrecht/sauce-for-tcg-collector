import {JpnCardsPriceSyncer} from "./Domain/JpnCards/JpnCardsPriceSyncer";
import {TcgExpansionRepository} from "./Domain/TcgCollector/Set/TcgExpansionRepository";
import connection from "./Infrastructure/Database/Connection";

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
            (new JpnCardsPriceSyncer()).syncAndPersistForExpansion(request.payload.expansionCode).catch(e => {
                pushErrorToContent(e.message);
            });
        }
        if (request.cmd === 'FetchJapanesePrices') {
            (new TcgExpansionRepository(connection)).findAll().then(expansions => {
                sendResponse(expansions);
            });

            return true;
        }
    }
);

const pushErrorToContent = (msg) => {
    chrome.tabs.query({active: true, currentWindow: true}, async function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {cmd: 'showToast', payload: {type: 'error', msg: msg}});
    });
}