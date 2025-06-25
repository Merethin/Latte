import { ApplyToWorldAssemblyFormData, NSScript } from "../nsdotjs/src/nsdotjs";
import { setConfigValue } from "./config";

export function checkPage(page: string): boolean {
    return window.location.href.includes(page);
}

export function checkPageRegex(regex: RegExp): string | null {
    let result = regex.exec(window.location.href);
    if (result == null) return null;
    return result[1];
}

export function dataURLtoFile(dataurl: string, filename: string) {
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

export function encodeImageFileAsURL(
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

export enum ApplyResult {
    Success,
    MustReapply,
    Failure
};

export async function applyAndHandleReapply(
    context: NSScript,
    reapply?: boolean,
): Promise<ApplyResult> {
    let payload: ApplyToWorldAssemblyFormData;
    if (reapply) {
        payload = {
            action: "join_UN",
            resend: "1",
        };
    } else {
        payload = {
            action: "join_UN",
            submit: "1",
        };
    }

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