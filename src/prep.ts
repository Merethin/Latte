import { injectWarning } from "./lib";
import { toggleSwitcherListDisplay, createElementsFromHTML } from "./lib";

const prepPageHTML = 
    `<h1>Latte Prep</h1>

    <fieldset>
    <legend>Switcher List</legend>
    <div class="frdata"><p>Log in to the switcher puppet you want to start at by clicking a link here.</p></div></br>
    <button name="showswlist" id="showswlist" value="1" class="button">Show Switcher List</button>
    <div id="swlist" style="display: none;">
    </div>
    </fieldset>

    <fieldset>
    <legend>Current Nation</legend>
    <div class="frdata"><p>Click "Fetch Current Nation" after logging in to a nation to register it and start the process.</p></div>
    <p>None</p>
    <button name="updatenation" id="updatenation" type="submit" value="1" class="button primary">Fetch Current Nation</button>
    </fieldset>
    
    <fieldset>
    <legend>Status</legend>
    <div class="frdata"><p>Press your "Prep Key" repeatedly or the button below to prepare your switchers.</p></div>
    <p>Status: Waiting for nation</p>
    <button name="prepaction" id="prepaction" type="submit" value="1" class="button primary">Apply to WA</button>
    </fieldset>`

export function setupPrepPage() {
    // Check existing settings
    let userAgent = GM_getValue("userAgent");
    if(userAgent == null) {
        injectWarning("You have not set a User Agent! Latte prepping will not work until you do so <a href='page=blank/latte=settings'>here</a>.");
        return;
    }

    let jp = GM_getValue("jumpPoint");
    if(jp == null) {
        injectWarning("You have not set a jump point! Latte prepping will not work until you do so <a href='page=blank/latte=settings'>here</a>.");
        return;
    }

    let password = GM_getValue("password");
    if(password == null) {
        injectWarning("You have not set a switcher password! Latte prepping will not work until you do so <a href='page=blank/latte=settings'>here</a>.");
        return;
    }

    // Load switchers
    var switchers = new Array();
    let switcherJSON: string | null = GM_getValue("switchers");
    if(switcherJSON != null) {
        switchers = JSON.parse(switcherJSON);
    }

    let switcherHtml = "";
    for(const switcher of switchers) {
        switcherHtml += `<a class="nlink" href="page=blank/latte=main?nation=${switcher}&password=${password}&logging_in=1">${switcher}</a></br>`
    }

    // Insert main HTML
    let container = document.createElement("div");
    container.innerHTML = prepPageHTML;

    let content = document.getElementById("content") as HTMLElement;
    content.appendChild(container);

    // Embed switcher list
    (document.getElementById("swlist") as HTMLElement).append(...createElementsFromHTML(switcherHtml));

    // Set up onclick handlers
    (document.getElementById("showswlist") as HTMLButtonElement).onclick = toggleSwitcherListDisplay;
}