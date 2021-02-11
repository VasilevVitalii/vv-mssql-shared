export type type_column_link = {
    child_column: string;
    parent_column: string;
};
/**
 * @typedef type_column_link
 * @property {string} child_column
 * @property {string} parent_column
 */ /**
* create foreign key
* @param {string} child_schema
* @param {string} child_table
* @param {string} parent_schema
* @param {string} parent_table
* @param {type_column_link[]} column_list
* @param {'no_action'|'cascade'|'set_null'|'set_default'} rule_update
* @param {'no_action'|'cascade'|'set_null'|'set_default'} rule_delete
* @return {string}
*/
export function go(child_schema: string, child_table: string, parent_schema: string, parent_table: string, column_list: type_column_link[], rule_update: 'no_action' | 'cascade' | 'set_null' | 'set_default', rule_delete: 'no_action' | 'cascade' | 'set_null' | 'set_default'): string;
