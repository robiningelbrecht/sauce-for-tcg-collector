import Container from "./Infrastructure/Container";
import {ShowToastMessage} from "./Domain/ShowToastMessage";
import {Settings} from "./Infrastructure/Settings";

chrome.runtime.onInstalled.addListener(async () => {
    await chrome.storage.sync.set({
        settings: Settings.getDefaults()
    });
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
    if (request.cmd === ShowToastMessage.getId()) {
        return;
    }

    const message = Container.getMessage(request.cmd);
    message.handle(request.payload).then(response => {
        sendResponse(response);
        if (message.getSuccessMessage) {
            pushMessageToContent(message.getSuccessMessage(request.payload));
        }
    }).catch(e => {
        pushErrorToContent(e.message);
    });

    return true;
});

const pushMessageToContent = (msg) => {
    chrome.tabs.query({active: true, currentWindow: true}, async function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            cmd: ShowToastMessage.getId(), payload: {type: 'success', msg: msg}
        });
    });
}

const pushErrorToContent = (msg) => {
    chrome.tabs.query({active: true, currentWindow: true}, async function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            cmd: ShowToastMessage.getId(), payload: {type: 'error', msg: msg}
        });
    });
}