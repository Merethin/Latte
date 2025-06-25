/* keybinds.ts - list of all keybinds and functions to query and set them */

import { getConfigValue, setConfigValue } from "./config";

/**
 * Stores a keybind's key (name), default value (key) and label (text description).
 */
export type Keybind = {
    key: string;
    defaultValue: string;
    label: string;
}

/**
 * A list of all keybinds in the script, along with their default values.
 */
export const keybinds: Record<string, Keybind> = {
    refresh: {key: "refresh", defaultValue: "A", label: "Refresh Page"},
    reauth: {key: "reauth", defaultValue: "J", label: "Update Auth"},
    endo: {key: "endo", defaultValue: "S", label: "Endorse Nation"},
    unendo: {key: "unendo", defaultValue: "L", label: "Unendorse Nation"},
    joinwa: {key: "joinwa", defaultValue: "R", label: "Join WA"},
    move: {key: "move", defaultValue: "F", label: "Move to Region"},
    jpmove: {key: "jpmove", defaultValue: "B", label: "Move to Jump Point"},
    apply: {key: "apply", defaultValue: "H", label: "Apply to WA"},
    resign: {key: "resign", defaultValue: "E", label: "Resign from WA"},
    region: {key: "region", defaultValue: "Z", label: "Show Current Region"},
    nation: {key: "nation", defaultValue: "X", label: "Copy Current Nation"},
    ro: {key: "ro", defaultValue: "D", label: "Appoint RO"},
    prep: {key: "prep", defaultValue: "P", label: "Prep Switchers"},
    tag: {key: "tag", defaultValue: "T", label: "Tag Regions"},
}

/**
 * Gets the current value of a keybind.
 * 
 * @param keybind The keybind to query.
 * @returns The keybind's configured value, or the default value if not configured.
 */
export function getKeybind(keybind: Keybind): string {
    return getConfigValue<string>(`keybind_${keybind.key}`, keybind.defaultValue);
}

/**
 * Gets the current value of a keybind, but lowercase (for mousetrap).
 * 
 * @param keybind The keybind to query.
 * @returns The keybind's configured value, or the default value if not configured.
 */
export function loadKeybind(keybind: Keybind): string {
    return getKeybind(keybind).toLowerCase();
}

/**
 * Sets a keybind's value.
 * 
 * @param keybind The keybind to update.
 * @param value The value to give that keybind.
 */
export function setKeybind(keybind: Keybind, value: string): void {
    setConfigValue(`keybind_${keybind.key}`, value);
}