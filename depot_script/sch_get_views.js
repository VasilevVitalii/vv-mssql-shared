//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const s = require('../shared')

exports.go = go

/**
 * views
 * @param {s.type_sql_object_name[]} [filter]
 * @param {boolean} [allow_size]
 * @returns {string}
 */
function go (filter, allow_size) {
    let beauty_filter = s.beautify_filter(filter, 's.name', 'v.name')

    let query_per_database = [
        "SELECT",
        "    {0} [database_name]",
        "    ,s.name [schema_name]",
        "    ,v.name [view_name]",
        "    ,prop_table.[value] [view_description]",
        allow_size === true ? "    ,p.[rows] [view_size_rows]" : "",
        allow_size === true ? "    ,SUM(a.total_pages) * 8 [view_size_total_space_kb]" : "",
        allow_size === true ? "    ,SUM(a.used_pages) * 8 [view_size_used_space_kb]" : "",
        "FROM {1}sys.views v",
        "LEFT JOIN {1}sys.schemas s ON v.schema_id = s.schema_id",
        allow_size === true ? "LEFT JOIN {1}sys.indexes i ON v.object_id = i.object_id" : "",
        allow_size === true ? "LEFT JOIN {1}sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id" : "",
        allow_size === true ? "LEFT JOIN {1}sys.allocation_units a ON p.partition_id = a.container_id" : "",
        "OUTER APPLY {1}sys.fn_listextendedproperty('MS_Description', 'SCHEMA', s.name, 'VIEW', v.name, null, null) prop_table",
        "{2}",
        allow_size === true ? "GROUP BY s.name, v.name, prop_table.[value], p.[rows]" : ""
    ].filter(f => !vvs.isEmptyString(f)).join(os.EOL)

    let query = beauty_filter.map(m => {
        return vvs.format(query_per_database, [m.query_dbname, m.query_db, vvs.isEmptyString(m.query_filter) ? "" : "".concat("WHERE ", m.query_filter)])
    }).join(os.EOL.concat('UNION ALL', os.EOL))

    return [
        "SELECT * FROM (",
        "",
        query,
        ") q ORDER BY [database_name], [schema_name], [view_name]"
    ].join(os.EOL)
}