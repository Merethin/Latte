import { normalize } from './lib';
import { createElementsFromHTML, toggleSwitcherListDisplay } from './htmllib';
import { setKeybind, getKeybind, keybinds, Keybind } from './keybinds';

const settingsPageHTML = 
    `<h1>Latte Settings</h1>

    <h2><i class="icon-cog-alt"></i> General Settings</h2>
    <div class="divindent">
    <fieldset>
    <legend>User Agent (Main Nation)</legend>
    <div class="frdata"><p>Needed to identify yourself to NationStates when making requests.</p></div></br>
    <input type="text" name="useragent" placeholder="Enter Main Nation..."></input>
    <button name="updateua" id="updateua" value="1" class="button icon approve primary">Set User Agent</button>
    <p id="currentua">Current User Agent: none</p>
    </fieldset>
    <fieldset>
    <legend>Status Bubble</legend>
    <div class="frdata"><p>Fixed-position box to see what commands are currently being executed.</p></div></br>
    <label><input type="checkbox" name="sb" id="sb" value="1"> Show Status Bubble when idle (no commands)</label></br></br>
    <button name="updatesb" id="updatesb" value="1" type="submit" class="button icon approve primary">Update Status Bubble Settings</button>
    </fieldset>
    <fieldset>
    <legend>RO Name</legend>
    <div class="frdata"><p>When appointing yourself as an officer, the office name to use.</p></div></br>
    <input type="text" name="officename" placeholder="Enter RO name..."></input>
    <button name="updatero" id="updatero" value="1" class="button icon approve primary">Set RO Name</button>
    <p id="currentro">Current RO Name: none</p>
    </fieldset>
    <fieldset id="keybind-parent">
    <legend>Keybinds</legend>
    <div class="frdata"><p>Reload the page for the keybind changes to take effect.</p></div>
    </fieldset>
    </div>

    <h2><i class="icon-cog-alt"></i> Prepping Settings</h2>
    <div class="divindent">
    <fieldset>
    <legend>Jump Point</legend>
    <div class="frdata"><p>The region to move switchers to when prepping.</p></div></br>
    <input type="text" name="jumppoint" placeholder="Enter Jump Point..."></input>
    <button name="updatejp" id="updatejp" value="1" class="button icon approve primary">Set Jump Point</button>
    <p id="currentjp">Current Jump Point: none</p>
    </fieldset>
    <fieldset id="password-parent">
    <legend>Switcher Password</legend>
    <div class="frdata"><p>You should have the same password set for all switchers.</p></div></br>
    <input type="password" name="switcherpw" placeholder="Enter Password..."></input>
    <button name="updatepw" id="updatepw" class="button icon approve primary">Set Password</button>
    </fieldset>
    <fieldset>
    <legend>Switcher List</legend>
    <div class="frdata"><p>A list of all your switcher puppets.</p></div></br>
    <textarea name="switcherlist" rows="15" cols="40"></textarea></br>
    <button name="updateswlist" id="updateswlist" value="1" class="button icon approve primary">Update Switcher List</button>
    <button name="showswlist" id="showswlist" value="1" class="button">Show Switcher List</button>
    <div id="swlist" style="display: none;">
    </div>
    </fieldset>
    </div>
    
    <h2><i class="icon-cog-alt"></i> Tagging Settings</h2>
    <div class="divindent">
    <fieldset>
    <legend>World Factbook Entry</legend>
    <div class="frdata"><p>The WFE to tag regions with.</p></div></br>
    <textarea name="wfeinput" rows="15" cols="40"></textarea></br>
    <button name="updatewfe" id="updatewfe" value="1" class="button icon approve primary">Set World Factbook Entry</button>
    </fieldset>
    <fieldset>
    <legend>Embassy List</legend>
    <div class="frdata"><p>The regions to request embassies with.</p></div></br>
    <textarea name="embassyinput" rows="10" cols="30"></textarea></br>
    <button name="updateemb" id="updateemb" value="1" class="button icon approve primary">Set Embassies</button>
    </fieldset>
    <fieldset>
    <legend>Tags to Add</legend>
    <div class="frdata"><p>The tags to add if not present.</p></div></br>
    <textarea name="tagaddinput" rows="10" cols="30"></textarea></br>
    <button name="updatetagadd" id="updatetagadd" value="1" class="button icon approve primary">Update Tags</button>
    </fieldset>
    <fieldset>
    <legend>Tags to Remove</legend>
    <div class="frdata"><p>The tags to remove if present.</p></div></br>
    <textarea name="tagrminput" rows="10" cols="30"></textarea></br>
    <button name="updatetagrm" id="updatetagrm" value="1" class="button icon approve primary">Update Tags</button>
    </fieldset>
    </div>`

