/* pages/quiver.ts - page code for page=blank/latte=quiver */

import { prettify } from "../../nsdotjs/src/nsdotjs";
import { readConfigRecord, saveConfigRecord } from "../config";
import { createTableElementsFromHTML, getButtonElement, getElement, setText } from "../htmllib";
import { quiverPageHTML } from "./html/quiver.html";

function clearQuiver() {
    var quiver: Record<string, string> = {};
    saveConfigRecord("quiver", quiver);

    window.location.reload();
}

/**
 * Loads the current quiver and inserts it alongside the HTML
 * into the DOM, as well as setting up event handlers.
 */
export function setupQuiverPage() {
    var quiver = readConfigRecord("quiver");

    // Build quiver HTML
    let quiverHtml = "";
    Object.entries(quiver).forEach(([nation, appid]) => {
        quiverHtml += `<tr><td class="bigleft">${prettify(nation)}</td><td><b>${appid}</b></td></tr>`
    });

    // Insert main HTML
    let container = document.createElement("div");
    container.innerHTML = quiverPageHTML;
    getElement("content").appendChild(container);
    getElement("lt-content-quiver").append(...createTableElementsFromHTML(quiverHtml));

    // Setup onclick handlers
    getButtonElement("lt-btn-clear").onclick = clearQuiver;

    var count = Object.keys(quiver).length;
    if(count == 0)
        getButtonElement("lt-btn-clear").setAttribute("disabled", "true");
    else
        setText("lt-label-count", `${count} Applications Loaded`);
}