import {DateTime} from "luxon";
import Container from "./Infrastructure/Container";
import {ShowToastMessageHandler} from "./Domain/ShowToastMessageHandler";
import {Settings} from "./Infrastructure/Settings";
import {SyncExpansionJpnCardPricesMessageHandler} from "./Domain/JpnCards/SyncExpansionJpnCardPricesMessageHandler";
import {KEY_JPN_PRICES_LAST_AUTO_SYNC} from "./Domain/KeyValueRepository";

chrome.runtime.onInstalled.addListener(async () => {
    await chrome.storage.sync.set({
        settings: Settings.getDefaults()
    });
});

chrome.webNavigation.onCompleted.addListener(
    async function () {
        const today = DateTime.now();
        const keyValueRepository = Container.KeyValueRepository;
        const jpnPricesLastAutoUpdate = keyValueRepository.find(KEY_JPN_PRICES_LAST_AUTO_SYNC)?.value || today.toISO();

        if (DateTime.fromISO(jpnPricesLastAutoUpdate).weekNumber === today.weekNumber) {
            // Auto update ran already this week.
            return;
        }

        const expansionIds = await Container.TcgCardPriceRepository.findUniqueExpansionIds();
        expansionIds.forEach(expansionId => {
            Container.getMessageHandler(SyncExpansionJpnCardPricesMessageHandler.getId()).handle({
                expansionId: expansionId
            }).catch(e => {
                pushErrorToContent(e.message);
            });
        });

        await keyValueRepository.save(
            KEY_JPN_PRICES_LAST_AUTO_SYNC,
            today.toISO(),
            today.toISO(),
        );
        pushMessageToContent('Japanese prices auto updated 🥳');
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