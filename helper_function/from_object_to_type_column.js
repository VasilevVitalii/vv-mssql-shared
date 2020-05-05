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
function go (object, check_errors) {
    if (vvs.isEmpty(object)) {
        throw new Error ("can't convert object to sql type column - object is empty")
    }

    let name = vvs.toString(vvs.findPropertyValueInObject(object, 'name'), '').trim()
    if (vvs.isEmptyString(name)) {
        throw new Error ("can't convert object to sql type column - column name is empty")
    }

    let type = get_types_sql().find(f => vvs.equal(f.type, vvs.toString(vvs.findPropertyValueInObject(object, 'type'), '')))
    if (vvs.isEmpty(type)) {
        throw new Error (vvs.format("can't convert object to sql type column - in column \"{0}\" not found type", name))
    }

    let len_chars = vvs.findPropertyValueInObject(object, 'len_chars')
    if (vvs.equal(len_chars, 'max')) {
        len_chars = 'max'
    } else {
        len_chars = vvs.toInt(len_chars)
    }
    if (vvs.isEmpty(len_chars) && !vvs.isEmpty(type.bytes_on_char)) {
        throw new Error (vvs.format("can't convert object to sql type column - in column \"{0}\" with type \"{1}\" not found len", [name, type.type]))
    }

    let precision = vvs.toInt(vvs.findPropertyValueInObject(object, 'precision'))
    if (vvs.isEmpty(precision) && type.precision === 'allow') {
        throw new Error (vvs.format("can't convert object to sql type column - in column \"{0}\" with type \"{1}\" not found precision", [name, type.type]))
    }

    let scale = vvs.toInt(vvs.findPropertyValueInObject(object, 'scale'))
    if (vvs.isEmpty(scale) && type.scale === 'allow') {
        throw new Error (vvs.format("can't convert object to sql type column - in column \"{0}\" with type \"{1}\" not found scale", [name, type.type]))
    }

    let identity = vvs.toBool(vvs.findPropertyValueInObject(object, 'identity'), false)
    if (identity === true && type.precision === 'deny') {
        throw new Error (vvs.format("can't convert object to sql type column - column \"{0}\" with type \"{1}\" can't be identity", [name, type.type]))
    }

    let nullable = vvs.toBool(vvs.findPropertyValueInObject(object, 'nullable'), true)
    let pk_position = vvs.toInt(vvs.findPropertyValueInObject(object, 'pk_position'))
    if (!vvs.isEmpty(pk_position)) {
        if (nullable === true) {
            throw new Error (vvs.format("can't convert object to sql type column - column \"{0}\" with type \"{1}\" can't be primary key and nullable", [name, type.type]))
        }
    }

    let description = vvs.toString(vvs.findPropertyValueInObject(object, 'description'))
    if (!vvs.isEmpty(description)) {
        description = description.trim()
    }

    return {
        name: name,
        type: vvs.isEmpty(type) ? undefined : type.type,
        len_chars: len_chars,
        precision: precision,
        scale: scale,
        nullable: nullable,
        identity: identity,
        pk_position: pk_position,
        description: description
    }

}