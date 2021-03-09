//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const s = require('../shared')

exports.go = go

/**
 * column list for result table functions
 * @param {s.type_sql_object_name[]} [filter]
 * @returns {string}
 */
function go (filter) {

    let beauty_filter = s.beautify_filter(filter, 's.[name]', 'o.[name]')

    let query_per_database = [
        "SELECT",
        "     {0} [database_name]",
        "    ,s.name [schema_name]",
        "    ,o.name [function_table_name]",
        "    ,rc.ORDINAL_POSITION [function_table_column_position]",
        "    ,rc.COLUMN_NAME [function_table_column_name]",
        "    ,rc.DATA_TYPE [function_table_column_type]",
        "    ,rc.CHARACTER_MAXIMUM_LENGTH [function_table_column_len_chars]",
        "    ,rc.NUMERIC_PRECISION [function_table_column_precision]",
        "    ,rc.NUMERIC_SCALE [function_table_column_scale]",
        "FROM sys.objects o ",
        "JOIN sys.schemas s ON s.[schema_id] = o.[schema_id]",
        "LEFT JOIN INFORMATION_SCHEMA.ROUTINE_COLUMNS rc ON rc.TABLE_SCHEMA = s.name AND rc.TABLE_NAME = o.name --AND p.IS_RESULT = 'YES'",
        "WHERE o.[type] IN ('IF','TF')",
        "{2}",
    ].filter(f => !vvs.isEmptyString(f)).join(os.EOL)

    let query = beauty_filter.map(m => {
        return vvs.format(query_per_database, [m.query_dbname, m.query_db, vvs.isEmptyString(m.query_filter) ? "" : "".concat("WHERE ", m.query_filter)])
    }).join(os.EOL.concat('UNION ALL', os.EOL))

    return [
        "SELECT * FROM (",
        "",
        query,
        ") q ORDER BY [database_name], [schema_name], [function_table_name], [function_table_column_position]"
    ].join(os.EOL)
}