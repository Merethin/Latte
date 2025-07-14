import { canonicalize } from "../nsdotjs/src/nsdotjs";
import { readConfigValue, setConfigValue } from "./config";
import { getElement } from "./htmllib";
import { convertImageToBase64 } from "./lib";

export type RegionalOfficer = {
    nation: string;
    officeName: string;
    authority: string;
};

export type EyebeastSnapshot = {
    region: string,
    flagUrl: string,
    bannerUrl: string,
    tags: Array<string>,
    wfe: string,
    officers: Array<RegionalOfficer>,
};

export const DEFAULT_SNAPSHOT: EyebeastSnapshot = {
    region: "",
    flagUrl: "none",
    bannerUrl: "r1",
    tags: Array<string>(),
    wfe: "n/a.",
    officers: Array<RegionalOfficer>(),
};

export function loadSnapshot(): EyebeastSnapshot {
    const snapshotJSON = readConfigValue<string>("eyebeastSnapshot");
    if(snapshotJSON == null) return DEFAULT_SNAPSHOT;
    return JSON.parse(snapshotJSON) as EyebeastSnapshot;
}

export async function saveEyebeastSnapshot() {
    if((document.querySelector("h1.title") as HTMLHeadingElement).innerText.includes("404: Not Found"))
        return;

    let statusBar = document.createElement("div");
    statusBar.classList.add("container");
    statusBar.classList.add("outline");
    statusBar.style.maxWidth = "95%";
    statusBar.innerText = "Saving Eyebeast snapshot data into Latte...";
    document.querySelector("navbar")?.appendChild(statusBar);
    
    let snapshot = DEFAULT_SNAPSHOT;

    snapshot.region = (document.querySelector("p.title.regions:not(.inactive)") as HTMLParagraphElement).innerText;

    const activeFlagElement = getElement("flags").querySelector("pre:not(.inactive)");
    const flagImage = activeFlagElement?.querySelector("img");
    if(flagImage != null) {
        const dataURL = await convertImageToBase64(flagImage);
        snapshot.flagUrl = dataURL;
    }

    const activeBannerElement = getElement("banners").querySelector("pre:not(.inactive)");
    const bannerImage = activeBannerElement?.querySelector("img") as HTMLImageElement;

    const defaultBannerUrlRegex = /https:\/\/www\.nationstates\.net\/images\/rbanners\/(r[1-9])/;
    let result = defaultBannerUrlRegex.exec(bannerImage.src);
    if(result != null) {
        snapshot.bannerUrl = result[1];
    } else {
        const dataURL = await convertImageToBase64(bannerImage);
        snapshot.bannerUrl = dataURL;
    }

    const activeWFEElement = getElement("wfes").querySelector("pre:not(.inactive)") as HTMLPreElement;
    snapshot.wfe = activeWFEElement.innerText;

    const activeTagsElement = getElement("tags").querySelector("pre:not(.inactive)") as HTMLPreElement;
    snapshot.tags = activeTagsElement.innerText.split("\n").map(canonicalize);

    const activeROSElement = getElement("ros").querySelector("pre:not(.inactive)") as HTMLPreElement;
    const roRegex = /^([a-z0-9_\-]+) \| (.+)$\n^(Appearance|Border Control|Communications|Embassies|Polls|Successor)((?: • (?:Appearance|Border Control|Communications|Embassies|Polls|Successor))*)/mg;
    let roResult = roRegex.exec(activeROSElement.innerText);
    while(roResult != null) {
        let ro: RegionalOfficer = {
            nation: roResult[1],
            officeName: roResult[2],
            authority: "",
        };

        let authorities = Array<string>(roResult[3]);
        if(roResult.length == 5) {
            roResult[4].split(" • ").forEach((authority) => {
                authorities.push(authority);
            })
        }
        
        authorities.forEach((authority) => {
            switch(authority) {
                case "Appearance": ro.authority += "A"; break;
                case "Border Control": ro.authority += "B"; break;
                case "Communications": ro.authority += "C"; break;
                case "Embassies": ro.authority += "E"; break;
                case "Polls": ro.authority += "P"; break;
                case "Successor": ro.authority += "S"; break;
            }
        });

        snapshot.officers.push(ro);
        roResult = roRegex.exec(activeROSElement.innerText);
    }

    setConfigValue("eyebeastSnapshot", JSON.stringify(snapshot));
    window.close();
}