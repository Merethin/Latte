/* lib.ts - utility functions that do not primarily use the DOM (the others go in htmllib.ts). */

import { ApplyToWorldAssemblyFormData, NSScript } from "../nsdotjs/src/nsdotjs";
import { setConfigValue } from "./config";

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
 * Converts a Base64 data: URL into a JS File object.
 *
 * @param dataurl The data: URL to convert.
 * @param filename The filename to use for the File object.
 * @returns The resulting File object.
 */
export function dataURLtoFile(dataurl: string, filename: string): File {
    var arr = dataurl.split(','),
        mime = (arr[0].match(/:(.*?);/) as RegExpMatchArray)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

/**
 * Encodes a file into a Base64 data: URL and stores said URL in Latte's internal storage.
 * 
 * @param element The HTML file input element to get the file from.
 * @param key The key to save the URL with in storage.
 * @param callback A function called with the resulting URL once the process is finished.
 */
export function encodeFileAsURL(
    element: HTMLInputElement, 
    key: string, 
    callback: (url: string | ArrayBuffer | null) => void,
): void {
    var file = (element.files as FileList)[0];
    var reader = new FileReader();
    reader.onloadend = function() {
        setConfigValue(key, reader.result);
        callback(reader.result);
    }
    reader.readAsDataURL(file);
}

/**
 * Return value of checkApplyToWA() - either Success or Failure, or if the 
 * request failed because the nation has already applied to the WA, MustReapply.
 */
export enum ApplyResult {
    Success,
    MustReapply,
    Failure
};

/**
 * Applies to join the World Assembly and, in case of failure, checks whether the
 * current nation needs to reapply instead.
 * 
 * This function exists because the standard script.applyToWorldAssembly() in nsdotjs
 * doesn't distinguish from a failure to apply and a need to reapply.
 *
 * @param context The NSScript object to use to make the request.
 * @returns A Promise that resolves to either 'Success', 'Failure', or 'MustReapply'.
 */
export async function checkApplyToWA(
    context: NSScript,
): Promise<ApplyResult> {
    let payload: ApplyToWorldAssemblyFormData = {
        action: "join_UN",
        submit: "1",
    };

    const text = await context.getNsHtmlPage("page=UN_status", payload);
    if (
        text.includes(
            "Your application to join the World Assembly has been received!",
        )
    ) {
        context.statusBubble.success("Applied to World Assembly");
        return ApplyResult.Success;
    } else if (
        text.includes("should have arrived by now!")
    ) {
        context.statusBubble.info("Already applied to World Assembly");
        return ApplyResult.MustReapply;
    }
    context.statusBubble.warn("Failed to apply to World Assembly");
    return ApplyResult.Failure;
}