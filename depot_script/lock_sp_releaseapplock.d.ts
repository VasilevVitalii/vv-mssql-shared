/**
 * exec sp_releaseapplock
 * @param {string} key name lock
 * @param {string} [database] name database
 * @returns {string}
 */
export function go(key: string, database?: string): string;
