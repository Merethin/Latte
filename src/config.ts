/* config.ts - functions to load and save script configuration in various types. */

/**
 * Reads a value of a specific type from the script's configuration.
 * 
 * @param key The key to fetch the value from.
 * @returns If the key exists, returns its value. Otherwise, returns null.
 */
export function readConfigValue<Type>(key: string): Type | null {
    return GM_getValue(key) as Type | null;
}

/**
 * Reads a value of a specific type from the script's configuration.
 * 
 * @param key The key to fetch the value from.
 * @param defaultValue The value to return if the key does not exist.
 * @returns If the key exists, returns its value. Otherwise, returns defaultValue.
 */
export function getConfigValue<Type>(key: string, defaultValue: Type): Type {
    let value: Type | null = GM_getValue(key);
    if(value == null) {
        return defaultValue;
    }
    return value;
}

/**
 * Save a value to the script's configuration.
 * 
 * @param key The key to store the value under.
 * @param value The value to store.
 */
export function setConfigValue<Type>(key: string, value: Type): void {
    GM_setValue(key, value);
}

/**
 * Reads an array of strings from the script's configuration.
 * This assumes that the value saved under that key is an array.
 * Up to you to guarantee that.
 * 
 * Bad design? Perhaps, but it's sufficient for Latte, since each setting
 * is either always an array or never one.
 * 
 * @param key The key to fetch the array from.
 * @returns If the array exists, returns it. Otherwise, returns an empty array.
 */
export function readConfigList(key: string): Array<string> {
    var list = new Array();
    let listJSON: string | null = GM_getValue(key);
    if(listJSON != null) list = JSON.parse(listJSON);
    return list;
}

/**
 * Store an array of strings into the script's configuration.
 * 
 * @param key The key to store the array under.
 * @param list The array to store. 
 */
export function saveConfigList(key: string, list: Array<string>): void {
    let listJSON: string = JSON.stringify(list);
    GM_setValue(key, listJSON);
}

/**
 * Reads a record of strings from the script's configuration.
 * This assumes that the value saved under that key is a record/map.
 * Up to you to guarantee that.
 * 
 * Bad design? Perhaps, but it's sufficient for Latte, since each setting
 * is either always an array or never one.
 * 
 * @param key The key to fetch the record from.
 * @returns If the record exists, returns it. Otherwise, returns an empty record.
 */
export function readConfigRecord(key: string): Record<string, string> {
    var record: Record<string, string> = {};
    let recordJSON: string | null = GM_getValue(key);
    if(recordJSON != null) record = JSON.parse(recordJSON);
    return record;
}

/**
 * Store a record of strings into the script's configuration.
 * 
 * @param key The key to store the record under.
 * @param list The record to store. 
 */
export function saveConfigRecord(key: string, record: Record<string, string>): void {
    let recordJSON: string = JSON.stringify(record);
    GM_setValue(key, recordJSON);
}