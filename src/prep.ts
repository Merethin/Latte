import { ApplyToWorldAssemblyFormData, NSScript } from "../nsdotjs/src/nsdotjs";
import { keybinds, loadKeybind } from "./keybinds";
import { injectWarning, toggleSwitcherListDisplay, createElementsFromHTML } from "./lib";
import Mousetrap from "mousetrap";

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
    <p id="prepnation">None</p>
    <p id="prepcount">Switchers Prepped: 0/0</p>
    </fieldset>
    
    <fieldset>
    <legend>Status</legend>
    <div class="frdata"><p>Press your "Prep Key" repeatedly or the button below to prepare your switchers.</p></div>
    <p id="prepstatus">Status: Waiting to start</p>
    <button name="prepaction" id="prepaction" type="submit" value="1" class="button primary">Load Nation & Start</button>
    </fieldset>`

enum ApplyResult {
    Success,
    MustReapply,
    Failure
};

async function applyAndHandleReapply(
    context: NSScript,
    reapply?: boolean,
): Promise<ApplyResult> {
    let payload: ApplyToWorldAssemblyFormData;
    if (reapply) {
        payload = {
            action: "join_UN",
            resend: "1",
        };
    } else {
        payload = {
            action: "join_UN",
            submit: "1",
        };
    }

    const text = await context.getNsHtmlPage("page=UN_status", payload);
    if (
        text.includes(
            "Your application to join the World Assembly has been received!",
        )
    ) {
        context.statusBubble.success("Applied to World Assembly");
        return ApplyResult.Success;
    } else if (
        text.includes("should have arrived by now!")
    ) {
        context.statusBubble.info("Already applied to World Assembly");
        return ApplyResult.MustReapply;
    }
    context.statusBubble.warn("Failed to apply to World Assembly");
    return ApplyResult.Failure;
}

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
    (document.getElementById("prepcount") as HTMLElement).innerText = `Switchers Prepped: 0/${switchers.length}`;

    // Set up onclick handlers
    (document.getElementById("showswlist") as HTMLButtonElement).onclick = toggleSwitcherListDisplay;
    (document.getElementById("prepaction") as HTMLButtonElement).onclick = () => {Mousetrap.trigger(loadKeybind(keybinds.prep));}
}

enum PrepAction {
    Start,
    Apply,
    Reapply,
    Reauth,
    Move,
    Login,
    Finish,
}

const buttonLabels = [
    "Load Nation & Start",
    "Apply to WA",
    "Reapply",
    "Re-authenticate",
    "Move to Jump Point",
    "Login to Next Nation",
    "Finished",
];

var prepNation: null | string = null;
var prepState: PrepAction = PrepAction.Start;

export async function prep(script: NSScript) {
    const jp: string | null = GM_getValue("jumpPoint");
    if(jp == null) return;

    const password: string | null = GM_getValue("password");
    if(password == null) return;

    var switchers = new Array();
    let switcherJSON: string | null = GM_getValue("switchers");
    if(switcherJSON != null) {
        switchers = JSON.parse(switcherJSON);
    }

    switch(prepState) {
        case PrepAction.Start: {
            const lastNationSeen = await script.get("lastNationSeen") as string | null;
            if(lastNationSeen == null) {
                (document.getElementById("prepstatus") as HTMLElement).innerText = "Status: Please log in to a nation to prep.";
                break;
            }
            if(!switchers.includes(lastNationSeen)) {
                (document.getElementById("prepstatus") as HTMLElement).innerText = "Status: Please log in to one of your switchers to prep.";
                break;
            }

            await script.reAuthenticate();

            prepNation = lastNationSeen;
            (document.getElementById("prepstatus") as HTMLElement).innerText = `Status: Started with nation ${prepNation}`;
            (document.getElementById("prepnation") as HTMLElement).innerText = prepNation;
            (document.getElementById("prepcount") as HTMLElement).innerText = `Switchers Prepped: ${switchers.indexOf(prepNation)}/${switchers.length}`;
            prepState = PrepAction.Apply;
            break;
        }
        case PrepAction.Apply: {
            const result = await applyAndHandleReapply(script, false);
            switch(result) {
                case ApplyResult.Success: {
                    (document.getElementById("prepstatus") as HTMLElement).innerText = "Status: Applied to WA";
                    prepState = PrepAction.Reauth;
                    break;
                }
                case ApplyResult.MustReapply: {
                    (document.getElementById("prepstatus") as HTMLElement).innerText = "Status: Failed to apply to WA";
                    prepState = PrepAction.Reapply;
                    break;
                }
                case ApplyResult.Failure: {
                    (document.getElementById("prepstatus") as HTMLElement).innerText = "Status: Failed to apply to WA";
                    prepState = PrepAction.Reauth;
                    break;
                }
            }
            break;
        }
        case PrepAction.Reapply: {
            const success = await script.applyToWorldAssembly(true);
            if(success) {
                (document.getElementById("prepstatus") as HTMLElement).innerText = "Status: Reapplied to WA";
            }
            else {
                (document.getElementById("prepstatus") as HTMLElement).innerText = "Status: Failed to reapply to WA";
            }
            prepState = PrepAction.Reauth;
            break;
        }
        case PrepAction.Reauth: {
            await script.reAuthenticate();
            (document.getElementById("prepstatus") as HTMLElement).innerText = "Status: Re-authenticated";
            prepState = PrepAction.Move;
            break;
        }
        case PrepAction.Move: {
            const success = await script.moveToRegion(jp);
            if(success) {
                (document.getElementById("prepstatus") as HTMLElement).innerText = `Status: Moved to ${jp}`;
            } else {
                (document.getElementById("prepstatus") as HTMLElement).innerText = `Status: Failed to move to ${jp}`;
            }
            prepState = PrepAction.Login;
            break;
        }
        case PrepAction.Login: {
            const currentIndex = switchers.indexOf(prepNation);
            const nextNationIndex = currentIndex + 1;
            if(nextNationIndex == switchers.length) {
                (document.getElementById("prepstatus") as HTMLElement).innerText = `Status: Finished prepping all switchers`;
                (document.getElementById("prepcount") as HTMLElement).innerText = `Switchers Prepped: ${switchers.length}/${switchers.length}`;
                prepState = PrepAction.Finish;
                break;
            }

            const nation = switchers[nextNationIndex];

            const success = await script.login(nation, password);
            if(success) {
                (document.getElementById("prepstatus") as HTMLElement).innerText = `Status: Logged in to ${nation}`;
                (document.getElementById("prepnation") as HTMLElement).innerText = nation || "None";
                (document.getElementById("prepcount") as HTMLElement).innerText = `Switchers Prepped: ${nextNationIndex}/${switchers.length}`;
                prepNation = nation;
            } else {
                (document.getElementById("prepstatus") as HTMLElement).innerText = `Status: Failed to log in to ${nation}`;
                break;
            }
            prepState = PrepAction.Apply;
            break;
        }
        case PrepAction.Finish: break;
    }

    (document.getElementById("prepaction") as HTMLElement).innerText = buttonLabels[prepState.valueOf()];
}