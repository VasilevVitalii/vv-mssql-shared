//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const s = require('../shared')

exports.go = go

/**
 * get table list
 * @param {s.type_filter} [filter]
 * @param {boolean} [allow_size]
 * @returns {string}
 */
function go (filter, allow_size) {
    let beauty_filter = s.beautify_filter(filter)

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
        "WHERE 1 = 1",
        beauty_filter.schemas.length > 0 ? vvs.format("  AND s.name IN ('{0}')", beauty_filter.schemas.map(m => { return vvs.replaceAll(m, "'", "''")}).join("','") ) : "",
        beauty_filter.tables.length > 0 ? vvs.format("  AND t.name IN ('{0}')", beauty_filter.tables.map(m => { return vvs.replaceAll(m, "'", "''")}).join("','") ) : "",
        allow_size === true ? "GROUP BY s.name, t.name, prop_table.[value], p.[rows]" : "",
    ].filter(f => !vvs.isEmptyString(f)).join(os.EOL)

    if (beauty_filter.bases.length > 0) {
        return beauty_filter.bases.map(m => {
            return vvs.format(query_per_database, ["'".concat(vvs.replaceAll(m, "'", "''"), "'"), "[".concat(m, "].") ])
        }).join(os.EOL.concat('UNION ALL', os.EOL))
    } else {
        return vvs.format(query_per_database, ['DB_NAME()', ''])
    }
}