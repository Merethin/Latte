import { NSScript } from "../nsdotjs/src/nsdotjs";
import { readConfigRecord, readConfigValue, saveConfigRecord } from "./config";
import { EyebeastSnapshot, loadSnapshot, RegionalOfficer } from "./eyebeast";

enum TagSwitchAction {
    AppointRO,
    Resign,
    JoinWA,
    End,
}

async function getRegionalOfficers(script: NSScript, region: string): Promise<Record<string, RegionalOfficer>> {
    let result: Record<string, RegionalOfficer> = {};

    let xml = await script.makeNsAPIXmlRequest({
        region: region,
        q: "officers",
    });

    const officerGroup = xml.getElementsByTagName("OFFICERS")[0];
    for(let officer of officerGroup.children) {
        let nation = officer.getElementsByTagName("NATION")[0].textContent;
        let officeName = officer.getElementsByTagName("OFFICE")[0].textContent;
        let authority = officer.getElementsByTagName("AUTHORITY")[0].textContent;

        let ro: RegionalOfficer = {
            nation: nation || "",
            officeName: officeName || "",
            authority: authority || "",
        };
        result[ro.nation] = ro;
    }

    return result;
}

var tagSwitchState: TagSwitchAction = TagSwitchAction.AppointRO;

export async function tagSwitch(script: NSScript) {
    switch(tagSwitchState) {
        case TagSwitchAction.AppointRO: {
            let officename = readConfigValue<string>("roName");
            var lastNationSeen = await script.get("lastNationSeen") as string | null;
            if(officename != null && lastNationSeen != null) {
                await script.editRegionalOfficer(lastNationSeen, officename, "ACEP");
                tagSwitchState = TagSwitchAction.Resign;
            }
            break;
        }
        case TagSwitchAction.Resign: {
            await script.resignWorldAssembly();
            tagSwitchState = TagSwitchAction.JoinWA;
            break;
        }
        case TagSwitchAction.JoinWA: {
            var nation: string | null = null;
            var appid: string | null = null;
            let quiver = readConfigRecord("quiver");
            if(Object.keys(quiver).length > 0) {
                [nation, appid] = Object.entries(quiver)[0];
            } else {
                script.statusBubble.warn("No WA applications left in quiver");
                return;
            }
            if(nation != null && appid != null) {
                GM_setClipboard(`https://fast.nationstates.net/nation=${nation}/template-overall=none`, "text");
                let success = await script.joinWorldAssembly(nation, appid);
                if(success) {
                    await script.set("lastNationSeen", nation);

                    if(quiver) {
                        delete quiver[nation];
                        saveConfigRecord("quiver", quiver);
                    }
                }
            }
            tagSwitchState = TagSwitchAction.End;
            break;
        }
        case TagSwitchAction.End: break;
    }
}

enum DetagSwitchAction {
    AppointRO,
    RestoreGov,
    OpenEyebeast,
    LoadSnapshot,
    DismissROs,
    EditROs,
    AppointROs,
    Resign,
    JoinWA,
    End,
}

var detagSwitchState: DetagSwitchAction = DetagSwitchAction.AppointRO;

var currentRegionalOfficers: Record<string, RegionalOfficer> = {};
var snapshot: EyebeastSnapshot | null = null;

var officersToDismiss: Array<RegionalOfficer> = Array();
var officersToEdit: Array<RegionalOfficer> = Array();
var officersToAppoint: Array<RegionalOfficer> = Array();

