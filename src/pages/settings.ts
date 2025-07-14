/* pages/settings.ts - page code for page=blank/latte=settings */

import { canonicalize, prettify } from '../../nsdotjs/src/nsdotjs';
import { encodeFileAsURL } from '../lib';
import { createElementsFromHTML, getButtonElement, getElement, getInputElement, setText, toggleElementDisplay } from '../htmllib';
import { setKeybind, getKeybind, keybinds, Keybind } from '../keybinds';
import { getConfigValue, readConfigList, readConfigValue, saveConfigList, setConfigValue } from '../config';
import { settingsPageHTML } from './html/settings.html';

function updateUserAgent() {
    let input = getInputElement("lt-input-useragent");
    if(input.value != "") {
        setConfigValue("userAgent", input.value);
        setText("lt-label-useragent", `Current User Agent: ${input.value}`);
        input.value = "";
    }
}

function updateJumpPoint() {
    let input = getInputElement("lt-input-jumppoint");
    if(input.value != "") {
        let jp = canonicalize(input.value);
        setConfigValue("jumpPoint", jp);
        setText("lt-label-jumppoint", `Current Jump Point: ${prettify(jp)}`);
        input.value = "";
    }
}

function updateROName() {
    let input = getInputElement("lt-input-roname");
    if(input.value != "") {
        let ro = input.value;
        setConfigValue("roName", ro);
        setText("lt-label-roname", `Current RO Name: ${ro}`);
        input.value = "";
    }
}

function updateSwitcherPassword() {
    let input = getInputElement("lt-input-password");
    if(input.value != "") {
        setConfigValue("password", input.value);
        input.value = "";
        let passwordStatus = getElement("lt-status-password");
        passwordStatus.innerText = "Password successfully updated!";
        passwordStatus.classList.remove("rejected");
    }
}

function updateSwitcherList() {
    let input = getInputElement("lt-input-switchers");
    if(input.value != "") {
        let nations = input.value.split("\n");
        let switchers = nations.map(canonicalize);
        saveConfigList("switchers", switchers);
        input.value = "";

        let switcherHtml = "";
        const password = readConfigValue<string>("password");
        for(const switcher of switchers) {
            if(password == null) 
                switcherHtml += `<a class="nlink" href="nation=${switcher}">${switcher}</a></br>`;
            else {
                const link = `page=blank/latte=main?nation=${switcher}&password=${password}&logging_in=1`;
                switcherHtml += `<a class="nlink" href="${link}">${switcher}</a></br>`;
            }
        }

        getElement("lt-content-switchers").style.display = "none";
        getElement("lt-content-switchers").innerHTML = switcherHtml;
        setText("lt-toggle-switchers", "Show Switcher List");
    }
}

function updateWFE() {
    let input = getInputElement("lt-input-wfe");
    let wfe = input.value;
    setConfigValue("wfe", wfe);
    setText("lt-content-wfe", wfe);
    input.value = "";
}

function updateEmbassies() {
    let input = getInputElement("lt-input-embassy");
    let embassylist = input.value.split("\n").map(canonicalize);
    saveConfigList("embassies", embassylist);
    input.value = "";

    if(embassylist.length > 0)
        setText("lt-label-embassy", `Current Embassies: ${embassylist.map(prettify).join(", ")}`);
    else
        setText("lt-label-embassy", "Current Embassies: none");
}

function updateAddTags() {
    let input = getInputElement("lt-input-tagadd");
    let tagaddlist = input.value.split("\n").map(canonicalize);
    saveConfigList("tagsToAdd", tagaddlist);
    input.value = "";
    
    if(tagaddlist.length > 0)
        setText("lt-label-tagadd", `Current Tags to Add: ${tagaddlist.map(prettify).join(", ")}`);
    else
        setText("lt-label-tagadd", "Current Tags to Add: none");
}

