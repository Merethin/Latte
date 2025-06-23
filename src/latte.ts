import { keybinds, loadKeybind } from './keybinds';
import Mousetrap from 'mousetrap';
import { NSScript, addSidebarButton } from '../nsdotjs/src/nsdotjs';
import { checkPage, checkPageRegex, injectUAWarning } from './lib';
import { VERSION } from '../build/version';
import { setupMainPage } from './mainPage';
import { setupSettingsPage } from './settings';
import { setupPrepPage, prep } from './prep';
import { setupQuiverPage } from './quiver';
import { setupTagPage } from './tag';
import { setupImportPage } from './import';

(async function() {
    'use strict';

    addSidebarButton(
        "Latte",
        "shield",
        () => {},
        "/page=blank/latte=main",
    );

    if(checkPage("page=blank/latte=main")) {
        setupMainPage();
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
    }

    let userAgent: string | null = GM_getValue("userAgent");
    if(userAgent == null) {
        // latte=settings is the page to set your UA 
        // and latte=prep already has its own warning set up
        if(!checkPage("page=blank/latte=settings") 
        && !checkPage("page=blank/latte=prep")) {
            injectUAWarning();
        }     
    } else {
        let script = new NSScript("Latte", VERSION, "Merethin", userAgent, async () => {});

        let showStatusBubble = GM_getValue("showStatusBubble", 1);
        if(showStatusBubble) {
            script.statusBubble.show();
        } else {
            script.statusBubble.hide();
        }

        // Not using GM_setValue for this so that it's not stored across containers
        const links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".bellink");
        if (links.length > 0) { 
            var lastNationSeen: string | null = links[0].href.split("=")[1];
            await script.set("lastNationSeen", lastNationSeen);
        } else { 
            var lastNationSeen = await script.get("lastNationSeen") as string | null;
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

        Mousetrap.bind(loadKeybind(keybinds.move), (_) => {
            if(script.isHtmlRequestInProgress) return;

            let region = checkPageRegex(/region=([a-z0-9_\-]+)/);
            if(region != null) {
                script.moveToRegion(region);
            }
        });

        Mousetrap.bind(loadKeybind(keybinds.jpmove), (_) => {
            if(script.isHtmlRequestInProgress) return;

            let region: string | null = GM_getValue("jumpPoint");
            if(region != null) {
                script.moveToRegion(region);
            }
        });

        Mousetrap.bind(loadKeybind(keybinds.resign), (_) => {
            if(script.isHtmlRequestInProgress) return;

            script.resignWorldAssembly();
        });

        Mousetrap.bind(loadKeybind(keybinds.apply), (_) => {
            if(script.isHtmlRequestInProgress) return;

            script.applyToWorldAssembly();
        });

        Mousetrap.bind(loadKeybind(keybinds.ro), (_) => {
            if(script.isHtmlRequestInProgress) return;

            let officename: string | null = GM_getValue("roName");
            if(officename != null && lastNationSeen != null) {
                script.editRegionalOfficer(lastNationSeen, officename, "ACEP");
            }
        });

        Mousetrap.bind(loadKeybind(keybinds.joinwa), (_) => {
            if(script.isHtmlRequestInProgress) return;

            if(checkPage("page=join_WA")) {
                let nation = checkPageRegex(/nation=([a-z0-9_\-]+)/);
                let appid = checkPageRegex(/appid=([0-9]+)/);
                if(nation != null && appid != null) {
                    if(!script.isHtmlRequestInProgress) {
                        GM_setClipboard(`https://fast.nationstates.net/nation=${nation}/template-overall=none`, "text");
                        (async () => {
                            let success = await script.joinWorldAssembly(nation, appid);
                            if(success) await script.set("lastSeenNation", nation);
                        })();
                    }
                }
            } else {
                // TODO: Load from quiver
            }
        });

        Mousetrap.bind(loadKeybind(keybinds.nation), (_) => {
            if(!lastNationSeen) return;

            GM_setClipboard(`https://fast.nationstates.net/nation=${lastNationSeen}/template-overall=none`, "text");
        })

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
                // Do stuff
            } else {
                // Go to Tag page
                window.location.href = `https://${window.location.host}/page=blank/latte=tag`;
            }
        });
    }
})();