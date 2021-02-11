export type type_sql_object_name = {
    base?: string;
    schema?: string;
    object?: string;
};
export type type_beauty_filter = {
    base: string;
    child: type_beauty_filter_child[];
    query_filter: string;
    query_dbname: string;
    query_db: string;
};
export type type_beauty_filter_child = {
    schema: string;
    table: string;
};
/**
 * @typedef type_sql_object_name
 * @property {string} [base]
 * @property {string} [schema]
 * @property {string} [object]
 */
/**
 * @typedef type_beauty_filter
 * @property {string} base
 * @property {type_beauty_filter_child[]} child
 * @property {string} query_filter
 * @property {string} query_dbname
 * @property {string} query_db
 */
/**
 * @typedef type_beauty_filter_child
 * @property {string} schema
 * @property {string} table
 */
/**
 * @param {string} val
 * @param {boolean} [no_bracket]
 */
export function quote(val: string, no_bracket?: boolean): any;
/**
 * @param {type_sql_object_name[]} filter
 * @param {string} shema_field_name
 * @param {string} table_field_name
 * @returns {type_beauty_filter[]}
 */
export function beautify_filter(filter: type_sql_object_name[], shema_field_name: string, table_field_name: string): type_beauty_filter[];
