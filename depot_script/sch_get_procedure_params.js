//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const s = require('../shared')

exports.go = go

/**
 * stored procedure input parameters
 * @param {s.type_sql_object_name[]} [filter]
 * @returns {string}
 */
function go (filter) {
    let beauty_filter = s.beautify_filter(filter, 's.name', 'p.name')

    let query_per_database = [
        "SELECT ",
        "	 {0} [database_name]",
        "	,s.name [schema_name]",
        "	,p.name [procedure_name]",
        "	,CASE WHEN LEFT(p2.PARAMETER_NAME,1) = '@' THEN SUBSTRING(p2.PARAMETER_NAME,2,LEN(p2.PARAMETER_NAME)-1) ELSE p2.PARAMETER_NAME END [procedure_param_name]",
        "	,p2.ORDINAL_POSITION [procedure_param_position]",
        "	,p2.PARAMETER_MODE [procedure_param_mode]",
        "	--,'???' [procedure_param_nullable]",
        "	--,'???' [procedure_param_default]",
        "	,p2.DATA_TYPE [procedure_param_type]",
        "	,p2.CHARACTER_MAXIMUM_LENGTH [procedure_param_len_chars]",
        "	,p2.NUMERIC_PRECISION [procedure_param_precision]",
        "	,p2.NUMERIC_SCALE [procedure_param_scale]",
        "FROM {1}sys.procedures p WITH (NOLOCK)",
        "JOIN {1}sys.schemas s WITH (NOLOCK) ON p.schema_id = s.schema_id",
        "JOIN {1}INFORMATION_SCHEMA.PARAMETERS p2 WITH (NOLOCK) ON p2.SPECIFIC_SCHEMA = s.name AND p2.SPECIFIC_NAME = p.name",
        "{2}"
    ].filter(f => !vvs.isEmptyString(f)).join(os.EOL)

    let query =  beauty_filter.map(m => {
        return vvs.format(query_per_database, [m.query_dbname, m.query_db, vvs.isEmptyString(m.query_filter) ? "" : "".concat("WHERE ", m.query_filter)])
    }).join(os.EOL.concat('UNION ALL', os.EOL))

    return [
        "SELECT * FROM (",
        "",
        query,
        ") q ORDER BY [database_name], [schema_name], [procedure_name], [procedure_param_position]"
    ].join(os.EOL)
}
