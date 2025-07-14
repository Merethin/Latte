/* pages/snapshot.ts - page code for page=blank/latte=snapshot */

import { createTableElementsFromHTML, getElement, setText } from "../htmllib";
import { snapshotPageHTML } from "./html/snapshot.html";
import { loadSnapshot } from "../eyebeast";
import { prettify } from "../../nsdotjs/src/nsdotjs";

const AUTHORITY_A = '<span class="operm operm-A"><i class="icon-flag-1"></i> Appearance</span>';
const AUTHORITY_B = '<span class="operm operm-B"><i class="icon-shield"></i> Border Control</span>';
const AUTHORITY_C = '<span class="operm operm-C"><i class="icon-mic"></i> Communications</span>';
const AUTHORITY_E = '<span class="operm operm-E"><i class="icon-building"></i> Embassies</span>';
const AUTHORITY_P = '<span class="operm operm-P"><i class="icon-align-left"></i> Polls</span>';
const AUTHORITY_S = '<span class="operm operm-S"><i class="icon-key"></i> Successor</span>';

/**
 * Injects the snapshot page HTML code into the DOM along with the snapshot data itself.
 */
export function setupSnapshotPage() {
    // Insert main HTML
    let container = document.createElement("div");
    container.innerHTML = snapshotPageHTML;
    getElement("content").appendChild(container);

    const snapshot = loadSnapshot();

    if(snapshot.region.length != 0)
        setText("lt-label-region", `Region: ${snapshot.region}`);
    else
        setText("lt-label-region", `Default snapshot (used to restore regions that are missing data)`);

    if(snapshot.flagUrl == "none")
        getElement("lt-label-noflag").style.display = "block";
    else
        (getElement("lt-image-flag") as HTMLImageElement).src = snapshot.flagUrl;

    if(snapshot.bannerUrl.startsWith("r")) { // default banner (r1-9)
        getElement("lt-label-default-banner").style.display = "block";
        const bannerUrl = `https://${window.location.host}/images/rbanners/${snapshot.bannerUrl}`;
        (getElement("lt-image-banner") as HTMLImageElement).src = bannerUrl;
    } else // data url
        (getElement("lt-image-banner") as HTMLImageElement).src = snapshot.bannerUrl;

    setText("lt-content-wfe", snapshot.wfe);
    if(snapshot.tags.length > 0)
        setText("lt-content-tags", snapshot.tags.map(prettify).join(", "));
    else
        setText("lt-content-tags", "Snapshot has no tags saved.");

    let roElement = getElement("lt-content-ros");
    for(let officer of snapshot.officers) {
        let authorityHTML = "";
        for (let i = 0; i < officer.authority.length; i++) {
            switch(officer.authority.charAt(i)) {
                case "A": authorityHTML += AUTHORITY_A; break;
                case "B": authorityHTML += AUTHORITY_B; break;
                case "C": authorityHTML += AUTHORITY_C; break;
                case "E": authorityHTML += AUTHORITY_E; break;
                case "P": authorityHTML += AUTHORITY_P; break;
                case "S": authorityHTML += AUTHORITY_S; break;
                default: break;
            }
        }

        const officerHTML = `<tr><td>${prettify(officer.nation)}</td><td>${officer.officeName}</td><td>${authorityHTML}</td></tr>`

        roElement.append(...createTableElementsFromHTML(officerHTML));
    }
}
