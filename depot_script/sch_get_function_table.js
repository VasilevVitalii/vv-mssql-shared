//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const s = require('../shared')

exports.go = go

/**
 * table functions
 * @param {s.type_sql_object_name[]} [filter]
 * @returns {string}
 */
function go (filter) {
    let beauty_filter = s.beautify_filter(filter, 's.name', 'o.name')

    let query_per_database = [
        "SELECT",
        "    {0} [database_name]",
        "    ,s.name [schema_name]",
        "    ,o.name [function_table_name]",
        "    ,CONVERT(NVARCHAR(MAX),prop_func.[value]) [function_table_description]",
        "    ,CASE WHEN o.[type] = 'IF' THEN 1 ELSE 0 END [function_table_inline]",
        "FROM {1}sys.objects o WITH (NOLOCK)",
        "JOIN {1}sys.schemas s WITH (NOLOCK) ON s.[schema_id] = o.[schema_id]",
        "OUTER APPLY {1}sys.fn_listextendedproperty('MS_Description', 'SCHEMA', s.name, 'FUNCTION', o.name, null, null) prop_func",
        "WHERE o.[type] IN ('IF','TF')",
        "{2}",
    ].filter(f => !vvs.isEmptyString(f)).join(os.EOL)

    let query = beauty_filter.map(m => {
        return vvs.format(query_per_database, [m.query_dbname, m.query_db, vvs.isEmptyString(m.query_filter) ? "" : "".concat("WHERE ", m.query_filter)])
    }).join(os.EOL.concat('UNION ALL', os.EOL, os.EOL))

    return [
        "SELECT * FROM (",
        "",
        query,
        ") q ORDER BY [database_name], [schema_name], [function_table_name]"
    ].join(os.EOL)
}