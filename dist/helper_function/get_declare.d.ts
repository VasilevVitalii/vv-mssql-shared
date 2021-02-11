export type type_get_declare = {
    sql: string;
    type: string;
    type_sql: index.type_sql;
    len_chars: number;
};
/**
 * generate declaration script with sql type
 * @static
 * @param {index.sqltype|'guid'|'udt'|'variant'} type
 * @param {number} precision
 * @param {number} scale
 * @param {number|'max'} len
 * @param {'char'|'byte'} type_len
 * @returns {type_get_declare}
 */
export function go(type: index.sqltype | 'guid' | 'udt' | 'variant', precision: number, scale: number, len: number | 'max', type_len: 'char' | 'byte'): type_get_declare;
import index = require("../index.js");
