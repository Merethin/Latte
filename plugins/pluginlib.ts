export function checkPage(page: string): boolean {
    return window.location.href.includes(page);
}

export function checkPageRegex(regex: RegExp): string | null {
    let result = regex.exec(window.location.href);
    if (result == null) return null;
    return result[1];
}

export function addApplication(nation: string, appid: string) {
    let quiver = loadQuiver();
    quiver[nation] = appid;
    saveQuiver(quiver);
}

export function removeApplication(nation: string): void {
    var quiver = loadQuiver();
    delete quiver[nation];
    saveQuiver(quiver);
}

export function importApplications(pluginName: string) {
    let root = document.getElementById("quiver-table") as HTMLElement;

    var quiver = loadQuiver();

    let quiverHtml = "";
    Object.entries(quiver).forEach(([nation, appid]) => {
        quiverHtml += `<tr>
                <td class="bigleft">${nation}</td>
                <td>${appid}</td>
                <td>${pluginName}</td>
                <td><input type="checkbox" checked></input></td>
                </tr>`;

        var button = document.createElement("button");
        button.style.display = "none";
        button.id = `appremove-${appid}`;
        button.onclick = () => { removeApplication(nation); };
        root.appendChild(button);
    });

    root.append(...createTableElementsFromHTML(quiverHtml));

    const event = new Event("appsloaded");
    document.dispatchEvent(event);
}

function createTableElementsFromHTML(htmlString: string) {
    var tbody = document.createElement('tbody');
    tbody.innerHTML = htmlString.trim();
    return tbody.childNodes;
}

function loadQuiver() {
    var quiver: Record<string, string> = {};
    let quiverJSON: string | null = GM_getValue("quiver");
    if(quiverJSON != null) {
        quiver = JSON.parse(quiverJSON);
    }
    return quiver;
}

function saveQuiver(quiver: Record<string, string>) {
    let quiverJSON = JSON.stringify(quiver);
    GM_setValue("quiver", quiverJSON);
}