function updateRemoveTags() {
    let input = getInputElement("lt-input-tagremove");
    let tagremovelist = input.value.split("\n").map(canonicalize);
    saveConfigList("tagsToRemove", tagremovelist);
    input.value = "";
    
    if(tagremovelist.length > 0)
        setText("lt-label-tagremove", `Current Tags to Remove: ${tagremovelist.map(prettify).join(", ")}`);
    else
        setText("lt-label-tagremove", "Current Tags to Remove: none");
}

function updateBanner() {
    let input = document.getElementById("lt-input-banner") as HTMLInputElement;
    encodeFileAsURL(input, "banner", (url) => {
        (getElement("lt-content-banner") as HTMLImageElement).src = url as string;
    });
}

function updateFlag() {
    let input = getInputElement("lt-input-flag");
    encodeFileAsURL(input, "flag", (url) => {
        (getElement("lt-content-flag") as HTMLImageElement).src = url as string;
    });
}

function updateStatusBubble() {
    let input = getInputElement("lt-input-statusbubble");
    let showStatusBubble = input.checked;
    setConfigValue("showStatusBubble", showStatusBubble);

    window.location.reload();
}

function updateDetagMode() {
    let input = getInputElement("lt-input-detagmode");
    let detagMode = input.checked;
    setConfigValue("detagMode", detagMode);
}

function updateKeybind(keybind: Keybind) {
    let input = getInputElement(`lt-key-${keybind.key}`);
    if(input.value != "") {
        setKeybind(keybind, input.value);
        input.placeholder = `Current: ${input.value}`

        if(input.value == keybind.defaultValue)
            getButtonElement(`lt-resetkey-${keybind.key}`).setAttribute("disabled", "true");
        else
            getButtonElement(`lt-resetkey-${keybind.key}`).removeAttribute("disabled");

        input.value = "";
    }
}

function resetKeybind(keybind: Keybind) {
    let input = getInputElement(`lt-key-${keybind.key}`);
    input.value = "";

    setKeybind(keybind, keybind.defaultValue);

    input.placeholder = `Current: ${keybind.defaultValue}`
    getButtonElement(`lt-resetkey-${keybind.key}`).setAttribute("disabled", "true");
}

/**
 * Loads existing settings, injects the settings page HTML into the DOM
 * and sets up event handlers.
 */
