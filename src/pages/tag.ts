/* pages/tag.ts - page code for page=blank/latte=tag */

import Mousetrap from "mousetrap";
import { NSScript, prettify, ValidRegionTag } from "../../nsdotjs/src/nsdotjs";
import { keybinds, loadKeybind } from "../keybinds";
import { dataURLtoFile } from "../lib";
import { getButtonElement, getElement, getInputElement, injectWarning, setText } from "../htmllib";
import { getConfigValue, readConfigList, readConfigValue } from "../config";
import { tagPageHTML } from "./html/tag.html";

const REGEX = 
/https:\/\/(?:fast|www)\.nationstates\.net\/region=([a-z0-9_\-]+) hit by https:\/\/(?:fast|www)\.nationstates\.net\/nation=([a-z0-9_\-]+)/;

/**
 * Injects the tag page HTML into the DOM and sets up handlers.
 */
export function setupTagPage(): void {
    let password = readConfigValue("password");
    if(password == null) {
        injectWarning("You have not set a switcher password! Latte tagging will not work until you do so <a href='page=blank/latte=settings'>here</a>.");
        return;
    }

    // Insert main HTML
    let container = document.createElement("div");
    container.innerHTML = tagPageHTML;
    getElement("content").appendChild(container);

    // Set up onclick handlers
    getButtonElement("lt-btn-tag").onclick = () => {Mousetrap.trigger(loadKeybind(keybinds.tag));}
    getButtonElement("lt-btn-update").onclick = loadHits;
}

const switchers = readConfigList("switchers");
var regions: Array<string> = new Array();
var nations: Array<string> = new Array();

let index = 0;

function loadHits() {
    let input = getInputElement("lt-input-regions");
    if(input.value != "") {
        let lines = input.value.split("\n");
        for(var line of lines) {
            let result = REGEX.exec(line);
            if(result == null) continue;

            let region = result[1];
            let nation = result[2];

            if(!switchers.includes(nation)) continue;

            regions.push(region);
            nations.push(nation);
        }

        updateRegionCount(index);
        input.value = "";
    }
}

const wfe = getConfigValue<string>("wfe", "");
const embassies = readConfigList("embassies");
const tagsToAdd = readConfigList("tagsToAdd");
const tagsToRemove = readConfigList("tagsToRemove");
const banner = getConfigValue<string>("banner", "");
const flag = getConfigValue<string>("flag", "");

enum TagAction {
    Start,
    UploadBanner,
    UploadFlag,
    SetFlagAndBanner,
    UpdateWFE,
    AddTag,
    RemoveTag,
    BuildEmbassy,
    Login,
    Finish,
}

const buttonLabels = [
    "Login to First Nation",
    "Upload Banner",
    "Upload Flag",
    "Set Flag & Banner",
    "Update World Factbook Entry",
    "Add Tag",
    "Remove Tag",
    "Build Embassy",
    "Login to Next Nation",
    "Finished",
];

var tagRegion: null | string = null;
var tagState: TagAction = TagAction.Start;

var bannerId: number | null = null;
var flagId: number | null = null;
var embassyIndex = 0;
var addTagIndex = 0;
var removeTagIndex = 0;

function updateStatus(status: string) {
    setText("lt-status-tag", `Status: ${status}`);
}

function updateRegionCount(count: number) {
    setText("lt-status-count", `Regions Tagged: ${count}/${regions.length}`);
}

/**
 * Using a state machine, performs one tagging action. Called every time the Tag key is pressed.
 * 
 * If the state is Start, logs in to the first puppet and moves to UploadBanner.
 * If the state is Login, logs in to the next puppet and moves to UploadBanner. If out of puppets, moves to Finish.
 * If the state is UploadBanner, uploads the banner. If this fails, it assumes the nation has not ROed/has
 * lost RO permissions, and therefore skips this region and moves to Login. Otherwise, moves to UploadFlag.
 * If the state is UploadFlag, uploads the flag. If this fails, moves to Login, otherwise SetBannerAndFlag.
 * If the state is SetBannerAndFlag, sets them and moves to AddTag.
 * If the state is AddTag, adds one tag. If out of tags to add, moves to RemoveTag.
 * If the state is RemoveTag, removes one tag. If out of tags to remove, moves to BuildEmbassy.
 * If the state is BuildEmbassy, requests one embassy. If out of embassies, moves back to Login.
 * If the state is Finish, the process is finished and it does nothing.
 * 
 * @param script The NSScript object to use to make requests.
 * @returns A Promise that resolves to nothing.
 */
