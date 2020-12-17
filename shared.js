//@ts-check
const vvs = require('vv-shared')
const os = require('os')

//exports.quote = quote
//exports.tables = tables
exports.beautify_filter = beautify_filter

/**
 * @typedef type_sql_object_name
 * @property {string} [base]
 * @property {string} [schema]
 * @property {string} [table]
 */

/**
 * @typedef type_beauty_filter
 * @property {string} base
 * @property {type_beauty_filter_child[]} child
 * @property {string} query_filter
 * @property {string} query_dbname
 * @property {string} query_db
 */

/**
 * @typedef type_beauty_filter_child
 * @property {string} schema
 * @property {string} table
 */

// /**
//  * @param {string} val
//  * @param {boolean} [no_bracket]
//  */
// function quote(val, no_bracket) {
//     if (vvs.isEmpty(val)) return 'NULL'
//     if (no_bracket === true) {
//         return vvs.replaceAll(vvs.border_del(vvs.toString(val, ''),'[',']'), "'", "''")
//     }
//     return vvs.replaceAll(vvs.toString(val, ''), "'", "''")
// }


// /**
//  * @typedef tables_result
//  * @property {type_sql_object_name[]} tables
//  * @property {string[]} databases
//  */
// /**
//  * @param {type_sql_object_name[]} tables
//  * @returns {tables_result}
//  */
// function tables(tables) {

//     let tables_beauty = Array.isArray(tables) ? tables.map(m => { return {
//         base: vvs.border_del(vvs.toString(m.base, '').trim(), '[', ']').toLowerCase(),
//         schema: vvs.border_del(vvs.toString(m.schema, '').trim(), '[', ']').toLowerCase(),
//         table: vvs.border_del(vvs.toString(m.table, '').trim(), '[', ']').toLowerCase()
//     }}) : []

//     /** @type {type_sql_object_name[]} */
//     let tables_beauty_one = []
//     tables_beauty.forEach(table => {
//         if (tables_beauty_one.some(f => vvs.equal(f.base, table.base) && vvs.equal(f.schema, table.schema) && vvs.equal(f.table, table.table))) return
//         tables_beauty_one.push(table)
//     })

//     /** @type {string[]} */
//     let databases = []
//     tables_beauty_one.forEach(table => {
//         if (databases.some(f => vvs.equal(f, table.base))) return
//         databases.push(table.base)
//     })

//     return {
//         tables: tables_beauty,
//         databases: databases
//     }
// }

/**
 * @param {type_sql_object_name[]} filter
 * @param {string} shema_field_name
 * @param {string} table_field_name
 * @returns {type_beauty_filter[]}
 */
function beautify_filter(filter, shema_field_name, table_field_name) {
    /** @type {type_beauty_filter[]} */
    let res = []
    if (vvs.isEmpty(filter)) return res
    filter.forEach(item => {
        let base = vvs.border_del(vvs.toString(item.base, '').toLowerCase(), '[', ']')
        let schema = vvs.border_del(vvs.toString(item.schema, '').toLowerCase(), '[', ']')
        let table = vvs.border_del(vvs.toString(item.table, '').toLowerCase(), '[', ']')

        let fnd = res.find(f => f.base === base)
        if (vvs.isEmpty(fnd)) {
            fnd = {
                base: base,
                child: [],
                query_filter: '',
                query_dbname: 'DB_NAME()',
                query_db: ''
            }
            res.push(fnd)
        }

        if (!fnd.child.some(f => f.schema === schema && f.table === table)) {
            fnd.child.push({schema: schema, table: table})
        }
    })

    res.forEach(r => {
        if (!vvs.isEmptyString(r.base)) {
            r.query_dbname = vvs.format("DB_NAME(DB_ID('{0}'))", vvs.replaceAll(r.base, "'", "''"))
            r.query_db = vvs.format("[{0}].", r.base)
        }

        if (r.child.length <= 0) return
        let query = []
        let all = false
        r.child.forEach(ch => {
            let c_s = vvs.replaceAll(ch.schema, "'", "''")
            let t_s = vvs.replaceAll(ch.table, "'", "''")
            if (vvs.isEmptyString(c_s) && vvs.isEmptyString(t_s)) {
                all = true
                return
            }
            if (!vvs.isEmptyString(c_s) && !vvs.isEmptyString(t_s)) {
                query.push(vvs.format("({0} = '{1}' AND {2} = '{3}')", [shema_field_name, c_s, table_field_name, t_s]))
                return
            }
            if (!vvs.isEmptyString(c_s)) {
                query.push(vvs.format("({0} = '{1}')", [shema_field_name, c_s]))
                return
            }
            if (!vvs.isEmptyString(t_s)) {
                query.push(vvs.format("({0} = '{1}')", [table_field_name, t_s]))
                return
            }
        })
        if (query.length > 0 && all === false) {
            r.query_filter = query.join(os.EOL.concat('   OR '))
        }
    })

    return res
}

// /**
//  * @param {string|string[]} obj
//  * @returns {string[]}
//  */
// function to_arr(obj) {
//     let raw = vvs.isEmpty(obj) ? [] : (Array.isArray(obj) ? obj.map(m => {return vvs.toString(m, '')}) : [vvs.toString(obj, '')])
//     let res = []
//     raw.filter(f => !vvs.isEmptyString(f)).forEach(item => {
//         if (res.some(f => vvs.equal(f, item))) return
//         res.push(item)
//     })
//     return res
// }