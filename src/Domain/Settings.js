export class Settings{
    static load = async () => {
        const {settings} = await chrome.storage.sync.get("settings");

        return settings;
    }
}