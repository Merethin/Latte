/* latte.ts - main script file */

// third-party imports first, then latte stuff
import Mousetrap from 'mousetrap';
import { NSScript, addSidebarButton } from '../nsdotjs/src/nsdotjs';
import { getConfigValue, readConfigRecord, readConfigValue, saveConfigRecord } from './config';
import { keybinds, loadKeybind } from './keybinds';
import { checkPage, checkPageRegex } from './lib';
import { injectUserAgentWarning } from './htmllib';
import { saveEyebeastSnapshot } from './eyebeast';
import { setupMainPage } from './pages/main';
import { setupSettingsPage } from './pages/settings';
import { setupPrepPage, prep } from './pages/prep';
import { setupQuiverPage } from './pages/quiver';
import { setupTagPage, tag } from './pages/tag';
import { setupImportPage } from './pages/import';
import { setupSnapshotPage } from './pages/snapshot';
import { VERSION } from '../build/version';

const SCRIPT_NAME = "Latte";
const AUTHOR = "Merethin";

// called on every page load
(async function() {
    'use strict';

    // if on eyebeast, only do eyebeast stuff
    if(checkPage("eyebeast.calref.ca")) {
        Mousetrap.bind(loadKeybind(keybinds.detag), (_) => {
            saveEyebeastSnapshot();
        });

        return;
    }

    // fixme: this currently only works on Rift/Rift Dark
    // nsdotjs limitation but it means that getting to the 
    // Latte main page on any other theme is tricky
    addSidebarButton(
        "Latte",
        "shield",
        () => {},
        "/page=blank/latte=main",
    );

    // inject Latte content pages if necessary
    if(checkPage("page=blank/latte=main")) {
        setupMainPage(SCRIPT_NAME, AUTHOR, VERSION);
    } else if (checkPage("page=blank/latte=settings")) {
        setupSettingsPage();
    } else if (checkPage("page=blank/latte=prep")) {
        setupPrepPage();
    } else if (checkPage("page=blank/latte=quiver")) {
        setupQuiverPage();
    } else if (checkPage("page=blank/latte=tag")) {
        setupTagPage();
    } else if (checkPage("page=blank/latte=import")) {
        setupImportPage();
    } else if (checkPage("page=blank/latte=snapshot")) {
        setupSnapshotPage();
    }

    let userAgent = readConfigValue<string>("userAgent");
    if(userAgent == null) {
        // latte=settings is the page to set your UA 
        // and latte=prep already has its own warning set up
        if(!checkPage("page=blank/latte=settings") 
        && !checkPage("page=blank/latte=prep")) {
            injectUserAgentWarning();
        }     
    } else {
        // Only load the NSScript and keybinds if we have a user agent
        let script = new NSScript(SCRIPT_NAME, VERSION, AUTHOR, userAgent, async () => {});

        // load status bubble config and hide it if needed
        let showStatusBubble = getConfigValue<boolean>("showStatusBubble", true);
        if(showStatusBubble) {
            script.statusBubble.show();
        } else {
            script.statusBubble.hide();
        }

        // Fetch the current nation link from the page to reuse when we're in
        // template-overall=none - automatically changed when logging in or joining WA
        // Not using GM_setValue for this so that it's not stored across containers
        const links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".bellink");
        if (links.length > 0) { 
            var lastNationSeen: string | null = links[0].href.split("=")[1];
            await script.set("lastNationSeen", lastNationSeen);
        } else { 
            var lastNationSeen = await script.get("lastNationSeen") as string | null;
        }

        // ditto for region - automatically updated when moving
        const regionbar = document.getElementById("panelregionbar");
        if (regionbar) { 
            var lastRegionSeen: string | null = (regionbar.children[0] as HTMLAnchorElement).href.split("=")[1];
            await script.set("lastRegionSeen", lastRegionSeen);
        } else { 
            var lastRegionSeen = await script.get("lastRegionSeen") as string | null;
        }

        Mousetrap.bind(loadKeybind(keybinds.refresh), (_) => {
            if(script.isHtmlRequestInProgress) return;
                
            window.location.reload();
        });

        Mousetrap.bind(loadKeybind(keybinds.reauth), (_) => {
            if(script.isHtmlRequestInProgress) return;

            script.reAuthenticate();
        });

        Mousetrap.bind(loadKeybind(keybinds.endo), (_) => {
            if(script.isHtmlRequestInProgress) return;

            let nation = checkPageRegex(/\/nation=([a-z0-9_\-]+)/);
            if(nation != null) {
                script.endorseNation(nation);
            }
        });

        Mousetrap.bind(loadKeybind(keybinds.unendo), (_) => {
            if(script.isHtmlRequestInProgress) return;

            let nation = checkPageRegex(/\/nation=([a-z0-9_\-]+)/);
            if(nation != null) {
                script.unEndorseNation(nation);
            }
        });

        Mousetrap.bind(loadKeybind(keybinds.joinwa), (_) => {
            if(script.isHtmlRequestInProgress) return;

            var nation: string | null = null;
            var appid: string | null = null;
            var quiver: Record<string, string> | null = null;

            if(checkPage("page=join_WA")) {
                nation = checkPageRegex(/nation=([a-z0-9_\-]+)/);
                appid = checkPageRegex(/appid=([0-9]+)/);
            } else {
                quiver = readConfigRecord("quiver");
                if(Object.keys(quiver).length > 0) {
                    [nation, appid] = Object.entries(quiver)[0];
                } else {
                    script.statusBubble.warn("No WA applications left in quiver");
                    return;
                }
            }

            if(nation != null && appid != null) {
                GM_setClipboard(`https://fast.nationstates.net/nation=${nation}/template-overall=none`, "text");
                (async () => {
                    let success = await script.joinWorldAssembly(nation, appid);
                    if(success) {
                        await script.set("lastNationSeen", nation);
                        lastNationSeen = nation;

                        if(quiver) {
                            delete quiver[nation];
                            saveConfigRecord("quiver", quiver);
                        }
                    }
                })();
            }
        });

        Mousetrap.bind(loadKeybind(keybinds.move), (_) => {
            if(script.isHtmlRequestInProgress) return;

            let region = checkPageRegex(/region=([a-z0-9_\-]+)/);
            if(region != null) {
                (async () => {
                    let success = await script.moveToRegion(region);
                    if(success) {
                        await script.set("lastRegionSeen", region);
                        lastRegionSeen = region;
                    }
                })();
            }
        });

        Mousetrap.bind(loadKeybind(keybinds.jpmove), (_) => {
            if(script.isHtmlRequestInProgress) return;

            let region = readConfigValue<string>("jumpPoint");
            if(region != null) {
                (async () => {
                    let success = await script.moveToRegion(region);
                    if(success) {
                        await script.set("lastRegionSeen", region);
                        lastRegionSeen = region;
                    }
                })();
            }
        });

        Mousetrap.bind(loadKeybind(keybinds.apply), (_) => {
            if(script.isHtmlRequestInProgress) return;

            script.applyToWorldAssembly();
        });

        Mousetrap.bind(loadKeybind(keybinds.resign), (_) => {
            if(script.isHtmlRequestInProgress) return;

            script.resignWorldAssembly();
        });

        Mousetrap.bind(loadKeybind(keybinds.region), (_) => {
            if(script.isHtmlRequestInProgress) return;
            if(!lastRegionSeen) return;

            window.location.href = `https://${window.location.host}/region=${lastRegionSeen}`;
        });

        Mousetrap.bind(loadKeybind(keybinds.nation), (_) => {
            if(!lastNationSeen) return;

            GM_setClipboard(`https://fast.nationstates.net/nation=${lastNationSeen}/template-overall=none`, "text");
        });

        Mousetrap.bind(loadKeybind(keybinds.ro), (_) => {
            if(script.isHtmlRequestInProgress) return;

            let officename = readConfigValue<string>("roName");
            if(officename != null && lastNationSeen != null) {
                script.editRegionalOfficer(lastNationSeen, officename, "ACEP");
            }
        });

        Mousetrap.bind(loadKeybind(keybinds.prep), (_) => {
            if(script.isHtmlRequestInProgress) return;

            if(checkPage("page=blank/latte=prep")) {
                // Perform a Prep action
                prep(script);
            } else {
                // Go to Prep page
                window.location.href = `https://${window.location.host}/page=blank/latte=prep`;
            }
        });

        Mousetrap.bind(loadKeybind(keybinds.tag), (_) => {
            if(script.isHtmlRequestInProgress) return;

            if(checkPage("page=blank/latte=tag")) {
                // Perform a Tag action
                tag(script);
            } else {
                // Go to Tag page
                window.location.href = `https://${window.location.host}/page=blank/latte=tag`;
            }
        });

        Mousetrap.bind(loadKeybind(keybinds.detag), (_) => {
            if(script.isHtmlRequestInProgress) return;
            if(!lastRegionSeen) return;

            window.open(`https://eyebeast.calref.ca/?region=${lastRegionSeen}`, '_blank');
        });
    }
})();