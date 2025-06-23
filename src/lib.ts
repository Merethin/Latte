export function checkPage(page: string): boolean {
    return window.location.href.includes(page);
}

export function checkPageRegex(regex: RegExp): string | null {
    let result = regex.exec(window.location.href);
    if (result == null) return null;
    return result[1];
}

export function normalize(name: string): string {
    return name.toLowerCase().replace(/ /g, "_");
}

export function loadSwitchers(): Array<string> {
    var switchers = new Array();
    let switcherJSON: string | null = GM_getValue("switchers");
    if(switcherJSON != null) {
        switchers = JSON.parse(switcherJSON);
    }
    return switchers;
}

export function loadQuiver(): Record<string, string> {
    var quiver: Record<string, string> = {};
    let quiverJSON: string | null = GM_getValue("quiver");
    if(quiverJSON != null) {
        quiver = JSON.parse(quiverJSON);
    }
    return quiver;
}

export function saveQuiver(quiver: Record<string, string>): void {
    let quiverJSON: string = JSON.stringify(quiver);
    GM_setValue("quiver", quiverJSON);
}