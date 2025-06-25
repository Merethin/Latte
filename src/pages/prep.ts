import Mousetrap from "mousetrap";
import { NSScript } from "../../nsdotjs/src/nsdotjs";
import { keybinds, loadKeybind } from "../keybinds";
import { readConfigList, readConfigValue } from "../config";
import { applyAndHandleReapply, ApplyResult } from "../lib";
import { injectWarning, 
    toggleElementDisplay, 
    createElementsFromHTML, 
    getElement, setText, getButtonElement } from "../htmllib";

import { prepPageHTML } from "./html/prep.html";

const switchers = readConfigList("switchers");

export function setupPrepPage() {
    // Check existing settings
    let userAgent = readConfigValue<string>("userAgent");
    if(userAgent == null) {
        injectWarning("You have not set a User Agent! Latte prepping will not work until you do so <a href='page=blank/latte=settings'>here</a>.");
        return;
    }

    let jp = readConfigValue<string>("jumpPoint");
    if(jp == null) {
        injectWarning("You have not set a jump point! Latte prepping will not work until you do so <a href='page=blank/latte=settings'>here</a>.");
        return;
    }

    let password = readConfigValue<string>("password");
    if(password == null) {
        injectWarning("You have not set a switcher password! Latte prepping will not work until you do so <a href='page=blank/latte=settings'>here</a>.");
        return;
    }

    // Load switchers
    let switcherHtml = "";
    for(const switcher of switchers) {
        switcherHtml += `<a class="nlink" href="page=blank/latte=main?nation=${switcher}&password=${password}&logging_in=1">${switcher}</a></br>`
    }

    // Insert main HTML
    let container = document.createElement("div");
    container.innerHTML = prepPageHTML;
    getElement("content").appendChild(container);

    // Embed switcher list
    getElement("lt-content-switchers").append(...createElementsFromHTML(switcherHtml));
    setText("lt-status-count", `Switchers Prepped: 0/${switchers.length}`);

    // Set up onclick handlers
    getElement("lt-btn-prep").onclick = () => {
        Mousetrap.trigger(loadKeybind(keybinds.prep));
    };

    getElement("lt-toggle-switchers").onclick = () => {
        const switcherDisplay = getElement("lt-content-switchers");
        const toggle = getButtonElement("lt-toggle-switchers");
        toggleElementDisplay(switcherDisplay, toggle, "Switcher List");
    };
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

function updateStatus(status: string) {
    setText("lt-status-prep", `Status: ${status}`);
}

function updateSwitcherCount(count: number) {
    setText("lt-status-count", `Switchers Prepped: ${count}/${switchers.length}`);
}

export async function prep(script: NSScript) {
    const jp = readConfigValue<string>("jumpPoint");
    const password = readConfigValue<string>("password");
    if(jp == null || password == null) return;

    switch(prepState) {
        case PrepAction.Start: {
            const lastNationSeen = await script.get("lastNationSeen") as string | null;
            if(lastNationSeen == null) {
                updateStatus("Please log in to a nation to prep.");
                break;
            }
            if(!switchers.includes(lastNationSeen)) {
                updateStatus("Please log in to one of your switchers to prep.");
                break;
            }

            await script.reAuthenticate();

            prepNation = lastNationSeen;
            updateStatus(`Started with nation ${prepNation}`);
            updateSwitcherCount(switchers.indexOf(prepNation));
            setText("lt-status-nation", prepNation);
            prepState = PrepAction.Apply;
            break;
        }
        case PrepAction.Apply: {
            const result = await applyAndHandleReapply(script, false);
            switch(result) {
                case ApplyResult.Success: {
                    updateStatus("Applied to WA");
                    prepState = PrepAction.Reauth;
                    break;
                }
                case ApplyResult.MustReapply: {
                    updateStatus("Failed to apply to WA");
                    prepState = PrepAction.Reapply;
                    break;
                }
                case ApplyResult.Failure: {
                    updateStatus("Failed to apply to WA");
                    prepState = PrepAction.Reauth;
                    break;
                }
            }
            break;
        }
        case PrepAction.Reapply: {
            const success = await script.applyToWorldAssembly(true);
            if(success)
                updateStatus("Reapplied to WA");
            else
                updateStatus("Failed to reapply to WA");
            prepState = PrepAction.Reauth;
            break;
        }
        case PrepAction.Reauth: {
            await script.reAuthenticate();
            updateStatus("Re-authenticated");
            prepState = PrepAction.Move;
            break;
        }
        case PrepAction.Move: {
            const success = await script.moveToRegion(jp);
            if(success)
                updateStatus(`Moved to ${jp}`);
            else 
                updateStatus(`Failed to move to ${jp}`);
            prepState = PrepAction.Login;
            break;
        }
        case PrepAction.Login: {
            const currentIndex = switchers.indexOf(prepNation as string);
            const nextNationIndex = currentIndex + 1;
            if(nextNationIndex == switchers.length) {
                updateStatus(`Finished prepping all switchers`);
                updateSwitcherCount(switchers.length);
                prepState = PrepAction.Finish;
                break;
            }

            const nation = switchers[nextNationIndex];

            const success = await script.login(nation, password);
            if(success) {
                updateStatus(`Logged in to ${nation}`);
                updateSwitcherCount(nextNationIndex);
                setText("prepnation", nation);
                prepNation = nation;
            } else {
                updateStatus(`Failed to log in to ${nation}`);
                break;
            }
            prepState = PrepAction.Apply;
            break;
        }
        case PrepAction.Finish: break;
    }

    setText("lt-btn-prep", buttonLabels[prepState.valueOf()]);
}