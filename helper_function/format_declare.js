//@ts-check
const vvs = require('vv-shared')
const get_types_sql = require('./get_types_sql.js')
const index = require('../index.js')

/**
 * @typedef type_format_declare
 * @property {'none'|'one_number'|'two_numbers'|'one_number_or_max'} len
 * @property {number} [max_first_number]
 * @property {number} [max_second_number]
 */

exports.go = go

/**
 * description for declare format by sql types
 * @static
 * @param {index.sqltype} type
 * @returns {type_format_declare}
 */
function go (type) {
    let sql_type = get_types_sql.go().find(f => vvs.equal(type, f.type))
    if (vvs.isEmpty(sql_type)) {
        return {
            len: 'none'
        }
    }

    if (sql_type.type === 'decimal' || sql_type.type === 'numeric') {
        return {
            len: 'two_numbers',
            max_first_number: 38,
            max_second_number: 38
        }
    }
    if (sql_type.type === 'char') {
        return {
            len: 'one_number',
            max_first_number: 8000,
        }
    }
    if (sql_type.type === 'varchar') {
        return {
            len: 'one_number_or_max',
            max_first_number: 8000,
        }
    }
    if (sql_type.type === 'nchar') {
        return {
            len: 'one_number',
            max_first_number: 4000,
        }
    }
    if (sql_type.type === 'nvarchar') {
        return {
            len: 'one_number_or_max',
            max_first_number: 4000,
        }
    }
    return {
        len: 'none'
    }
}