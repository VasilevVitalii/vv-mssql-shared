//@ts-check

const vvs = require('vv-shared')
const index = require('../index.js')
const s = require('../shared.js')

exports.go = go

/**
 * @param {string} object_name
 * @param {string} [default_base]
 * @returns {s.type_sql_object_name}
 */
function go (object_name, default_base) {
    if (vvs.isEmptyString(object_name)) return undefined
    let part = object_name.split('.')
    if (part.length <= 0) return undefined

    switch(part.length) {
        case 1:
            return {
                base: vvs.toString(default_base, '').trim() ,
                schema: 'dbo',
                table: vvs.isEmptyString(part[0]) ? '' : vvs.border_del(part[0].trim(), '[', ']')
            }
        case 2:
            return {
                base: vvs.toString(default_base, '').trim(),
                schema: schema(part[0]),
                table: vvs.isEmptyString(part[1]) ? '' : vvs.border_del(part[1].trim(), '[', ']')
            }
        case 3:
            let base = vvs.isEmptyString(part[0]) ? '' : vvs.border_del(part[0].trim(), '[', ']')
            return {
                base: vvs.isEmptyString(base) ? vvs.toString(default_base, '').trim() : base,
                schema: schema(part[1]),
                table: vvs.isEmptyString(part[2]) ? '' : vvs.border_del(part[2].trim(), '[', ']')
            }
        default:
            return undefined
    }
}

/**
 * @param {string} text
 * @returns {string}
 */
function schema(text) {
    if (vvs.isEmptyString(text)) {
        return 'dbo'
    }
    let s = vvs.border_del(text.trim(), '[', ']')
    return vvs.isEmptyString(s) ? 'dbo' : s
}