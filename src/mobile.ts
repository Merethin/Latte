/* mobile.ts - HTML page modifications for mobile tagging */

export function isMobile(): boolean {
    return window.matchMedia('(hover: none)').matches;
}

export function setupMobileMoveButton(region: string, script: string, version: string, author: string, userAgent: string): void {
    const localidElement = document.querySelector("input[name='localid']");
    if(localidElement == null) return;
    const localid = (localidElement as HTMLInputElement).value;
    let form = document.createElement("form");
    form.action = `/page=change_region?generated_by=${script}_${version}__by_${author}__usedBy_${userAgent}`;
    form.method = "post";
    form.innerHTML = `
    <input type='hidden' name='localid' value='${localid}'>
    <input type='hidden' name='region_name' value='${region}'>
    <button type='submit' name='move_region' value='1' style="width:100%;height:100px;color:red;">Move</button>
    `;
    document.querySelector("body")?.prepend(form);
}

export function setupMobileEndorseButton(nation: string, script: string, version: string, author: string, userAgent: string): void {
    const localidElement = document.querySelector("input[name='localid']");
    if(localidElement == null) return;
    const localid = (localidElement as HTMLInputElement).value;
    let form = document.createElement("form");
    form.action = `/cgi-bin/endorse.cgi?generated_by=${script}_${version}__by_${author}__usedBy_${userAgent}`;
    form.method = "post";
    form.innerHTML = `
    <input type='hidden' name='localid' value='${localid}'>
    <input type='hidden' name='nation' value='${nation}'>
    <input type='hidden' name='action' value='endorse'>
    <button type='submit' style="width:100%;height:100px;color:red;">Endorse</button>
    `;
    document.querySelector("body")?.prepend(form);
}