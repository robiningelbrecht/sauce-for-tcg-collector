import Container from "./Infrastructure/Container";
import {SyncJpnCardPricesCommand} from "./Domain/JpnCards/SyncJpnCardPricesCommand";
import {FetchJapaneseCardPricesCommand} from "./Domain/TcgCollector/FetchJapaneseCardPricesCommand";
import {UpdateCurrencyConversionRatesCommand} from "./Domain/JpnCards/UpdateCurrencyConversionRatesCommand";
import {ShowToastCommand} from "./Domain/ShowToastCommand";

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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const command = Container.getCommand(request.cmd);
    command.handle(request.payload).then(response => {
        sendResponse(response);
        if (command.getSuccessMessage) {
            pushMessageToContent(command.getSuccessMessage(request.payload));
        }
    }).catch(e => {
        pushErrorToContent(e.message);
    });

    return true;
});

const pushMessageToContent = (msg) => {
    chrome.tabs.query({active: true, currentWindow: true}, async function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            cmd: ShowToastCommand.getCommandName(), payload: {type: 'success', msg: msg}
        });
    });
}

const pushErrorToContent = (msg) => {
    chrome.tabs.query({active: true, currentWindow: true}, async function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            cmd: ShowToastCommand.getCommandName(), payload: {type: 'error', msg: msg}
        });
    });
}