import { checkPage, addApplication, importApplications } from "../pluginlib";

const PLUGIN_NAME = "LatteGmail";
const WA_JOIN_REGEX = /https:\/\/www\.nationstates\.net\/page=join_WA\?nation=([a-zA-Z0-9_\-]+)&appid=([0-9]+)/;

function findApplicationInEmail() {
    const links = document.querySelectorAll("a");
    for(var link of links) {
        let result = WA_JOIN_REGEX.exec(link.href);
        if (result == null) continue;

        let nation = result[1];
        let appid = result[2];

        addApplication(nation, appid);
        break;
    }
}

(function() {
    'use strict';

    if(checkPage("page=blank/latte=import")) {
        importApplications(PLUGIN_NAME);
    } else { // mail.google.com
        findApplicationInEmail();

        window.addEventListener('hashchange', findApplicationInEmail);
    }
})();