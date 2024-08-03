import {DateTime} from "luxon";
import Container from "./Infrastructure/Container";
import {ShowToastMessageHandler} from "./Domain/ShowToastMessageHandler";
import {Settings} from "./Infrastructure/Settings";
import {SyncExpansionJpnCardPricesMessageHandler} from "./Domain/JpnCards/SyncExpansionJpnCardPricesMessageHandler";

chrome.runtime.onInstalled.addListener(async () => {
    await chrome.storage.sync.set({
        settings: Settings.getDefaults()
    });
});

chrome.webNavigation.onCompleted.addListener(
    async function () {
        /*
        expansions.forEach(expansion => {
            if (DateTime.fromISO(expansion.updatedOn).weekNumber < DateTime.now().weekNumber) {
                Container.getMessageHandler(SyncExpansionJpnCardPricesMessageHandler.getId()).handle({
                    expansionCode: expansion.expansionCode
                }).catch(e => {
                    pushErrorToContent(e.message);
                });
            }
        });*/
    },
    {url: [{hostSuffix: 'tcgcollector.com'}]}
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.handler === ShowToastMessageHandler.getId()) {
        return;
    }

    const messageHandler = Container.getMessageHandler(request.handler);
    messageHandler.handle(request.payload).then(response => {
        sendResponse(response);
        if (messageHandler.getSuccessMessage) {
            pushMessageToContent(messageHandler.getSuccessMessage(request.payload));
        }
    }).catch(e => {
        pushErrorToContent(e.message);
    });

    return true;
});

const pushMessageToContent = (msg) => {
    chrome.tabs.query({active: true, currentWindow: true}, async function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            handler: ShowToastMessageHandler.getId(), payload: {type: 'success', msg: msg}
        });
    });
}

const pushErrorToContent = (msg) => {
    chrome.tabs.query({active: true, currentWindow: true}, async function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            handler: ShowToastMessageHandler.getId(), payload: {type: 'error', msg: msg}
        });
    });
}