function updateUserAgent() {
    let input = document.querySelector(`input[name='useragent']`) as HTMLInputElement;
    if(input.value != "") {
        GM_setValue("userAgent", input.value);
        (document.getElementById("currentua") as HTMLElement).innerText = `Current User Agent: ${input.value}`;
        input.value = "";
    }
}

function updateJumpPoint() {
    let input = document.querySelector(`input[name='jumppoint']`) as HTMLInputElement;
    if(input.value != "") {
        let jp = normalize(input.value);
        GM_setValue("jumpPoint", jp);
        (document.getElementById("currentjp") as HTMLElement).innerText = `Current Jump Point: ${jp}`;
        input.value = "";
    }
}

function updateROName() {
    let input = document.querySelector(`input[name='officename']`) as HTMLInputElement;
    if(input.value != "") {
        let ro = input.value;
        GM_setValue("roName", ro);
        (document.getElementById("currentro") as HTMLElement).innerText = `Current RO Name: ${ro}`;
        input.value = "";
    }
}

function updateSwitcherPassword() {
    let input = document.querySelector(`input[name='switcherpw']`) as HTMLInputElement;
    if(input.value != "") {
        GM_setValue("password", input.value);
        input.value = "";
        let passwordStatus = document.getElementById("pwstatus") as HTMLElement;
        passwordStatus.innerText = "Password successfully updated!";
        passwordStatus.classList.remove("rejected");
    }
}

function updateSwitcherList() {
    let input = document.querySelector("textarea[name='switcherlist']") as HTMLTextAreaElement;
    if(input.value != "") {
        let nations = input.value.split("\n");
        let switchers = nations.map(normalize);
        GM_setValue("switchers", JSON.stringify(switchers));
        input.value = "";

        let switcherHtml = "";
        const password = GM_getValue("password");
        for(const switcher of switchers) {
            if(password == null) switcherHtml += `<a class="nlink" href="nation=${switcher}">${switcher}</a></br>`
            else switcherHtml += `<a class="nlink" href="page=un?nation=${switcher}&password=${password}&logging_in=1">${switcher}</a></br>`
        }

        (document.getElementById("swlist") as HTMLElement).style.display = "none";
        (document.getElementById("swlist") as HTMLElement).innerHTML = switcherHtml;
        (document.getElementById("showswlist") as HTMLElement).innerText = "Show Switcher List";
    }
}

function updateStatusBubble() {
    let input = document.querySelector("input[name='sb']") as HTMLInputElement;
    let showStatusBubble = input.checked;
    GM_setValue("showStatusBubble", showStatusBubble);

    window.location.reload();
}

function updateKeybind(keybind: Keybind) {
    let input = document.querySelector(`input[name='key${keybind.key}']`) as HTMLInputElement;
    if(input.value != "") {
        setKeybind(keybind, input.value);
        input.placeholder = `Current: ${input.value}`
        if(input.value == keybind.defaultValue) {
            (document.getElementById(`resetkey${keybind.key}`) as HTMLButtonElement).setAttribute("disabled", "true");
        } else {
            (document.getElementById(`resetkey${keybind.key}`) as HTMLButtonElement).removeAttribute("disabled");
        }
        input.value = "";
    }
}

function resetKeybind(keybind: Keybind) {
    let input = document.querySelector(`input[name='key${keybind.key}']`) as HTMLInputElement;
    input.value = "";

    setKeybind(keybind, keybind.defaultValue);

    input.placeholder = `Current: ${keybind.defaultValue}`
    let resetkey = document.getElementById(`resetkey${keybind.key}`) as HTMLButtonElement;
    resetkey.setAttribute("disabled", "true");
}

