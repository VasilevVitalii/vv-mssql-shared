//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const quote = require('../shared').quote

exports.go = go

/**
 * @typedef table
 * @property {string} [base] database name or empty string - current database
 * @property {string} [schema] schema name or empty string - dbo
 * @property {string} table table name
 */

/**
 * create or update schema
 * @param {table[]} tables
 * @returns {string}
 */
function go (tables) {
    let tables_beauty = tables.map(m => { return {
        base: vvs.border_del(vvs.toString(m.base, '').trim(), '[', ']').toLowerCase(),
        schema: vvs.border_del(vvs.toString(m.schema, '').trim(), '[', ']').toLowerCase(),
        table: vvs.border_del(vvs.toString(m.table, '').trim(), '[', ']').toLowerCase()
    }})

    /** @type {table[]} */
    let tables_beauty_one = []
    tables_beauty.forEach(table => {
        if (tables_beauty_one.some(f => vvs.equal(f.base, table.base) && vvs.equal(f.schema, table.schema) && vvs.equal(f.table, table.table))) return
        tables_beauty_one.push(table)
    })

    /** @type {string[]} */
    let databases = []
    tables_beauty_one.forEach(table => {
        if (databases.some(f => vvs.equal(f, table.base))) return
        databases.push(table.base)
    })

    /** @type {string[]} */
    let query = []

    databases.sort(s => vvs.isEmptyString(s) ? -1 : 1).forEach(database => {
        query.push(
            [
                vvs.isEmptyString(database) ? '' : "USE ".concat(vvs.border_add(database, "[", "]")),
                ";with need_tables AS (",
                tables_beauty_one.filter(f => vvs.equal(f.base, database)) .map(m => {
                    return vvs.format("    SELECT '{0}' [schema], '{1}' [table]", [vvs.isEmptyString(m.schema) ? 'dbo' : m.schema, m.table])
                }).join(" UNION ALL".concat(os.EOL)),
                ")",
                "SELECT '" + quote(database, true) + "' [DATABASE], c.TABLE_SCHEMA [SCHEMA], c.TABLE_NAME [TABLE], prop_table.[value] TABLE_DESCRIPTION,",
                "c.COLUMN_NAME [NAME], prop_column.[value] DESCRIPTION, pk.ORDINAL_POSITION PK_POSITION, c.IS_NULLABLE [NULLABLE],",
                "c.DATA_TYPE [TYPE], c.CHARACTER_MAXIMUM_LENGTH [LEN_CHARS], c.NUMERIC_PRECISION [PRECISION], c.NUMERIC_SCALE [SCALE]",
                "FROM INFORMATION_SCHEMA.[COLUMNS] c",
                "JOIN need_tables n ON n.[schema] = c.TABLE_SCHEMA AND n.[table] = c.TABLE_NAME",
                "OUTER APPLY fn_listextendedproperty(default, 'SCHEMA', c.TABLE_SCHEMA, 'TABLE', c.TABLE_NAME, null, null) prop_table",
                "OUTER APPLY fn_listextendedproperty(default, 'SCHEMA', c.TABLE_SCHEMA, 'TABLE', c.TABLE_NAME, 'COLUMN', c.COLUMN_NAME) prop_column",
                "LEFT JOIN (",
                    "SELECT tc.TABLE_SCHEMA, tc.TABLE_NAME, kcu.COLUMN_NAME, kcu.ORDINAL_POSITION",
                    "FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc",
                    "JOIN need_tables n ON n.[schema] = tc.TABLE_SCHEMA AND n.[table] = tc.TABLE_NAME",
                    "JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu ON kcu.TABLE_SCHEMA =  tc.TABLE_SCHEMA AND kcu.TABLE_NAME =  tc.TABLE_NAME AND  AND tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME",
                    "WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY'",
                ") pk ON pk.TABLE_SCHEMA = c.TABLE_SCHEMA AND pk.TABLE_NAME = c.TABLE_NAME AND pk.COLUMN_NAME = c.COLUMN_NAME",
                "ORDER BY c.TABLE_SCHEMA, c.TABLE_NAME, c.ORDINAL_POSITION"
            ].filter(f => !vvs.isEmptyString(f)).join(os.EOL)
        )
    })
    return query.join(os.EOL)
}