export async function tag(script: NSScript): Promise<void> {
    const password = readConfigValue<string>("password");
    if(password == null) return;

    switch(tagState) {
        // @ts-ignore
        case TagAction.Login: index = index + 1;
        // fallthrough (intended)
        case TagAction.Start: {
            if(index == nations.length) {
                updateStatus("Finished tagging all regions");
                updateRegionCount(index);
                tagState = TagAction.Finish;
                break;
            }

            const nation = nations[index];

            const success = await script.login(nation, password);
            if(success) {
                updateStatus(`Logged in to ${nation}`);
                updateRegionCount(index);
                setText("lt-status-nation", nation);
                tagRegion = regions[index];
            } else {
                updateStatus(`Failed to log in to ${nation}`);
                break;
            }
            tagState = TagAction.UploadBanner;
            break;
        }
        case TagAction.UploadBanner: {
            if(banner != "") {
                const bannerFile = dataURLtoFile(banner, "banner.png");
                bannerId = await script.uploadBanner(bannerFile, tagRegion as string);
                if(bannerId == null) {
                    updateStatus("Banner upload failed, assuming no permissions");
                    tagState = TagAction.Login; // this nation has no permissions, log in to the next one
                    break;
                }

                updateStatus("Banner uploaded");
                tagState = TagAction.UploadFlag;
                break;
            }

            updateStatus("No banner set, skipping appearance");
            tagState = TagAction.UpdateWFE;
            break;
        }
        case TagAction.UploadFlag: {
            if(flag != "") {
                const flagFile = dataURLtoFile(flag, "flag.png");
                flagId = await script.uploadFlag(flagFile, tagRegion as string);
                if(flagId == null) {
                    updateStatus("Flag upload failed, assuming no permissions");
                    // this nation has no permissions, log in to the next one
                    tagState = TagAction.Login;
                    break;
                }

                updateStatus("Flag uploaded");
                tagState = TagAction.SetFlagAndBanner;
                break;
            }

            updateStatus("No flag set, skipping appearance");
            tagState = TagAction.UpdateWFE;
            break;
        }
        case TagAction.SetFlagAndBanner: {
            if(bannerId != null && flagId != null) {
                const success = await script.setBannerAndFlag(tagRegion as string, bannerId, flagId);

                if(success) updateStatus("Updated banner and flag");
                else updateStatus("Failed to update banner and flag");
            } 
            else updateStatus("Banner and flag not uploaded, skipping");

            tagState = TagAction.UpdateWFE;
            break;
        }
        case TagAction.UpdateWFE: {
            console.log(wfe);
            const success = await script.changeWFE(wfe);

            if(success)
                updateStatus("Changed WFE");
            else
                updateStatus("Failed to change WFE");

            tagState = TagAction.AddTag;
            break;
        }
        case TagAction.AddTag: {
            if(addTagIndex >= tagsToAdd.length) {
                updateStatus("All tags added, next step");
                addTagIndex = 0;
                tagState = TagAction.RemoveTag;
                break;
            }

            const tag = tagsToAdd[addTagIndex];
            const success = await script.addTag(tag as ValidRegionTag);

            if(success) 
                updateStatus(`Added tag ${prettify(tag)}`);
            else 
                updateStatus(`Failed to add tag ${prettify(tag)}`);

            addTagIndex += 1;
            break;
        }
        case TagAction.RemoveTag: {
            if(removeTagIndex >= tagsToRemove.length) {
                updateStatus("All tags removed, next step");
                removeTagIndex = 0;
                tagState = TagAction.BuildEmbassy;
                break;
            }

            const tag = tagsToRemove[removeTagIndex];
            const success = await script.removeTag(tag as ValidRegionTag);

            if(success) 
                updateStatus(`Removed tag ${prettify(tag)}`);
            else 
                updateStatus(`Failed to remove tag ${prettify(tag)}`);

            removeTagIndex += 1;
            break;
        }
        case TagAction.BuildEmbassy: {
            if(embassyIndex >= embassies.length) {
                updateStatus("All embassies requested, next step");
                embassyIndex = 0;
                tagState = TagAction.Login;
                break;
            }

            const target = embassies[embassyIndex];
            const success = await script.requestEmbassy(target);

            if(success) 
                updateStatus(`Requested embassy with ${prettify(target)}`);
            else 
                updateStatus(`Failed to request embassy with ${prettify(target)}`);

            embassyIndex += 1;
            break;
        }
        case TagAction.Finish: break;
    }

    setText("lt-btn-tag", buttonLabels[tagState.valueOf()]);
}