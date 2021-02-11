/**
 * @param {Object} object
 * @param {index.sqltype|'guid'} sql_type
 * @param {boolean} [empty_to_null] for types nvarchar,nchar,xml,char,sysname,varchar; default true
 * @returns {string}
 */
export function go(object: any, sql_type: index.sqltype | 'guid', empty_to_null?: boolean): string;
import index = require("../index.js");
