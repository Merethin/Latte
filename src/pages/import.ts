/* pages/import.ts - page code for page=blank/latte=import */

import { canonicalize } from "../../nsdotjs/src/nsdotjs";
import { readConfigRecord, saveConfigRecord } from "../config";
import { getButtonElement, getElement, setText } from "../htmllib";
import { importPageHTML } from "./html/import.html";

function importQuiver() {
    var quiver = readConfigRecord("quiver");

    const tableNodes = getElement("quiver-table").children;
    for(var node of tableNodes) {
        if(node.nodeName == "BUTTON") continue;
        if(node.children[0].nodeName == "TH") continue;

        const checkbox = (node.children[3].children[0] as HTMLInputElement); // checkbox
        if(checkbox.checked) {
            const nation = canonicalize((node.children[0] as HTMLElement).innerText); // nation
            const appid = (node.children[1] as HTMLElement).innerText; // application id

            quiver[nation] = appid;

            // hidden button inserted by plugin to clear the app from its list
            getButtonElement(`lt-action-appremove-${appid}`).click();
        }
    }

    saveConfigRecord("quiver", quiver);
    window.location.reload();
}

function clearPluginApps() {
    const tableNodes = getElement("quiver-table").children;
    for(var node of tableNodes) {
        if(node.nodeName == "BUTTON") continue;
        if(node.children[0].nodeName == "TH") continue;
        const appid = (node.children[1] as HTMLElement).innerText; // application id

        // hidden button inserted by plugin to clear the app from its list
        getButtonElement(`lt-action-appremove-${appid}`).click();
    }

    window.location.reload();
}

/**
 * Injects the import page HTML, adds onclick handlers, and adds an event handler
 * for when plugins inject their own applications into our template.
 */
export function setupImportPage() {
    // Insert main HTML
    let container = document.createElement("div");
    container.innerHTML = importPageHTML;
    getElement("content").appendChild(container);

    // Setup onclick handlers
    getButtonElement("lt-btn-import").onclick = importQuiver;
    getButtonElement("lt-btn-clear").onclick = clearPluginApps;

    // Called by plugins
    document.addEventListener('appsloaded', () => {
        const count = getElement("lt-content-quiver").querySelectorAll("tr").length - 1;
        setText("lt-label-count", `${count} Applications to Load`);

        if(count > 0) {
            getButtonElement("lt-btn-import").removeAttribute("disabled");
            getButtonElement("lt-btn-clear").removeAttribute("disabled");
        }
    });
}