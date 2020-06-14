//@ts-check

const vvs = require('vv-shared')
const index = require('../index.js')

exports.go = go

/**
 * @typedef object_name
 * @property {string} base
 * @property {string} schema
 * @property {string} table
 */

/**
 * @param {string} object_name
 * @returns {object_name}
 */
function go (object_name) {
    if (vvs.isEmptyString(object_name)) return undefined
    let part = object_name.split('.')
    if (part.length <= 0) return undefined

    switch(part.length) {
        case 1:
            return {
                base: '',
                schema: 'dbo',
                table: vvs.isEmptyString(part[0]) ? '' : vvs.border_del(part[0].trim(), '[', ']')
            }
        case 2:
            return {
                base: '',
                schema: schema(part[0]),
                table: vvs.isEmptyString(part[1]) ? '' : vvs.border_del(part[1].trim(), '[', ']')
            }
        case 3:
            return {
                base: vvs.isEmptyString(part[0]) ? '' : vvs.border_del(part[0].trim(), '[', ']'),
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