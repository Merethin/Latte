import { checkPage, checkPageRegex, importApplications, addApplication } from "../pluginlib";

const PLUGIN_NAME = "LatteNS";

(function() {
    'use strict';

    if(checkPage("page=blank/latte=import")) {
        importApplications(PLUGIN_NAME);
    } else { // page=join_WA
        let nation = checkPageRegex(/nation=([a-z0-9_\-]+)/);
        let appid = checkPageRegex(/appid=([0-9]+)/);

        if(nation != null && appid != null) {
            addApplication(nation, appid);
        }
    }
})();