import {TcgSetRepository} from "./Domain/TcgCollector/TcgSetRepository";
import connection from "./Infrastructure/Database/Connection";

chrome.runtime.onInstalled.addListener(async () => {
    // @TODO: Save default settings.
});

chrome.webNavigation.onCompleted.addListener(
    function () {
        chrome.tabs.query({active: true, currentWindow: true}, async function (tabs) {
            // Send a message to the content script in the active tab
            const friends = await (new TcgSetRepository(connection)).findAll();
            console.log(friends);
            chrome.tabs.sendMessage(tabs[0].id, {message: "myMessage"});
        });
    },
    {url: [{hostSuffix: 'tcgcollector.com'}]}
);