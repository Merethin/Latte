/* pluginlib.ts - utility functions to make plugins easier to write */

/**
 * Checks if the current page we're on contains a string.
 * 
 * @param page The string to check.
 * @returns True if it does contain the string, False if it doesn't.
 */
export function checkPage(page: string): boolean {
    return window.location.href.includes(page);
}

/**
 * Checks if the current page we're on matches a specific regex.
 * This function is intended to be used on a regex with a single capture group.
 * 
 * @param regex The regex to match against.
 * @returns The value of the matched regex's first capture group, or null if the page doesn't match.
 */
export function checkPageRegex(regex: RegExp): string | null {
    let result = regex.exec(window.location.href);
    if (result == null) return null;
    return result[1];
}

/**
 * Adds a WA application to the plugin's internal storage.
 * 
 * @param nation The nation that applied to the WA.
 * @param appid The application ID.
 */
export function addApplication(nation: string, appid: string) {
    let quiver = loadQuiver();
    quiver[nation] = appid;
    saveQuiver(quiver);
}

/**
 * Removes a WA application from the plugin's internal storage.
 * 
 * @param nation The nation to remove the application of.
 */
export function removeApplication(nation: string): void {
    var quiver = loadQuiver();
    delete quiver[nation];
    saveQuiver(quiver);
}

/**
 * When on page=blank/latte=import, assuming that the main Latte script has been loaded before us,
 * injects the plugin's WA applications into the page so that the main script can access them,
 * and sets up event handlers so that main script code can remove applications from the plugin's
 * storage when importing them (or when the 'Clear Plugin Applications' button is pressed).
 * 
 * @param pluginName The plugin name to show in the 'Plugin Name' column in the page.
 */
export function importApplications(pluginName: string) {
    let root = document.getElementById("lt-content-quiver") as HTMLElement;

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
        button.id = `lt-action-appremove-${appid}`;
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