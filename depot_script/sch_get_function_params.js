//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const s = require('../shared')

exports.go = go

/**
 * input params for scalar and table functions
 * @param {s.type_sql_object_name[]} [filter]
 * @returns {string}
 */
function go (filter) {
    let beauty_filter = s.beautify_filter(filter, 's.name', 'o.name')

    let query_per_database = [
        "SELECT",
        "     {0} [database_name]",
        "    ,s.name [schema_name]",
        "    ,o.name [function_name]",
        "    ,p.ORDINAL_POSITION [function_param_position]",
        "    ,CASE WHEN LEFT(p.PARAMETER_NAME,1) = '@' THEN SUBSTRING(p.PARAMETER_NAME,2,LEN(p.PARAMETER_NAME)-1) ELSE p.PARAMETER_NAME END [function_param_name]",
        "    ,p.DATA_TYPE [function_param_type]",
        "    ,p.CHARACTER_MAXIMUM_LENGTH [function_param_len_chars]",
        "    ,p.NUMERIC_PRECISION [function_param_precision]",
        "    ,p.NUMERIC_SCALE [function_param_scale]",
        "FROM {1}sys.objects o WITH (NOLOCK)",
        "JOIN {1}sys.schemas s WITH (NOLOCK) ON s.[schema_id] = o.[schema_id]",
        "LEFT JOIN {1}INFORMATION_SCHEMA.PARAMETERS p WITH (NOLOCK) ON p.SPECIFIC_SCHEMA = s.name AND p.SPECIFIC_NAME = o.name AND p.IS_RESULT = 'NO'",
        "WHERE o.[type] IN ('FN','IF','TF')",
        "{2}",
    ].filter(f => !vvs.isEmptyString(f)).join(os.EOL)

    let query =  beauty_filter.map(m => {
        return vvs.format(query_per_database, [m.query_dbname, m.query_db, vvs.isEmptyString(m.query_filter) ? "" : "".concat("AND ", m.query_filter)])
    }).join(os.EOL.concat('UNION ALL', os.EOL))

    return [
        "SELECT * FROM (",
        "",
        query,
        ") q ORDER BY [database_name], [schema_name], [function_name], [function_param_position]"
    ].join(os.EOL)
}
