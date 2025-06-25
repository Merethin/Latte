/// <reference types="tampermonkey" />

export function readConfigValue<Type>(key: string): Type | null {
    return GM_getValue(key) as Type | null;
}

export function getConfigValue<Type>(key: string, defaultValue: Type): Type {
    let value: Type | null = GM_getValue(key);
    if(value == null) {
        return defaultValue;
    }
    return value;
}

export function setConfigValue<Type>(key: string, value: Type): void {
    GM_setValue(key, value);
}

export function readConfigList(key: string): Array<string> {
    var list = new Array();
    let listJSON: string | null = GM_getValue(key);
    if(listJSON != null) list = JSON.parse(listJSON);
    return list;
}

export function saveConfigList(key: string, list: Array<string>): void {
    let listJSON: string = JSON.stringify(list);
    GM_setValue(key, listJSON);
}

export function readConfigRecord(key: string): Record<string, string> {
    var record: Record<string, string> = {};
    let recordJSON: string | null = GM_getValue(key);
    if(recordJSON != null) record = JSON.parse(recordJSON);
    return record;
}

export function saveConfigRecord(key: string, record: Record<string, string>): void {
    let recordJSON: string = JSON.stringify(record);
    GM_setValue(key, recordJSON);
}