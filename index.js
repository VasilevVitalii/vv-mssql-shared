//@ts-check

let s = require('./shared.js')

/**
 * MS SQL datatype
 * @typedef {'bigint'|'bit'|'decimal'|'int'|'money'|'numeric'|'smallint'|'smallmoney'|'tinyint'|'float'|'real'|'date'|'datetime2'|'datetime'|'datetimeoffset'|'smalldatetime'|'time'|'char'|'text'|'varchar'|'sysname'|'nchar'|'ntext'|'nvarchar'|'binary'|'image'|'varbinary'|'hierarchyid'|'sql_variant'|'xml'|'uniqueidentifier'|'timestamp'|'geometry'|'geography'} sqltype
 */

/**
 * @typedef {s.type_sql_object_name} type_sql_object_name
 */

/**
 * MS SQL tables column
 * @typedef type_column
 * @property {string} name
 * @property {sqltype} type
 * @property {number|'max'} [len_chars]
 * @property {number} [precision]
 * @property {number} [scale]
 * @property {boolean} [nullable]
 * @property {number} [identity_seed]
 * @property {number} [identity_increment]
 * @property {number} [pk_position]
 * @property {string} [description]
 * @property {string} [collate]
 */

/**
 * MS SQL datatype params
 * @typedef type_sql
 * @property {'deny' | 'allow' | number} precision
 * @property {'deny' | 'allow' | number} scale
 * @property {'deny' | 'allow' | 'deny_max' | number} len
 * @property {'number' | 'Date' | 'string'} jstype
 * @property {'xs:integer' | 'xs:decimal' | 'xs:boolean' | 'xs:date' | 'xs:dateTime' | 'xs:time' | 'xs:string'} xsdtype
 * @property {number} bytes_on_char
 * @property {sqltype} type
 */

exports.helper_get_types_sql = require('./helper_function/get_types_sql.js').go
exports.helper_get_declare = require('./helper_function/get_declare.js').go
exports.helper_format_declare = require('./helper_function/format_declare.js').go
exports.helper_js_to_sql = require('./helper_function/js_to_sql.js').go
exports.helper_js_to_xml = require('./helper_function/js_to_xml.js').go
exports.helper_from_object_to_type_column = require('./helper_function/from_object_to_type_column.js').go
exports.helper_parse_object_name = require('./helper_function/parse_object_name.js').go

exports.depot_server_info = require('./depot_script/server_info.js').go
exports.depot_lock_sp_getapplock = require('./depot_script/lock_sp_getapplock.js').go
exports.depot_lock_sp_releaseapplock = require('./depot_script/lock_sp_releaseapplock.js').go
exports.depot_sch_description = require('./depot_script/sch_description.js').go
exports.depot_sch_foreign = require('./depot_script/sch_foreign.js').go
exports.depot_sch_schema = require('./depot_script/sch_schema.js').go
exports.depot_sch_table = require('./depot_script/sch_table.js').go
exports.depot_sch_get_databases = require('./depot_script/sch_get_databases.js').go
exports.depot_sch_get_tables = require('./depot_script/sch_get_tables.js').go
exports.depot_sch_get_views = require('./depot_script/sch_get_views.js').go
exports.depot_sch_get_columns = require('./depot_script/sch_get_columns.js').go
exports.depot_sch_get_foreign = require('./depot_script/sch_get_foreign.js').go
exports.depot_sch_get_procedures = require('./depot_script/sch_get_procedures.js').go
exports.depot_sch_get_procedure_params = require('./depot_script/sch_get_procedure_params.js').go
exports.depot_sch_get_function_scalar = require('./depot_script/sch_get_function_scalar.js').go
exports.depot_sch_get_function_table = require('./depot_script/sch_get_function_table.js').go
exports.depot_sch_get_function_params = require('./depot_script/sch_get_function_params.js').go
exports.depot_sch_get_function_table_columns = require('./depot_script/sch_get_function_table_columns.js').go