export async function detagSwitch(script: NSScript) {
    var lastRegionSeen = await script.get("lastRegionSeen") as string | null;

    switch(detagSwitchState) {
        case DetagSwitchAction.AppointRO: {
            // while we appoint ro, fetch the current officers
            if(lastRegionSeen != null) {
                getRegionalOfficers(script, lastRegionSeen).then((ros) => {
                    currentRegionalOfficers = ros;
                });
            }

            let officename = readConfigValue<string>("roName");
            var lastNationSeen = await script.get("lastNationSeen") as string | null;
            if(officename != null && lastNationSeen != null) {
                const success = await script.editRegionalOfficer(lastNationSeen, officename, "ACEP");
                if(success) detagSwitchState = DetagSwitchAction.RestoreGov;
                else detagSwitchState = DetagSwitchAction.Resign;
            }
            break;
        }
        case DetagSwitchAction.RestoreGov: {
            await script.renameGovernor("Governor");
            detagSwitchState = DetagSwitchAction.OpenEyebeast;
            break;
        }
        case DetagSwitchAction.OpenEyebeast: {
            if(lastRegionSeen != null) {
                window.open(`https://eyebeast.calref.ca/?region=${lastRegionSeen}`, '_blank');
                detagSwitchState = DetagSwitchAction.LoadSnapshot;
            }
            break;
        }
        case DetagSwitchAction.LoadSnapshot: {
            snapshot = loadSnapshot();

            officersToDismiss = Object.entries(currentRegionalOfficers).filter(
                ([nation, ro]) => 
                    !Object.keys(snapshot?.officers || {}).includes(nation) 
                    && nation != lastNationSeen
                    && !ro.authority.includes("S")
            ).map(([_, officer]) => officer);

            officersToEdit = Object.entries(currentRegionalOfficers).filter(
                ([nation, ro]) => 
                    Object.keys(snapshot?.officers || {}).includes(nation)
                    && (snapshot?.officers[nation].authority != ro.authority
                    || snapshot?.officers[nation].officeName != ro.officeName)
            ).map(([_, officer]) => officer);

            officersToAppoint = Object.entries(snapshot?.officers || {}).filter(
                ([nation, _]) => 
                    !Object.keys(currentRegionalOfficers).includes(nation)
            ).map(([_, officer]) => officer);

            if(officersToDismiss.length > 0)
                detagSwitchState = DetagSwitchAction.DismissROs;
            else if(officersToEdit.length > 0)
                detagSwitchState = DetagSwitchAction.EditROs;
            else if(officersToAppoint.length > 0)
                detagSwitchState = DetagSwitchAction.AppointROs;
            else 
                detagSwitchState = DetagSwitchAction.Resign;

            script.statusBubble.success("Loaded snapshot from Eyebeast");

            break;
        }
        case DetagSwitchAction.DismissROs: {
            let ro = officersToDismiss.pop();
            await script.dismissRegionalOfficer(ro?.nation as string, lastRegionSeen || "");
            if(officersToDismiss.length > 0)
                detagSwitchState = DetagSwitchAction.DismissROs;
            else if(officersToEdit.length > 0)
                detagSwitchState = DetagSwitchAction.EditROs;
            else if(officersToAppoint.length > 0)
                detagSwitchState = DetagSwitchAction.AppointROs;
            else 
                detagSwitchState = DetagSwitchAction.Resign;
            break;
        }
        case DetagSwitchAction.EditROs: {
            let ro = officersToEdit.pop();
            let target = snapshot?.officers[ro?.nation as string];
            let authority = target?.authority || "";
            if(!ro?.authority.includes("S"))
                authority = authority.replace(/S/g, "");
            if(!ro?.authority.includes("B"))
                authority = authority.replace(/B/g, "");

            console.log(ro?.authority);
            console.log(authority);

            await script.editRegionalOfficer(
                ro?.nation as string, 
                target?.officeName as string,
                authority,
                lastRegionSeen || "");

            if(officersToEdit.length > 0)
                detagSwitchState = DetagSwitchAction.EditROs;
            else if(officersToAppoint.length > 0)
                detagSwitchState = DetagSwitchAction.AppointROs;
            else 
                detagSwitchState = DetagSwitchAction.Resign;
            break;
        }
        case DetagSwitchAction.AppointROs: {
            let ro = officersToAppoint.pop();
            let authority = ro?.authority.replace(/S|B/g, "") || "";

            if(authority != "") {
                await script.editRegionalOfficer(
                    ro?.nation as string, 
                    ro?.officeName as string,
                    authority,
                    lastRegionSeen || "");
            } else {
                script.statusBubble.warn(`Not enough authority to appoint ${ro?.nation}`);
            }

            if(officersToAppoint.length > 0)
                detagSwitchState = DetagSwitchAction.AppointROs;
            else 
                detagSwitchState = DetagSwitchAction.Resign;
            break;
        }
        case DetagSwitchAction.Resign: {
            await script.resignWorldAssembly();
            detagSwitchState = DetagSwitchAction.JoinWA;
            break;
        }
        case DetagSwitchAction.JoinWA: {
            var nation: string | null = null;
            var appid: string | null = null;
            let quiver = readConfigRecord("quiver");
            if(Object.keys(quiver).length > 0) {
                [nation, appid] = Object.entries(quiver)[0];
            } else {
                script.statusBubble.warn("No WA applications left in quiver");
                return;
            }
            if(nation != null && appid != null) {
                GM_setClipboard(`https://fast.nationstates.net/nation=${nation}/template-overall=none`, "text");
                let success = await script.joinWorldAssembly(nation, appid);
                if(success) {
                    await script.set("lastNationSeen", nation);

                    if(quiver) {
                        delete quiver[nation];
                        saveConfigRecord("quiver", quiver);
                    }
                }
            }
            detagSwitchState = DetagSwitchAction.End;
            break;
        }
        case DetagSwitchAction.End: break;
    }
}