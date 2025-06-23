export function setupQuiverPage() {
    var quiver = new Array();
    let quiverJSON: string | null = GM_getValue("quiver");
    if(quiverJSON != null) {
        quiver = JSON.parse(quiverJSON);
    }

    // Painfully unfinished
}