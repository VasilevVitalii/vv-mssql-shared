//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const descr = require('./sch_description.js')
const index = require('../index.js')
const quote = require('../shared').quote

exports.go = go

/**
 * create table or update table columns
 * @param {string} schema
 * @param {string} name
 * @param {string} description
 * @param {index.type_column[]} column_list
 * @param {'ignore'|'error'} exist_unknown_field
 * @returns {string}
 */
function go (schema, name, description, column_list, exist_unknown_field) {

    //if (!lib_conv.isEmpty())

    let pk = query_pk(schema, name, column_list)

    let pk_column_list = column_list.filter(f => !vvs.isEmpty(f.pk_position)).map(m => { return vvs.format("SELECT '{0}' n, {1} p", [quote(m.name,true), m.pk_position])}).join(" UNION ALL ")
    let all_column_list = column_list.map(m => { return vvs.format("SELECT '{0}' n", [quote(m.name,true), m.pk_position])}).join(" UNION ALL ")

    let query = [
        "IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '{0}' AND TABLE_NAME = '{1}') BEGIN",
        "   EXEC ('",
        "       CREATE TABLE [{0}].[{1}] (",
        column_list.map(m => { return '            '.concat(query_column(m)) }).join(','.concat(os.EOL)).concat(vvs.isEmptyString(pk) ? '' : ','),
        (vvs.isEmptyString(pk) ? '' : '            '.concat(pk)),
        "       )".concat(column_list.some(f => f.len_chars === 'max') ? ' ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]' : ''),
        "   ')",
        "END ELSE BEGIN",
        (exist_unknown_field !== 'error' ? '' : [
            "    IF EXISTS (",
            "        SELECT * FROM(",
            "            SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.[COLUMNS] WHERE TABLE_SCHEMA = '{0}' AND TABLE_NAME = '{1}'",
            "        ) curr_column",
            "        LEFT JOIN (",
            "            ".concat(all_column_list),
            "        ) need_column ON curr_column.COLUMN_NAME = need_column.n",
            "        WHERE need_column.n IS NULL",
            "    ) BEGIN",
            "        RAISERROR('in table {0}.{1} existing columns does not match the expected', 16, 1)",
            "        RETURN",
            "    END",
        ].join(os.EOL)),
        (vvs.isEmptyString(pk_column_list) ? '' : [
            "    IF EXISTS (",
            "        SELECT * FROM (",
            "            SELECT kcu.COLUMN_NAME, kcu.ORDINAL_POSITION",
            "            FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc",
            "            JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu ON kcu.TABLE_SCHEMA =  tc.TABLE_SCHEMA AND kcu.TABLE_NAME =  tc.TABLE_NAME",
            "            WHERE tc.TABLE_SCHEMA = '{0}' AND tc.TABLE_NAME = '{1}' AND tc.CONSTRAINT_TYPE = 'PRIMARY KEY'",
            "        ) curr_pk",
            "        FULL JOIN (",
            "            ".concat(pk_column_list),
            "        ) need_pk ON curr_pk.COLUMN_NAME = need_pk.n AND curr_pk.ORDINAL_POSITION = need_pk.p",
            "        WHERE curr_pk.COLUMN_NAME IS NULL OR need_pk.n IS NULL",
            "    ) BEGIN",
            "        RAISERROR('in table {0}.{1} existing primary key does not match the expected', 16, 1)",
            "        RETURN",
            "    END",
        ].join(os.EOL)),
        column_list.map(m => { return  [
            "    IF NOT EXISTS (SELECT TOP 1 COLUMN_NAME FROM INFORMATION_SCHEMA.[COLUMNS] WHERE TABLE_SCHEMA = '{0}' AND TABLE_NAME = '{1}' AND COLUMN_NAME = '".concat(quote(m.name,true),"') BEGIN"),
            "        EXEC ('ALTER TABLE [{0}].[{1}] ADD ".concat(query_column(m), "')"),
            "    END ELSE IF NOT EXISTS (SELECT TOP 1 COLUMN_NAME FROM INFORMATION_SCHEMA.[COLUMNS] WHERE TABLE_SCHEMA = '{0}' AND TABLE_NAME = '{1}' AND COLUMN_NAME = '".concat(quote(m.name,true),"'"),
            "        ".concat("AND DATA_TYPE='", m.type,
                                "' AND IS_NULLABLE = '", (m.nullable === true ? 'YES' : 'NO'),
                                "' AND CHARACTER_MAXIMUM_LENGTH ", (vvs.isEmpty(m.len_chars) ? 'IS NULL' : "= ".concat((m.len_chars === 'max' ? "-1" : m.len_chars.toString()))),
                                " AND NUMERIC_PRECISION ", vvs.isEmpty(m.precision) ? "IS NULL" : "= ".concat(m.precision.toString()),
                                " AND NUMERIC_SCALE ", vvs.isEmpty(m.scale) ? "IS NULL" : "= ".concat(m.scale.toString()),
                                vvs.isEmptyString(m.collate) ? '' : " AND COLLATION_NAME = '".concat(m.collate, "'"),
                                ")",
                                ),
            "    BEGIN",
            "        EXEC ('ALTER TABLE [{0}].[{1}] ALTER COLUMN ".concat(query_column(m), "')"),
            "    END"
        ].join(os.EOL)}).join(os.EOL),
        "END",
        descr.go(schema, name, undefined, description),
        column_list.map(m => { return descr.go(schema, name, m.name, m.description) }).join(os.EOL),
    ].filter(f => !vvs.isEmptyString(f))

    return vvs.format(query.join(os.EOL), [quote(schema, true), quote(name, true), quote(description, true)])
}

