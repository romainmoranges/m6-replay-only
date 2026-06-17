chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

const M6_BASE_URL = 'https://www.m6.fr';

console.log('M6_BASE_URL', M6_BASE_URL)

async function clickListenerChangeAppState(tab) {
    console.log('tab.url', tab.url)
    if (tab.url.startsWith(M6_BASE_URL)) {
        // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        // Next state will always be the opposite
        const nextState = prevState === 'ON' ? 'OFF' : 'ON';

        // Set the action badge to the next state
        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        });
        if (nextState === "ON") {
            // Insert the CSS file when the user turns the extension on
            await chrome.scripting.insertCSS({
                files: ["hide-m6-sections.css"],
                target: { tabId: tab.id },
            });
        } else if (nextState === "OFF") {
            // Remove the CSS file when the user turns the extension off
            await chrome.scripting.removeCSS({
                files: ["hide-m6-sections.css"],
                target: { tabId: tab.id },
            });
        }
    }

}

chrome.action.onClicked.addListener(clickListenerChangeAppState);