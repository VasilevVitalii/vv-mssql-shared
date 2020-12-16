//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const s = require('../shared')

exports.go = go

/**
 * get column list
 * @param {s.type_filter} [filter]
 * @returns {string}
 */
function go (filter) {

    let beauty_filter = s.beautify_filter(filter)

    let query_per_database = [
        "SELECT",
        "     {0} [database_name]",
        "    ,fk_schema.name [fk_child_schema_name]",
        "    ,fk_tab.name [fk_child_table_name]",
        "    ,fk_col.name [fk_child_column_name]",
        "    ,pk_schema.name [fk_parent_schema_name]",
        "    ,pk_tab.name [fk_parent_table_name]",
        "    ,pk_col.name [fk_parent_column_name]",
        "    ,fk_cols.constraint_column_id [fk_position]",
        "    ,fk.name [fk_name]",
        "    ,fk.delete_referential_action_desc [fk_delete_rule]",
        "    ,fk.update_referential_action_desc [fk_update_rule]",
        "FROM {1}sys.foreign_keys fk",
        "JOIN {1}sys.tables fk_tab ON fk_tab.object_id = fk.parent_object_id",
        "JOIN {1}sys.tables pk_tab ON pk_tab.object_id = fk.referenced_object_id",
        "JOIN {1}sys.schemas fk_schema ON fk_schema.[schema_id] = fk_tab.[schema_id]",
        "JOIN {1}sys.schemas pk_schema ON pk_schema.[schema_id] = pk_tab.[schema_id]",
        "JOIN {1}sys.foreign_key_columns fk_cols ON fk_cols.constraint_object_id = fk.object_id",
        "JOIN {1}sys.columns fk_col ON fk_col.column_id = fk_cols.parent_column_id AND fk_col.object_id = fk_tab.object_id",
        "JOIN {1}sys.columns pk_col ON pk_col.column_id = fk_cols.referenced_column_id AND pk_col.object_id = pk_tab.object_id",
        "WHERE 1 = 1",
        beauty_filter.schemas.length > 0 ? vvs.format("  AND (fk_schema.name IN ('{0}') OR pk_schema.name IN ('{0}'))", beauty_filter.schemas.map(m => { return vvs.replaceAll(m, "'", "''")}).join("','") ) : "",
        beauty_filter.tables.length > 0 ? vvs.format("  AND (fk_tab.name IN ('{0}') OR pk_tab.name IN ('{0}'))", beauty_filter.tables.map(m => { return vvs.replaceAll(m, "'", "''")}).join("','") ) : "",
    ].filter(f => !vvs.isEmptyString(f)).join(os.EOL)

    if (beauty_filter.bases.length > 0) {
        return beauty_filter.bases.map(m => {
            return vvs.format(query_per_database, ["'".concat(vvs.replaceAll(m, "'", "''"), "'"), "[".concat(m, "].") ])
        }).join(os.EOL.concat('UNION ALL', os.EOL))
    } else {
        return vvs.format(query_per_database, ['DB_NAME()', ''])
    }
}