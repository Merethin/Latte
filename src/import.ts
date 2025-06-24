import { canonicalize } from "../nsdotjs/src/nsdotjs";
import { loadQuiver, saveQuiver } from "./lib";

const importPageHTML =
    `<h1>Latte: Import WA Applications</h1>
    <p>If you have a Latte plugin installed with applications loaded, they should show up here for you to import.</p>
    <div class="divindent" id="import-body">
    <h4 id="quiver-count">0 Applications to Load</h4>
    <div class="widebox"><table class="shiny wide embassies mcollapse"><tbody id="quiver-table">
    <tr><th class="bigleft">Nation</th><th>Application ID</th><th>From Plugin</th><th>Import</th></tr>
    </tbody></table></div>
    </br>
    <button name="importquiver" id="importquiver" type="submit" class="button icon approve primary">Load into Quiver</button>
    <button name="clearplugins" id="clearplugins" type="submit" class="button icon remove danger">Clear Plugin Applications</button>
    </div>`;

function importQuiver() {
    var quiver = loadQuiver();

    const tableNodes = (document.getElementById("quiver-table") as HTMLElement).children;
    for(var node of tableNodes) {
        if(node.nodeName == "BUTTON") continue;
        if(node.children[0].nodeName == "TH") continue;

        const checkbox = (node.children[3].children[0] as HTMLInputElement); // checkbox
        if(checkbox.checked) {
            const nation = canonicalize((node.children[0] as HTMLElement).innerText); // nation
            const appid = (node.children[1] as HTMLElement).innerText; // application id

            quiver[nation] = appid;

            (document.getElementById(`appremove-${appid}`) as HTMLButtonElement).click(); // hidden button inserted by plugin to clear the app from its list
        }
    }

    saveQuiver(quiver);
    window.location.reload();
}

function clearPluginApps() {
    const tableNodes = (document.getElementById("quiver-table") as HTMLElement).children;
    for(var node of tableNodes) {
        if(node.nodeName == "BUTTON") continue;
        if(node.children[0].nodeName == "TH") continue;
        const appid = (node.children[1] as HTMLElement).innerText; // application id

        (document.getElementById(`appremove-${appid}`) as HTMLButtonElement).click(); // hidden button inserted by plugin to clear the app from its list
    }

    window.location.reload();
}

export function setupImportPage() {
    // Insert main HTML
    let container = document.createElement("div");
    container.innerHTML = importPageHTML;
    (document.getElementById("content") as HTMLElement).appendChild(container);

    // Setup onclick handlers
    (document.getElementById("importquiver") as HTMLButtonElement).onclick = importQuiver;
    (document.getElementById("clearplugins") as HTMLButtonElement).onclick = clearPluginApps;

    // Called by plugins
    document.addEventListener('appsloaded', () => {
        const count = (document.getElementById("quiver-table") as HTMLElement).querySelectorAll("tr").length - 1;
        (document.getElementById("quiver-count") as HTMLElement).innerText = `${count} Applications to Load`;
    });
}