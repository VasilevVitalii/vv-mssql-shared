export type type_format_declare = {
    len: 'none' | 'one_number' | 'two_numbers' | 'one_number_or_max';
    max_first_number?: number;
    max_second_number?: number;
};
/**
 * description for declare format by sql types
 * @static
 * @param {index.sqltype} type
 * @returns {type_format_declare}
 */
export function go(type: index.sqltype): type_format_declare;
import index = require("../index.js");