export function setupSettingsPage() {
    // Load existing settings
    const userAgentName = getConfigValue<string>("userAgent", "none");
    const jumpPointName = getConfigValue<string>("jumpPoint", "none");
    const roName = getConfigValue<string>("roName", "none");

    // Prepping settings
    var switchers = readConfigList("switchers");

    const password = readConfigValue<string>("password");
    if(password != null) {
        var passwordStatusHtml = "<p id='lt-status-password'>There is a password currently registered.</p>";
    } else {
        var passwordStatusHtml = "<p class='rejected' id='lt-status-password'>No password set!</p>";
    }

    // Tagging settings
    const wfe = getConfigValue("wfe", "");
    const embassies = readConfigList("embassies");
    const tagsToAdd = readConfigList("tagsToAdd");
    const tagsToRemove = readConfigList("tagsToRemove");
    const banner = readConfigValue<string>("banner");
    const flag = readConfigValue<string>("flag");

    // Load keybind settings and build the keybind HTML
    let keybindHtml = "";
    Object.entries(keybinds).forEach(([_, keybind]) => {
        let currentValue = getKeybind(keybind);

        if(currentValue == keybind.defaultValue) var disabled = "disabled='true'";
        else var disabled = "";

        keybindHtml += `<p>${keybind.label}</p>
        <input type="text" id="lt-key-${keybind.key}" placeholder="Current: ${currentValue}"></input>
        <button id="lt-updatekey-${keybind.key}" class="button icon approve primary">Update</button>
        <button id="lt-resetkey-${keybind.key}" class="button icon remove danger" ${disabled}>Reset</button>`
    });

    let switcherHtml = "";
    for(const switcher of switchers) {
        if(password == null) 
            switcherHtml += `<a class="nlink" href="nation=${switcher}">${switcher}</a></br>`
        else {
            const link = `page=blank/latte=main?nation=${switcher}&password=${password}&logging_in=1`;
            switcherHtml += `<a class="nlink" href="${link}">${switcher}</a></br>`;
        }
    }

    // Insert main HTML
    let container = document.createElement("div");
    container.innerHTML = settingsPageHTML;
    getElement("content").appendChild(container);

    // Insert loaded settings
    setText("lt-label-useragent", `Current User Agent: ${userAgentName}`);
    setText("lt-label-jumppoint", `Current Jump Point: ${prettify(jumpPointName)}`);
    setText("lt-label-roname", `Current RO Name: ${roName}`);
    getElement("lt-content-keybinds").append(...createElementsFromHTML(keybindHtml));
    getElement("lt-content-password").append(...createElementsFromHTML(passwordStatusHtml));
    getElement("lt-content-switchers").innerHTML = switcherHtml;
    setText("lt-content-wfe", wfe);

    if(embassies.length > 0)
        setText("lt-label-embassy", `Current Embassies: ${embassies.map(prettify).join(", ")}`);

    if(tagsToAdd.length > 0)
        setText("lt-label-tagadd", `Current Tags to Add: ${tagsToAdd.map(prettify).join(", ")}`);

    if(tagsToRemove.length > 0)
        setText("lt-label-tagremove", `Current Tags to Remove: ${tagsToRemove.map(prettify).join(", ")}`);

    if(banner)
        (getElement("lt-content-banner") as HTMLImageElement).src = banner;

    if(flag)
        (getElement("lt-content-flag") as HTMLImageElement).src = flag;

    // Set up onclick handlers
    getButtonElement("lt-btn-useragent").onclick = updateUserAgent;
    getButtonElement("lt-btn-jumppoint").onclick = updateJumpPoint;
    getButtonElement("lt-btn-password").onclick = updateSwitcherPassword;
    getButtonElement("lt-btn-roname").onclick = updateROName;
    getButtonElement("lt-btn-switchers").onclick = updateSwitcherList;
    getButtonElement("lt-btn-statusbubble").onclick = updateStatusBubble;
    getButtonElement("lt-btn-detagmode").onclick = updateDetagMode;
    getButtonElement("lt-btn-wfe").onclick = updateWFE;
    getButtonElement("lt-btn-embassy").onclick = updateEmbassies;
    getButtonElement("lt-btn-tagadd").onclick = updateAddTags;
    getButtonElement("lt-btn-tagremove").onclick = updateRemoveTags;

    // Display toggles
    getButtonElement("lt-toggle-switchers").onclick = () => {
        const switcherDisplay = document.getElementById("lt-content-switchers") as HTMLElement;
        const toggle = document.getElementById("lt-toggle-switchers") as HTMLButtonElement;
        toggleElementDisplay(switcherDisplay, toggle, "Switcher List");
    }
    getButtonElement("lt-toggle-wfe").onclick = () => {
        const switcherDisplay = document.getElementById("lt-content-wfe") as HTMLElement;
        const toggle = document.getElementById("lt-toggle-wfe") as HTMLButtonElement;
        toggleElementDisplay(switcherDisplay, toggle, "World Factbook Entry");
    }

    // Set up upload handlers
    getButtonElement("lt-input-banner").onchange = updateBanner;
    getButtonElement("lt-input-flag").onchange = updateFlag;

    Object.entries(keybinds).forEach(([_, keybind]) => {
        getButtonElement(`lt-updatekey-${keybind.key}`).onclick = () => {updateKeybind(keybind);};
        getButtonElement(`lt-resetkey-${keybind.key}`).onclick = () => {resetKeybind(keybind);};
    });

    // Load status bubble checkbox
    const showStatusBubble = getConfigValue<boolean>("showStatusBubble", true);
    getInputElement("lt-input-statusbubble").checked = showStatusBubble;

    // Load detag mode checkbox
    const detagMode = getConfigValue<boolean>("detagMode", false);
    getInputElement("lt-input-detagmode").checked = detagMode;
}