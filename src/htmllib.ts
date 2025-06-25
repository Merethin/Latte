export function getElement(id: string) {
    return document.getElementById(id) as HTMLElement;
}

export function getButtonElement(id: string) {
    return document.getElementById(id) as HTMLButtonElement;
}

export function getInputElement(id: string) {
    return document.getElementById(id) as HTMLInputElement;
}

export function setText(id: string, text: string) {
    getElement(id).innerText = text;
}

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

export function toggleElementDisplay(element: HTMLElement, toggle: HTMLButtonElement, label: string) {
    if (element.style.display === "none") {
        element.style.display = "block";
        toggle.innerText = `Hide ${label}`;
    } else {
        element.style.display = "none";
        toggle.innerText = `Show ${label}`;
    }
}

export function injectWarning(warning: string) {
    let html = `<p class="error">${warning}</p>`
    let container = document.createElement("div");
    container.innerHTML = html;
    const content = document.getElementById("content") as HTMLElement;
    content.prepend(container);
}

export function injectUserAgentWarning() {
    injectWarning("You have not set a User Agent! Latte keybinds and other functionality will not work until you do so <a href='page=blank/latte=settings'>here</a>.");
}