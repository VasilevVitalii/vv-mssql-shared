//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const s = require('../shared')

exports.go = go

/**
 * get column list
 * @param {s.type_sql_object_name[]} [filter]
 * @returns {string}
 */
function go (filter) {

    let beauty_filter = s.beautify_filter(filter, 'c.[TABLE_SCHEMA]', 'c.[TABLE_NAME]')

    let query_per_database = [
        "SELECT",
        "     {0} [database_name]",
        "    ,c.[TABLE_SCHEMA] [schema_name]",
        "    ,c.[TABLE_NAME] [table_name]",
        "    ,c.[COLUMN_NAME] [column_name]",
        "    ,prop_column.[value] [column_description]",
        "    ,c.[ORDINAL_POSITION] [column_position]",
        "    ,pk.[ORDINAL_POSITION] [column_pk_position]",
        "    ,CASE WHEN c.[IS_NULLABLE] = 'YES' THEN 1 ELSE 0 END [column_pk_nullable]",
        "    ,c.[COLUMN_DEFAULT] [column_default]",
        "    ,c.[DATA_TYPE] [column_type]",
        "    ,c.[CHARACTER_MAXIMUM_LENGTH] [column_len_chars]",
        "    ,c.[NUMERIC_PRECISION] [column_precision]",
        "    ,c.[NUMERIC_SCALE] [column_scale]",
        "    ,idc.seed_value [column_identity_seed]",
        "    ,idc.seed_value [column_identity_increment]",
        "    ,idc.last_value [column_identity_last]",
        "FROM {1}INFORMATION_SCHEMA.[COLUMNS] c",
        "OUTER APPLY {1}sys.fn_listextendedproperty('MS_Description', 'SCHEMA', c.TABLE_SCHEMA, 'TABLE', c.TABLE_NAME, 'COLUMN', c.COLUMN_NAME) prop_column",
        "LEFT JOIN (",
        "    SELECT tc.[TABLE_SCHEMA], tc.[TABLE_NAME], kcu.[COLUMN_NAME], kcu.[ORDINAL_POSITION]",
        "    FROM {1}INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc",
        "    JOIN {1}INFORMATION_SCHEMA.[KEY_COLUMN_USAGE] kcu ON kcu.[TABLE_SCHEMA] =  tc.[TABLE_SCHEMA] AND kcu.[TABLE_NAME] =  tc.[TABLE_NAME] AND tc.[CONSTRAINT_NAME] = kcu.[CONSTRAINT_NAME]",
        "    WHERE tc.[CONSTRAINT_TYPE] = 'PRIMARY KEY'",
        ") pk ON pk.[TABLE_SCHEMA] = c.[TABLE_SCHEMA] AND pk.[TABLE_NAME] = c.[TABLE_NAME] AND pk.[COLUMN_NAME] = c.[COLUMN_NAME]",
        "LEFT JOIN (",
        "    SELECT OBJECT_NAME(Object_id) [TABLE], OBJECT_SCHEMA_NAME(Object_id) [SCHEMA], [name], [seed_value], [increment_value], [last_value]",
        "    FROM {1}sys.identity_columns",
        ") idc ON idc.[TABLE] = c.[TABLE_NAME] AND idc.[SCHEMA] = c.[TABLE_SCHEMA] AND idc.[name] = c.[COLUMN_NAME]",
        "{2}",
    ].filter(f => !vvs.isEmptyString(f)).join(os.EOL)

    return beauty_filter.map(m => {
        return vvs.format(query_per_database, [m.query_dbname, m.query_db, vvs.isEmptyString(m.query_filter) ? "" : "".concat("WHERE ", m.query_filter)])
    }).join(os.EOL.concat('UNION ALL', os.EOL))
}