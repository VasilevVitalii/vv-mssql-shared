export var helper_get_types_sql: typeof import("./helper_function/get_types_sql.js").go;
export var helper_get_declare: typeof import("./helper_function/get_declare.js").go;
export var helper_format_declare: typeof import("./helper_function/format_declare.js").go;
export var helper_js_to_sql: typeof import("./helper_function/js_to_sql.js").go;
export var helper_from_object_to_type_column: typeof import("./helper_function/from_object_to_type_column.js").go;
export var helper_parse_object_name: typeof import("./helper_function/parse_object_name.js").go;
export var depot_server_info: typeof import("./depot_script/server_info.js").go;
export var depot_lock_sp_getapplock: typeof import("./depot_script/lock_sp_getapplock.js").go;
export var depot_lock_sp_releaseapplock: typeof import("./depot_script/lock_sp_releaseapplock.js").go;
export var depot_sch_description: typeof import("./depot_script/sch_description.js").go;
export var depot_sch_foreign: typeof import("./depot_script/sch_foreign.js").go;
export var depot_sch_schema: typeof import("./depot_script/sch_schema.js").go;
export var depot_sch_table: typeof import("./depot_script/sch_table.js").go;
export var depot_sch_get_databases: typeof import("./depot_script/sch_get_databases.js").go;
export var depot_sch_get_tables: typeof import("./depot_script/sch_get_tables.js").go;
export var depot_sch_get_views: typeof import("./depot_script/sch_get_views.js").go;
export var depot_sch_get_columns: typeof import("./depot_script/sch_get_columns.js").go;
export var depot_sch_get_foreign: typeof import("./depot_script/sch_get_foreign.js").go;
export var depot_sch_get_procedures: typeof import("./depot_script/sch_get_procedures.js").go;
export var depot_sch_get_procedure_params: typeof import("./depot_script/sch_get_procedure_params.js").go;
export var depot_sch_get_function_scalar: typeof import("./depot_script/sch_get_function_scalar.js").go;
export var depot_sch_get_function_table: typeof import("./depot_script/sch_get_function_table.js").go;
export var depot_sch_get_function_params: typeof import("./depot_script/sch_get_function_params.js").go;
export var depot_sch_get_function_table_columns: typeof import("./depot_script/sch_get_function_table_columns.js").go;
/**
 * MS SQL datatype
 */
export type sqltype = 'bigint' | 'bit' | 'decimal' | 'int' | 'money' | 'numeric' | 'smallint' | 'smallmoney' | 'tinyint' | 'float' | 'real' | 'date' | 'datetime2' | 'datetime' | 'datetimeoffset' | 'smalldatetime' | 'time' | 'char' | 'text' | 'varchar' | 'sysname' | 'nchar' | 'ntext' | 'nvarchar' | 'binary' | 'image' | 'varbinary' | 'hierarchyid' | 'sql_variant' | 'xml' | 'uniqueidentifier' | 'timestamp' | 'geometry' | 'geography';
export type type_sql_object_name = s.type_sql_object_name;
/**
 * MS SQL tables column
 */
export type type_column = {
    name: string;
    type: sqltype;
    len_chars?: number | 'max';
    precision?: number;
    scale?: number;
    nullable?: boolean;
    identity_seed?: number;
    identity_increment?: number;
    pk_position?: number;
    description?: string;
    collate?: string;
};
/**
 * MS SQL datatype params
 */
export type type_sql = {
    precision: 'deny' | 'allow' | number;
    scale: 'deny' | 'allow' | number;
    len: 'deny' | 'allow' | 'deny_max' | number;
    jstype: 'number' | 'Date' | 'string';
    xsdtype: 'xs:integer' | 'xs:decimal' | 'xs:boolean' | 'xs:date' | 'xs:dateTime' | 'xs:time' | 'xs:string';
    bytes_on_char: number;
    type: sqltype;
};
import s = require("./shared.js");
