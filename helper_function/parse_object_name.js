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
                schema: 'dba',
                table: vvs.isEmptyString(part[0]) ? '' : vvs.border_del(part[0].trim(), '[', ']')
            }
        case 2:
            return {
                base: '',
                schema: vvs.isEmptyString(part[0]) ? 'dbo' : vvs.border_del(part[0].trim(), '[', ']'),
                table: vvs.isEmptyString(part[1]) ? '' : vvs.border_del(part[1].trim(), '[', ']')
            }
        case 3:
            return {
                base: vvs.isEmptyString(part[0]) ? '' : vvs.border_del(part[0].trim(), '[', ']'),
                schema: vvs.isEmptyString(part[1]) ? 'dbo' : vvs.border_del(part[1].trim(), '[', ']'),
                table: vvs.isEmptyString(part[2]) ? '' : vvs.border_del(part[2].trim(), '[', ']')
            }
        default:
            return undefined
    }
}