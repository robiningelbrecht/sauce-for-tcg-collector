import {Settings} from "./Infrastructure/Settings";

chrome.runtime.onInstalled.addListener(async () => {
    await chrome.storage.sync.set({
        settings: Settings.getDefaults()
    });
});