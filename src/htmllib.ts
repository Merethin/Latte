/* htmllib.ts - utility functions that manipulate/query the DOM. */

/**
 * Get a DOM element by id. The element must exist.
 * 
 * Less wordy shortcut for (document.getElementById(id) as HTMLElement).
 * 
 * @param id The id to look for.
 * @returns The element with said id.
 */
export function getElement(id: string) {
    return document.getElementById(id) as HTMLElement;
}

/**
 * Get a DOM button element by id. The element must exist and it must be a button.
 * 
 * Less wordy shortcut for (document.getElementById(id) as HTMLButtonElement).
 * 
 * @param id The id to look for.
 * @returns The button element with said id.
 */
export function getButtonElement(id: string) {
    return document.getElementById(id) as HTMLButtonElement;
}

/**
 * Get a DOM input element by id. The element must exist and it must be an input element.
 * 
 * Less wordy shortcut for (document.getElementById(id) as HTMLInputElement).
 * 
 * @param id The id to look for.
 * @returns The input element with said id.
 */
export function getInputElement(id: string) {
    return document.getElementById(id) as HTMLInputElement;
}

/**
 * Finds a DOM element by id and sets its inner text to a string. The element must exist.
 * 
 * Less wordy shortcut for (document.getElementById(id) as HTMLElement).innerText = text.
 * 
 * @param id The id to look for.
 * @param text The string to set the element's inner text to.
 */
export function setText(id: string, text: string) {
    getElement(id).innerText = text;
}

/**
 * Converts an HTML string into a list of DOM nodes.
 * 
 * This function will not work for nodes that need to inside a specific type of element,
 * like <tr> elements which need to be inside a <tbody>. For table elements specifically,
 * use createTableElementsFromHTML() instead.
 * 
 * @param htmlString The string to convert.
 * @returns The resulting DOM nodes.
 */
export function createElementsFromHTML(htmlString: string): NodeListOf<ChildNode> {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.childNodes;
}

/**
 * Converts an HTML string into a list of DOM nodes.
 * 
 * This function is only for strings of <tr> nodes. For other kinds of nodes,
 * use createElementsFromHTML() instead.
 * 
 * @param htmlString The string to convert.
 * @returns The resulting DOM nodes.
 */
export function createTableElementsFromHTML(htmlString: string): NodeListOf<ChildNode> {
    var tbody = document.createElement('tbody');
    tbody.innerHTML = htmlString.trim();
    return tbody.childNodes;
}

/**
 * Toggle the visibility of an element and update the label of an associated "toggle element".
 * 
 * @param element The element to toggle the visibility of.
 * @param toggle The element to toggle the label of.
 * @param label The label to use. If 'element' becomes hidden, toggle's text will be `Show ${label}`,
 * and if it becomes visible, it will be `Hide ${label}`.
 */
export function toggleElementDisplay(element: HTMLElement, toggle: HTMLButtonElement, label: string) {
    if (element.style.display === "none") {
        element.style.display = "block";
        toggle.innerText = `Hide ${label}`;
    } else {
        element.style.display = "none";
        toggle.innerText = `Show ${label}`;
    }
}

/**
 * Insert a NationStates-styled warning into the top of the page content.
 * 
 * @param warning The warning string to show.
 */
export function injectWarning(warning: string) {
    let html = `<p class="error">${warning}</p>`
    let container = document.createElement("div");
    container.innerHTML = html;
    const content = document.getElementById("content") as HTMLElement;
    content.prepend(container);
}

/**
 * Inject a warning into the top of the page content when the user has not yet configured a user agent.
 */
export function injectUserAgentWarning() {
    injectWarning("You have not set a User Agent! Latte keybinds and other functionality will not work until you do so <a href='page=blank/latte=settings'>here</a>.");
}