export function setupSettingsPage() {
    // Load existing settings
    const userAgentName = GM_getValue("userAgent") || "none";
    const jumpPointName = GM_getValue("jumpPoint") || "none";
    const roName = GM_getValue("roName") || "none";

    var switchers: Array<string>;
    const switcherJSON: string | null = GM_getValue("switchers");
    if(switcherJSON != null) {
        switchers = JSON.parse(switcherJSON);
    } else {
        switchers = [];
    }

    const password = GM_getValue("password");
    if(password != null) {
        var passwordStatusHtml = "<p id='pwstatus'>There is a password currently registered.</p>";
    } else {
        var passwordStatusHtml = "<p class='rejected' id='pwstatus'>No password set!</p>";
    }

    // Load keybind settings and build the keybind HTML
    let keybindHtml = "";
    Object.entries(keybinds).forEach(([_, keybind]) => {
        let currentValue = getKeybind(keybind);

        if(currentValue == keybind.defaultValue) var disabled = "disabled='true'";
        else var disabled = "";

        keybindHtml += `<p>${keybind.label}</p>
        <input type="text" name="key${keybind.key}" placeholder="Current: ${currentValue}"></input>
        <button name="updatekey${keybind.key}" id="updatekey${keybind.key}" value="1" class="button icon approve primary">Update</button>
        <button name="resetkey${keybind.key}" id="resetkey${keybind.key}" value="1" class="button icon remove danger" ${disabled}>Reset</button>`
    });

    let switcherHtml = "";
    for(const switcher of switchers) {
        if(password == null) switcherHtml += `<a class="nlink" href="nation=${switcher}">${switcher}</a></br>`
        else switcherHtml += `<a class="nlink" href="page=un?nation=${switcher}&password=${password}&logging_in=1">${switcher}</a></br>`
    }

    // Insert main HTML
    let container = document.createElement("div");
    container.innerHTML = settingsPageHTML;
    (document.getElementById("content") as HTMLElement).appendChild(container);

    // Insert loaded settings
    (document.getElementById("currentua") as HTMLElement).innerText = `Current User Agent: ${userAgentName}`;
    (document.getElementById("currentjp") as HTMLElement).innerText = `Current Jump Point: ${jumpPointName}`;
    (document.getElementById("currentro") as HTMLElement).innerText = `Current RO Name: ${roName}`;
    (document.getElementById("keybind-parent") as HTMLElement).append(...createElementsFromHTML(keybindHtml));
    (document.getElementById("password-parent") as HTMLElement).append(...createElementsFromHTML(passwordStatusHtml));
    (document.getElementById("swlist") as HTMLElement).innerHTML = switcherHtml;

    // Set up onclick handlers
    (document.getElementById("updateua") as HTMLButtonElement).onclick = updateUserAgent;
    (document.getElementById("updatejp") as HTMLButtonElement).onclick = updateJumpPoint;
    (document.getElementById("updatepw") as HTMLButtonElement).onclick = updateSwitcherPassword;
    (document.getElementById("updatero") as HTMLButtonElement).onclick = updateROName;
    (document.getElementById("updateswlist") as HTMLButtonElement).onclick = updateSwitcherList;
    (document.getElementById("updatesb") as HTMLButtonElement).onclick = updateStatusBubble;
    (document.getElementById("showswlist") as HTMLButtonElement).onclick = toggleSwitcherListDisplay;

    Object.entries(keybinds).forEach(([_, keybind]) => {
        (document.getElementById(`updatekey${keybind.key}`) as HTMLButtonElement).onclick = () => {updateKeybind(keybind);};
        (document.getElementById(`resetkey${keybind.key}`) as HTMLButtonElement).onclick = () => {resetKeybind(keybind);};
    });

    // Load status bubble checkbox
    const showStatusBubble = GM_getValue("showStatusBubble", true);
    (document.getElementById("sb") as HTMLInputElement).checked = showStatusBubble;
}