//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const s = require('../shared')

exports.go = go

/**
 * scalar functions with result
 * @param {s.type_sql_object_name[]} [filter]
 * @returns {string}
 */
function go (filter) {
    let beauty_filter = s.beautify_filter(filter, 's.name', 'o.name')

    let query_per_database = [
        "SELECT",
        "    {0} [database_name]",
        "    ,s.name [schema_name]",
        "    ,o.name [function_scalar_name]",
        "    ,prop_func.[value] [function_scalar_description]",
        "    ,p.DATA_TYPE [function_scalar_type]",
        "    ,p.CHARACTER_MAXIMUM_LENGTH [function_scalar_len_chars]",
        "    ,p.NUMERIC_PRECISION [function_scalar_precision]",
        "    ,p.NUMERIC_SCALE [function_scalar_scale]",
        "FROM {1}sys.objects o WITH (NOLOCK)",
        "JOIN {1}sys.schemas s WITH (NOLOCK) ON s.[schema_id] = o.[schema_id]",
        "LEFT JOIN {1}INFORMATION_SCHEMA.PARAMETERS p WITH (NOLOCK) ON p.SPECIFIC_SCHEMA = s.name AND p.SPECIFIC_NAME = o.name AND p.IS_RESULT = 'YES'",
        "OUTER APPLY {1}sys.fn_listextendedproperty('MS_Description', 'SCHEMA', s.name, 'FUNCTION', o.name, null, null) prop_func",
        "WHERE o.[type] = 'FN'",
        "{2}",
    ].filter(f => !vvs.isEmptyString(f)).join(os.EOL)

    let query = beauty_filter.map(m => {
        return vvs.format(query_per_database, [m.query_dbname, m.query_db, vvs.isEmptyString(m.query_filter) ? "" : "".concat("WHERE ", m.query_filter)])
    }).join(os.EOL.concat('UNION ALL', os.EOL, os.EOL))

    return [
        "SELECT * FROM (",
        "",
        query,
        ") q ORDER BY [database_name], [schema_name], [function_scalar_name]"
    ].join(os.EOL)
}