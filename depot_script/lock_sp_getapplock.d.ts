/**
 * exec sp_getapplock
 * @param {string} key name lock
 * @param {number} wait in msec, wait for free key, if 0, without wait
 * @param {string} [database] name database
 * @returns {string}
 */
export function go(key: string, wait: number, database?: string): string;
