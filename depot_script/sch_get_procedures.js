//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const s = require('../shared')

exports.go = go

/**
 * get table list
 * @param {s.type_sql_object_name[]} [filter]
 * @returns {string}
 */
function go (filter) {
    let beauty_filter = s.beautify_filter(filter, 's.name', 'p.name')

    let query_per_database = [
        "SELECT",
        "    {0} [database_name]",
        "    ,s.name [schema_name]",
        "    ,p.name [procedure_name]",
        "    ,prop_proc.[value] [procedure_description]",
        "FROM {1}sys.procedures p",
        "LEFT JOIN {1}sys.schemas s ON p.schema_id = s.schema_id",
        "OUTER APPLY {1}sys.fn_listextendedproperty('MS_Description', 'SCHEMA', s.name, 'PROCEDURE', p.name, null, null) prop_proc",
        "{2}",
    ].filter(f => !vvs.isEmptyString(f)).join(os.EOL)

    return beauty_filter.map(m => {
        return vvs.format(query_per_database, [m.query_dbname, m.query_db, vvs.isEmptyString(m.query_filter) ? "" : "".concat("WHERE ", m.query_filter)])
    }).join(os.EOL.concat('UNION ALL', os.EOL))
}