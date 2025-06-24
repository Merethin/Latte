// ==UserScript==
// @name         LatteNS
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Latte plugin to load applications from WA join pages on NS
// @author       Merethin
// @match        https://*.nationstates.net/page=join_WA*
// @match        https://*.nationstates.net/page=blank/latte=import*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

const PLUGIN_NAME = "LatteNS";

function loadQuiver() {
    var quiver = {};
    let quiverJSON = GM_getValue("quiver");
    if(quiverJSON != null) {
        quiver = JSON.parse(quiverJSON);
    }
    return quiver;
}

function saveQuiver(quiver) {
    let quiverJSON = JSON.stringify(quiver);
    GM_setValue("quiver", quiverJSON);
}

function checkPage(page) {
    return window.location.href.includes(page);
}

function checkPageRegex(regex) {
    let result = regex.exec(window.location.href);
    if (result == null) return null;
    return result[1];
}

function createTableElementsFromHTML(htmlString) {
    var tbody = document.createElement('tbody');
    tbody.innerHTML = htmlString.trim();
    return tbody.childNodes;
}

function removeApplicationFromQuiver(nation) {
    var quiver = loadQuiver();
    delete quiver[nation];
    saveQuiver(quiver);
}

(function() {
    'use strict';

    if(checkPage("page=blank/latte=import")) {
        let root = document.getElementById("quiver-table");

        var quiver = loadQuiver();

        let quiverHtml = "";
        Object.entries(quiver).forEach(([nation, appid]) => {
            quiverHtml += `<tr>
                    <td class="bigleft">${nation}</td>
                    <td>${appid}</td>
                    <td>${PLUGIN_NAME}</td>
                    <td><input type="checkbox" checked></input></td>
                    </tr>`;

            var button = document.createElement("button");
            button.style.display = "none";
            button.id = `appremove-${appid}`;
            button.onclick = () => { removeApplicationFromQuiver(nation); };
            root.appendChild(button);
        });

        root.append(...createTableElementsFromHTML(quiverHtml));

        const event = new Event("appsloaded");
        document.dispatchEvent(event);
    } else {
        let nation = checkPageRegex(/nation=([a-z0-9_\-]+)/);
        let appid = checkPageRegex(/appid=([0-9]+)/);

        if(nation != null && appid != null) {
            let quiver = loadQuiver();
            quiver[nation] = appid;
            saveQuiver(quiver);
        }
    }
})();
