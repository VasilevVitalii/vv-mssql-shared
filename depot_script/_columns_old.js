//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const s = require('../shared')

exports.go = go

/**
 * get column list
 * @param {s.table[]} [tables]
 * @returns {string}
 */
function go (tables) {

    let schm = s.tables(tables)
    if (schm.databases.length <= 0) {
        schm.databases.push(undefined)
    }

    /** @type {string[]} */
    let query = []

    schm.databases.sort(s => vvs.isEmptyString(s) ? -1 : 1).forEach(database => {
        query.push(
            [
                vvs.isEmptyString(database) ? '' : "USE ".concat(vvs.border_add(database, "[", "]")),
                schm.tables.length > 0 ? [
                    ";with need_tables AS (",
                    schm.tables.filter(f => vvs.equal(f.base, database)) .map(m => {
                        return vvs.format("    SELECT '{0}' [schema], '{1}' [table]", [vvs.isEmptyString(m.schema) ? 'dbo' : m.schema, m.table])
                    }).join(" UNION ALL".concat(os.EOL)),
                    ")",
                ].join(os.EOL) : '',
                "SELECT",
                "    ISNULL(" + (vvs.isEmptyString(database) ? 'NULL' : vvs.border_add(s.quote(database, true),"'","'")) + ",DB_NAME()) [DATABASE],",
                "    c.[TABLE_SCHEMA] [SCHEMA],",
                "    c.[TABLE_NAME] [TABLE],",
                "    prop_table.[value] [TABLE_DESCRIPTION],",
                "    c.[COLUMN_NAME] [NAME],",
                "    prop_column.[value] [DESCRIPTION],",
                "    c.[ORDINAL_POSITION] [POSITION],",
                "    pk.[ORDINAL_POSITION] [PK_POSITION],",
                "    c.[IS_NULLABLE] [NULLABLE],",
                "    c.[COLUMN_DEFAULT] [DEFAULT],",
                "    c.[DATA_TYPE] [TYPE],",
                "    c.[CHARACTER_MAXIMUM_LENGTH] [LEN_CHARS],",
                "    c.[NUMERIC_PRECISION] [PRECISION],",
                "    c.[NUMERIC_SCALE] [SCALE],",
                "    idc.seed_value [IDENTITY_SEED],",
                "    idc.seed_value [IDENTITY_INCREMENT],",
                "    idc.last_value [IDENTITY_LAST]",
                "FROM INFORMATION_SCHEMA.[COLUMNS] c",
                schm.tables.length > 0 ? "JOIN need_tables n ON n.[schema] = c.[TABLE_SCHEMA] AND n.[table] = c.[TABLE_NAME]" : '',
                "OUTER APPLY fn_listextendedproperty(default, 'SCHEMA', c.TABLE_SCHEMA, 'TABLE', c.TABLE_NAME, null, null) prop_table",
                "OUTER APPLY fn_listextendedproperty(default, 'SCHEMA', c.TABLE_SCHEMA, 'TABLE', c.TABLE_NAME, 'COLUMN', c.COLUMN_NAME) prop_column",
                "LEFT JOIN (",
                "    SELECT tc.[TABLE_SCHEMA], tc.[TABLE_NAME], kcu.[COLUMN_NAME], kcu.[ORDINAL_POSITION]",
                "    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc",
                schm.tables.length > 0 ? "    JOIN need_tables n ON n.[schema] = tc.[TABLE_SCHEMA] AND n.[table] = tc.[TABLE_NAME]" : '',
                "    JOIN INFORMATION_SCHEMA.[KEY_COLUMN_USAGE] kcu ON kcu.[TABLE_SCHEMA] =  tc.[TABLE_SCHEMA] AND kcu.[TABLE_NAME] =  tc.[TABLE_NAME] AND tc.[CONSTRAINT_NAME] = kcu.[CONSTRAINT_NAME]",
                "    WHERE tc.[CONSTRAINT_TYPE] = 'PRIMARY KEY'",
                ") pk ON pk.[TABLE_SCHEMA] = c.[TABLE_SCHEMA] AND pk.[TABLE_NAME] = c.[TABLE_NAME] AND pk.[COLUMN_NAME] = c.[COLUMN_NAME]",
                "LEFT JOIN (",
                "    SELECT OBJECT_NAME(Object_id) [TABLE], OBJECT_SCHEMA_NAME(Object_id) [SCHEMA], [name], [seed_value], [increment_value], [last_value]",
                "    FROM sys.identity_columns",
                ") idc ON idc.[TABLE] = c.[TABLE_NAME] AND idc.[SCHEMA] = c.[TABLE_SCHEMA] AND idc.[name] = c.[COLUMN_NAME]",
                "ORDER BY c.[TABLE_SCHEMA], c.[TABLE_NAME], c.[ORDINAL_POSITION]"
            ].filter(f => !vvs.isEmptyString(f)).join(os.EOL)
        )
    })
    return query.join(os.EOL)
}