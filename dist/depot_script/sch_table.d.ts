/**
 * create table or update table columns
 * @param {string} schema
 * @param {string} name
 * @param {string} description
 * @param {index.type_column[]} column_list
 * @param {'ignore'|'error'} exist_unknown_field
 * @returns {string}
 */
export function go(schema: string, name: string, description: string, column_list: index.type_column[], exist_unknown_field: 'ignore' | 'error'): string;
import index = require("../index.js");
