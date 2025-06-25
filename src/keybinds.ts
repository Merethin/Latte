import { getConfigValue, setConfigValue } from "./config";

export type Keybind = {
    key: string;
    defaultValue: string;
    label: string;
}

export const keybinds: Record<string, Keybind> = {
    refresh: {key: "refresh", defaultValue: "A", label: "Refresh Page"},
    reauth: {key: "reauth", defaultValue: "J", label: "Update Auth"},
    endo: {key: "endo", defaultValue: "S", label: "Endorse Nation"},
    unendo: {key: "unendo", defaultValue: "L", label: "Unendorse Nation"},
    joinwa: {key: "joinwa", defaultValue: "R", label: "Confirm WA Join"},
    move: {key: "move", defaultValue: "F", label: "Move to Region"},
    jpmove: {key: "jpmove", defaultValue: "B", label: "Move to Jump Point"},
    apply: {key: "apply", defaultValue: "H", label: "Apply to WA"},
    resign: {key: "resign", defaultValue: "E", label: "Resign from WA"},
    region: {key: "region", defaultValue: "Z", label: "Show Current Region"},
    nation: {key: "nation", defaultValue: "X", label: "Copy Current Nation"},
    ro: {key: "ro", defaultValue: "D", label: "Appoint/Dismiss ROs"},
    prep: {key: "prep", defaultValue: "P", label: "Prep Switchers"},
    tag: {key: "tag", defaultValue: "T", label: "Tag Regions"},
}

export function getKeybind(keybind: Keybind): string {
    return getConfigValue<string>(`keybind_${keybind.key}`, keybind.defaultValue);
}

export function loadKeybind(keybind: Keybind): string {
    return getKeybind(keybind).toLowerCase();
}

export function setKeybind(keybind: Keybind, value: string): void {
    setConfigValue(`keybind_${keybind.key}`, value);
}