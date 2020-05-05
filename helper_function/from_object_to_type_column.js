//@ts-check
const vvs = require('vv-shared')
const index = require('../index.js')
const get_types_sql = require('./get_types_sql.js').go

exports.go = go

/**
 * convert raw object to type_column object
 * @static
 * @param {Object} object
 * @returns {index.type_column}
 */
function go (object) {
    if (vvs.isEmpty(object)) return undefined

    let type = get_types_sql().find(f => vvs.equal(f.type, vvs.toString(vvs.findPropertyValueInObject(object, 'type'), '')))

    let len_chars = vvs.findPropertyValueInObject(object, 'len_chars')
    if (vvs.equal(len_chars, 'max')) {
        len_chars = 'max'
    } else {
        len_chars = vvs.toInt(len_chars)
    }

    return {
        name: vvs.toString(vvs.findPropertyValueInObject(object, 'name')),
        type: vvs.isEmpty(type) ? undefined : type.type,
        len_chars: len_chars,
        precision: vvs.toInt(vvs.findPropertyValueInObject(object, 'precision')),
        scale: vvs.toInt(vvs.findPropertyValueInObject(object, 'scale')),
        nullable: vvs.toBool(vvs.findPropertyValueInObject(object, 'nullable'), true),
        identity: vvs.toBool(vvs.findPropertyValueInObject(object, 'identity'), false),
        pk_position: vvs.toInt(vvs.findPropertyValueInObject(object, 'pk_position')),
        description: vvs.toString(vvs.findPropertyValueInObject(object, 'description'))
    }

}