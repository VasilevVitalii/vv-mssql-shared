//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const quote = require('../shared.js').quote

exports.go = go

/**
 * @typedef type_column_link
 * @property {string} child_column
 * @property {string} parent_column
 *//**
 * create foreign key
 * @param {string} child_schema
 * @param {string} child_table
 * @param {string} parent_schema
 * @param {string} parent_table
 * @param {type_column_link[]} column_list
 * @param {'no_action'|'cascade'|'set_null'|'set_default'} rule_update
 * @param {'no_action'|'cascade'|'set_null'|'set_default'} rule_delete
 * @return {string}
 */
function go (child_schema, child_table, parent_schema, parent_table, column_list, rule_update, rule_delete) {
    let column_list_query = column_list.map((m, index) => { return "SELECT '".concat(quote(m.child_column,true), "' c, '", quote(m.parent_column,true) , "' p") }).join(" UNION ALL")

    let query = [
        "IF EXISTS (",
        "   SELECT * FROM (",
        "       SELECT ccu.COLUMN_NAME CHILD, kcu.COLUMN_NAME PARENT",
        "       FROM INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ccu",
        "       JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc ON rc.CONSTRAINT_NAME = ccu.CONSTRAINT_NAME  ",
        "       JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu ON kcu.CONSTRAINT_NAME = rc.UNIQUE_CONSTRAINT_NAME",
        "       WHERE ccu.TABLE_SCHEMA = '{0}' AND ccu.TABLE_NAME = '{1}' AND kcu.TABLE_SCHEMA = '{2}' AND kcu.TABLE_NAME = '{3}'",
        "   ) curr_fk FULL JOIN (",
        "       ".concat(column_list_query),
        "   ) need_fk ON curr_fk.CHILD = need_fk.c AND curr_fk.PARENT = need_fk.p",
        "   WHERE curr_fk.CHILD IS NULL OR need_fk.c IS NULL",
        ") BEGIN",
        "   EXEC ('",
        "       ALTER TABLE [{0}].[{1}] ADD CONSTRAINT [FK_{0}_{1}_{2}_{3}]",
        "       FOREIGN KEY ([".concat(column_list.map(m => { return quote(m.child_column,true) }).join("], ["), "])" ),
        "       REFERENCES [{2}].[{3}] ([".concat(column_list.map(m => { return quote(m.parent_column,true) }).join("], ["), "])" ),
        "       ON UPDATE {4}",
        "       ON DELETE {5}",
        "   ')",
        "END"
    ]

    return vvs.format(query.join(os.EOL), [
        quote(child_schema, true),
        quote(child_table, true),
        quote(parent_schema, true),
        quote(parent_table, true),
        vvs.replaceAll(rule_update, "_", " ").toUpperCase(),
        vvs.replaceAll(rule_delete, "_", " ").toUpperCase()
    ])
}