/* pages/main.ts - page code for page=blank/latte=main */

import { getElement, setText } from "../htmllib";
import { mainPageHTML } from "./html/main.html";

/**
 * Injects the main page HTML code into the DOM along with version information.
 * The first two parameters are obvious but to make it simpler they're defined
 * as constants in latte.ts and passed here.
 * 
 * @param script The script name.
 * @param author The author of the script.
 * @param version The script's version.
 */
export function setupMainPage(script: string, author: string, version: string) {
    // Insert main HTML
    let container = document.createElement("div");
    container.innerHTML = mainPageHTML;
    getElement("content").appendChild(container);

    // Update version label
    setText("lt-label-version", `Currently running: ${script} version ${version}, by ${author}`);
}
