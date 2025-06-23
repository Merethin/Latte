import { prettify } from "../nsdotjs/src/nsdotjs";
import { createTableElementsFromHTML } from "./htmllib";
import { loadQuiver, saveQuiver } from "./lib";

const quiverPageHTML =
    `<h1>Latte: Quiver</h1>
    <p>View stored WA applications here.</p>
    <div class="divindent">
    <h4 id="quiver-count">0 Applications Loaded</h4>
    <div class="widebox"><table class="shiny wide embassies mcollapse"><tbody id="quiver-table">
    <tr><th class="bigleft">Nation</th><th>Application ID</th></tr>
    </tbody></table></div>
    </br>
    <button name="clearquiver" id="clearquiver" type="submit" class="button icon remove danger">Clear Quiver</button>
    </div>`;

function clearQuiver() {
    var quiver: Record<string, string> = {};
    saveQuiver(quiver);

    window.location.reload();
}

export function setupQuiverPage() {
    var quiver = loadQuiver();

    // Build quiver HTML
    let quiverHtml = "";
    Object.entries(quiver).forEach(([nation, appid]) => {
        quiverHtml += `<tr><td class="bigleft">${prettify(nation)}</td><td><b>${appid}</b></td></tr>`
    });

    // Insert main HTML
    let container = document.createElement("div");
    container.innerHTML = quiverPageHTML;
    (document.getElementById("content") as HTMLElement).appendChild(container);
    (document.getElementById("quiver-table") as HTMLElement).append(...createTableElementsFromHTML(quiverHtml));

    // Setup onclick handlers
    (document.getElementById("clearquiver") as HTMLButtonElement).onclick = clearQuiver;

    var count = Object.keys(quiver).length;
    if(count == 0) {
        (document.getElementById("clearquiver") as HTMLButtonElement).setAttribute("disabled", "true");
    } else {
        (document.getElementById("quiver-count") as HTMLElement).innerText = `${count} Applications Loaded`;
    }
}