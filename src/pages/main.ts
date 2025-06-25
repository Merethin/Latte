import { getElement, setText } from "../htmllib";
import { mainPageHTML } from "./html/main.html";

export function setupMainPage(script: string, author: string, version: string) {
    // Insert main HTML
    let container = document.createElement("div");
    container.innerHTML = mainPageHTML;
    getElement("content").appendChild(container);

    // Update version label
    setText("lt-label-version", `Currently running: ${script} version ${version}, by ${author}`);
}