/**
 * @param {index.type_column} column
 * @returns {string}
 */
function query_column(column) {
    if (vvs.isEmpty(column)) return ''
    let len = ''
    if (!vvs.isEmpty(column.len_chars)) {
        len = ''.concat('(', column.len_chars.toString(), ')').toUpperCase()
    } else if (!vvs.isEmpty(column.precision) && !vvs.isEmpty(column.scale)) {
        len = ''.concat('(', column.precision.toString(), ',', column.scale.toString(), ')')
    }

    let identity = ''
    if (!vvs.isEmpty(column.identity_seed) && !vvs.isEmpty(column.identity_increment)) {
        identity = vvs.format(' IDENTITY({0},{1})', [column.identity_seed, column.identity_increment])
    }

    return vvs.format('[{0}] {1}{2}{3}{4}{5}', [
        quote(column.name, true),
        column.type.toLocaleUpperCase(),
        len,
        identity,
        (vvs.isEmptyString(column.collate) ? '' : ' COLLATE '.concat(column.collate)),
        (column.nullable === true ? ' NULL' : ' NOT NULL'),
    ])
}

/**
 * @param {string} schema
 * @param {string} name
 * @param {index.type_column[]} column_list
 * @returns {string}
 */
function query_pk(schema, name, column_list) {
    let pk_columns = column_list
        .filter(f => !vvs.isEmpty(f.pk_position))
        .sort((a, b) => (a.pk_position < b.pk_position ? -1 : 1))
        .map(m => { return vvs.format('[{0}] ASC', quote(m.name, true)) })
        .join(',')
    if (vvs.isEmptyString(pk_columns)) return ''
    return vvs.format('CONSTRAINT [PK_{0}_{1}] PRIMARY KEY CLUSTERED ({2}) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]', [
        quote(schema, true),
        quote(name, true),
        pk_columns
    ])
}

// SELECT kcu.COLUMN_NAME, kcu.ORDINAL_POSITION
// FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
// JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu ON kcu.TABLE_SCHEMA =  tc.TABLE_SCHEMA AND kcu.TABLE_NAME =  tc.TABLE_NAME
// WHERE tc.TABLE_SCHEMA = 'aaa' AND tc.TABLE_NAME = 'log' AND tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
