//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const s = require('../shared')

exports.go = go

/**
 * get table list
 * @param {s.type_sql_object_name[]} [filter]
 * @param {boolean} [allow_size]
 * @returns {string}
 */
function go (filter, allow_size) {
    let beauty_filter = s.beautify_filter(filter, 's.name', 't.name')

    let query_per_database = [
        "SELECT",
        "    {0} [database_name]",
        "    ,s.name [schema_name]",
        "    ,t.name [table_name]",
        "    ,prop_table.[value] [table_description]",
        allow_size === true ? "    ,p.[rows] [table_size_rows]" : "",
        allow_size === true ? "    ,SUM(a.total_pages) * 8 [table_size_total_space_kb]" : "",
        allow_size === true ? "    ,SUM(a.used_pages) * 8 [table_size_used_space_kb]" : "",
        "FROM {1}sys.tables t",
        "LEFT JOIN {1}sys.schemas s ON t.schema_id = s.schema_id",
        allow_size === true ? "LEFT JOIN {1}sys.indexes i ON t.object_id = i.object_id" : "",
        allow_size === true ? "LEFT JOIN {1}sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id" : "",
        allow_size === true ? "LEFT JOIN {1}sys.allocation_units a ON p.partition_id = a.container_id" : "",
        "OUTER APPLY {1}sys.fn_listextendedproperty('MS_Description', 'SCHEMA', s.name, 'TABLE', t.name, null, null) prop_table",
        "{2}",
        allow_size === true ? "GROUP BY s.name, t.name, prop_table.[value], p.[rows]" : ""
    ].filter(f => !vvs.isEmptyString(f)).join(os.EOL)

    return beauty_filter.map(m => {
        return vvs.format(query_per_database, [m.query_dbname, m.query_db, vvs.isEmptyString(m.query_filter) ? "" : "".concat("WHERE ", m.query_filter)])
    }).join(os.EOL.concat('UNION ALL', os.EOL))

    // beauty_filter.forEach(base => {
    //     let where = []
    //     base.child.forEach(child => {
    //         if (vvs.isEmptyString())
    //         where.push(vvs)
    //     })
        
    // })

    // if (beauty_filter.bases.length > 0) {
    //     return beauty_filter.bases.map(m => {
    //         return vvs.format(query_per_database, ["'".concat(vvs.replaceAll(m, "'", "''"), "'"), "[".concat(m, "].") ])
    //     }).join(os.EOL.concat('UNION ALL', os.EOL))
    // } else {
    //     return vvs.format(query_per_database, ['DB_NAME()', ''])
    // }
}