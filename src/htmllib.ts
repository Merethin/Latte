export function createElementsFromHTML(htmlString: string) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.childNodes;
}

export function createTableElementsFromHTML(htmlString: string) {
    var tbody = document.createElement('tbody');
    tbody.innerHTML = htmlString.trim();
    return tbody.childNodes;
}

export function toggleSwitcherListDisplay() {
    let switcherList = document.getElementById("swlist") as HTMLElement;
    let switcherToggle = document.getElementById("showswlist") as HTMLButtonElement;

    if (switcherList.style.display === "none") {
        switcherList.style.display = "block";
        switcherToggle.innerText = "Hide Switcher List";
    } else {
        switcherList.style.display = "none";
        switcherToggle.innerText = "Show Switcher List";
    }
}

export function injectWarning(warning: string) {
    let html = `<p class="error">${warning}</p>`
    let container = document.createElement("div");
    container.innerHTML = html;
    const content = document.getElementById("content") as HTMLElement;
    content.prepend(container);
}

export function injectUAWarning() {
    injectWarning("You have not set a User Agent! Latte keybinds and other functionality will not work until you do so <a href='page=blank/latte=settings'>here</a>.");
}