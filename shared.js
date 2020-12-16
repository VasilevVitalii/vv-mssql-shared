//@ts-check
const vvs = require('vv-shared')

exports.quote = quote
exports.tables = tables
exports.beautify_filter = beautify_filter

/**
 * @typedef table
 * @property {string} [base] database name or empty string - current database
 * @property {string} [schema] schema name or empty string - dbo
 * @property {string} table table name
 */

/**
 * @typedef type_filter
 * @property {string[]|string} [bases]
 * @property {string[]|string} [schemas]
 * @property {string[]|string} [tables]
 */
/**
 * @typedef type_beauty_filter
 * @property {string[]} [bases]
 * @property {string[]} [schemas]
 * @property {string[]} [tables]
 */

/**
 * @param {string} val
 * @param {boolean} [no_bracket]
 */
function quote(val, no_bracket) {
    if (vvs.isEmpty(val)) return 'NULL'
    if (no_bracket === true) {
        return vvs.replaceAll(vvs.border_del(vvs.toString(val, ''),'[',']'), "'", "''")
    }
    return vvs.replaceAll(vvs.toString(val, ''), "'", "''")
}


/**
 * @typedef tables_result
 * @property {table[]} tables
 * @property {string[]} databases
 */
/**
 * @param {table[]} tables
 * @returns {tables_result}
 */
function tables(tables) {

    let tables_beauty = Array.isArray(tables) ? tables.map(m => { return {
        base: vvs.border_del(vvs.toString(m.base, '').trim(), '[', ']').toLowerCase(),
        schema: vvs.border_del(vvs.toString(m.schema, '').trim(), '[', ']').toLowerCase(),
        table: vvs.border_del(vvs.toString(m.table, '').trim(), '[', ']').toLowerCase()
    }}) : []

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

    return {
        tables: tables_beauty,
        databases: databases
    }
}

/**
 * @param {type_filter} filter
 * @returns {type_beauty_filter}
 */
function beautify_filter(filter) {
    return {
        bases: vvs.isEmpty(filter) ? [] : to_arr(filter.bases),
        schemas: vvs.isEmpty(filter) ? [] : to_arr(filter.schemas),
        tables: vvs.isEmpty(filter) ? [] : to_arr(filter.tables),
    }
}

/**
 * @param {string|string[]} obj
 * @returns {string[]}
 */
function to_arr(obj) {
    let raw = vvs.isEmpty(obj) ? [] : (Array.isArray(obj) ? obj.map(m => {return vvs.toString(m, '')}) : [vvs.toString(obj, '')])
    let res = []
    raw.filter(f => !vvs.isEmptyString(f)).forEach(item => {
        if (res.some(f => vvs.equal(f, item))) return
        res.push(item)
    })
    return res
}