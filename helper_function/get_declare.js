//@ts-check
const vvs = require('vv-shared')
const get_types_sql = require('./get_types_sql.js')
const index = require('../index.js')

/**
 * @typedef type_get_declare
 * @property {string} sql
 * @property {string} type
 * @property {index.type_sql} type_sql
 * @property {number} len_chars
 */

exports.go = go

/**
 * generate declaration script with sql type
 * @static
 * @param {index.sqltype|'guid'|'udt'|'variant'} type
 * @param {number} precision
 * @param {number} scale
 * @param {number|'max'} len
 * @param {'char'|'byte'} type_len
 * @returns {type_get_declare}
 */
function go (type, precision, scale, len, type_len) {
    if (len === 'max' && type_len !== 'char') {
        throw new Error (vvs.format('parameters len = "max" and type_len <> "char" are incompatible'))
    }
    if (vvs.isEmptyString(type)) return undefined

    /** @type {type_get_declare} */
    let res = {
        sql: "",
        len_chars: undefined,
        type: type.toLowerCase(),
        type_sql: undefined
    }

    if (res.type === 'guid') {
        res.type = 'uniqueidentifier'
    } else if (res.type === 'udt') {
        res.type = 'hierarchyid'
    } else if (res.type === 'variant') {
        res.type = 'sql_variant'
    }

    let types_sql = get_types_sql.go()
    let type_sql = types_sql.find(f => f.type === res.type)
    if (vvs.isEmpty(type_sql)) {
        if (res.type.length > 1 && res.type.substring(res.type.length - 1, res.type.length) === 'n') {
            res.type = res.type.substring(0, res.type.length - 1)
            type_sql = types_sql.find(f => f.type === res.type)
            if (vvs.isEmpty(type_sql)) {
                return undefined
            }
        }
    }
    res.type_sql = type_sql

    /** @type {number} */
    let process_len = undefined

    if (type_len === 'byte') {
        if (type_sql.len === 'allow' && len >=  65535) {
            res.len_chars = -1
            process_len = res.len_chars
        } else if (!vvs.isEmpty(type_sql.bytes_on_char) && type_sql.bytes_on_char !== 0) {
            res.len_chars = Math.floor(vvs.toInt(len) / type_sql.bytes_on_char)
            process_len = res.len_chars
        } else {
            process_len = vvs.toInt(len)
        }
    } else if (type_len === 'char') {
        res.len_chars = (len === 'max' ? -1 : vvs.toInt(len))
        process_len = res.len_chars
    }

    if (
        (type_sql.precision === 'deny' && type_sql.scale === 'deny' && type_sql.len === 'deny') ||
        (typeof type_sql.precision === 'number' && typeof type_sql.scale === 'number' && type_sql.len === 'deny') ||
        (typeof type_sql.precision === 'number' && type_sql.scale === 'deny' && type_sql.len === 'deny') ||
        (type_sql.precision === 'deny' && type_sql.scale === 'deny' && type_sql.len === -1) ||
        (type_sql.precision === 'deny' && type_sql.scale === 'deny' && typeof type_sql.len === 'number' && type_sql.len >= 0)
    ) {
        res.sql = type_sql.type.toUpperCase()
        return res
    }
    if (type_sql.precision === 'allow' && type_sql.scale === 'allow' && type_sql.len === 'deny') {
        let precision_parse = vvs.toInt(precision, -1)
        if (precision_parse <= 0) {
            throw new Error(vvs.format('not found precision for sql type "{0}"',type_sql.type))
        }
        let scale_parse = vvs.toInt(scale, -1)
        if (scale_parse < 0) {
            throw new Error(vvs.format('not found scale for sql type "{0}"',type_sql.type))
        }
        res.sql = type_sql.type.toUpperCase().concat('(',precision_parse.toString(),',',scale_parse.toString(),')')
        return res
    }
    if (type_sql.precision === 'deny' && type_sql.scale === 'deny' && type_sql.len === 'allow') {
        let len_parse = vvs.toInt(process_len, -2)
        if (len_parse <= -2) {
            throw new Error(vvs.format('not found length for sql type "{0}"',type_sql.type))
        }
        if (len_parse === -1) {
            res.sql = type_sql.type.toUpperCase().concat('(MAX)')
        } else {
            res.sql = type_sql.type.toUpperCase().concat('(',len_parse.toString(),')')
        }
        return res
    }
    if (type_sql.precision === 'deny' && type_sql.scale === 'deny' && type_sql.len === 'deny_max') {
        let len_parse = vvs.toInt(process_len, -2)
        if (len_parse <= -2) {
            throw new Error(vvs.format('not found length for sql type "{0}"',type_sql.type))
        }
        if (process_len === -1) {
            throw new Error(vvs.format('length for sql type "{0}" can not be "MAX"',type_sql.type))
        }
        res.sql = type_sql.type.toUpperCase().concat('(',len_parse.toString(),')')
        return res
    }
    throw new Error(vvs.format('unknown error in builder sql declaration text for sql type "{0}" with precision "{1}", scale "{2}", len "{3}"',[type, precision, scale, len]))
}