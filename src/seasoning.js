import {DbConnection} from "./Domain/Database/DbConnection";

chrome.runtime.onInstalled.addListener(async () => {
    // @TODO: Save default settings.
});

chrome.webNavigation.onCompleted.addListener(
    function () {
        chrome.tabs.query({active: true, currentWindow: true}, async function (tabs) {
            // Send a message to the content script in the active tab
            const connection = DbConnection.fromDexieSchema();
            const friends = await connection.listFriends();
            console.log(friends);
            chrome.tabs.sendMessage(tabs[0].id, {message: "myMessage"});
        });
    },
    {url: [{hostSuffix: 'tcgcollector.com'}]}
);