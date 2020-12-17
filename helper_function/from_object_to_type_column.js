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
    if (vvs.isEmpty(object)) {
        throw new Error ("can't convert object to sql type column - object is empty")
    }

    let name = vvs.toString(vvs.findPropertyValueInObject(object, 'column_name'), '').trim()
    if (vvs.isEmptyString(name)) {
        throw new Error ("can't convert object to sql type column - column_name is empty")
    }

    let type = get_types_sql().find(f => vvs.equal(f.type, vvs.toString(vvs.findPropertyValueInObject(object, 'column_type'), '')))
    if (vvs.isEmpty(type)) {
        throw new Error (vvs.format("can't convert object to sql type column - in column \"{0}\" column_type is empty", name))
    }

    let len_chars = vvs.findPropertyValueInObject(object, 'column_len_chars')
    if (vvs.equal(len_chars, 'max') || len_chars === -1) {
        len_chars = 'max'
    } else {
        len_chars = vvs.toInt(len_chars)
    }
    if (vvs.isEmpty(len_chars) && !vvs.isEmpty(type.bytes_on_char)) {
        throw new Error (vvs.format("can't convert object to sql type column - in column \"{0}\" with type \"{1}\" not found column_len_chars", [name, type.type]))
    }

    let precision = vvs.toInt(vvs.findPropertyValueInObject(object, 'column_precision'))
    if (vvs.isEmpty(precision) && type.precision === 'allow') {
        throw new Error (vvs.format("can't convert object to sql type column - in column \"{0}\" with type \"{1}\" not found column_precision", [name, type.type]))
    }

    let scale = vvs.toInt(vvs.findPropertyValueInObject(object, 'column_scale'))
    if (vvs.isEmpty(scale) && type.scale === 'allow') {
        throw new Error (vvs.format("can't convert object to sql type column - in column \"{0}\" with type \"{1}\" not found column_scale", [name, type.type]))
    }

    let identity_seed = vvs.toInt(vvs.findPropertyValueInObject(object, 'column_identity_seed'))
    if (!vvs.isEmpty(identity_seed) && type.precision === 'deny') {
        throw new Error (vvs.format("can't convert object to sql type column - column \"{0}\" with type \"{1}\" can't be identity", [name, type.type]))
    }
    let identity_increment = vvs.toInt(vvs.findPropertyValueInObject(object, 'column_identity_increment'))
    if (!vvs.isEmpty(identity_increment) && type.precision === 'deny') {
        throw new Error (vvs.format("can't convert object to sql type column - column \"{0}\" with type \"{1}\" can't be identity", [name, type.type]))
    }
    if (vvs.isEmpty(identity_seed) && !vvs.isEmpty(identity_increment)) {
        throw new Error (vvs.format("can't convert object to sql type column - column \"{0}\" with type \"{1}\" contains column_identity_increment but does not contain identity_seed", [name, type.type]))
    }
    if (!vvs.isEmpty(identity_seed) && vvs.isEmpty(identity_increment)) {
        throw new Error (vvs.format("can't convert object to sql type column - column \"{0}\" with type \"{1}\" contains identity_seed but does not contain column_identity_increment", [name, type.type]))
    }

    let nullable = vvs.toBool(vvs.findPropertyValueInObject(object, 'column_pk_nullable'), true)
    let pk_position = vvs.toInt(vvs.findPropertyValueInObject(object, 'column_pk_position'))
    if (!vvs.isEmpty(pk_position)) {
        if (nullable === true) {
            throw new Error (vvs.format("can't convert object to sql type column - column \"{0}\" with type \"{1}\" can't be primary key and nullable", [name, type.type]))
        }
    }

    let description = vvs.toString(vvs.findPropertyValueInObject(object, 'column_description'))
    if (!vvs.isEmpty(description)) {
        description = description.trim()
    }

    return {
        name: name,
        type: type.type,
        len_chars: len_chars,
        precision: precision,
        scale: scale,
        nullable: nullable,
        identity_seed: identity_seed,
        identity_increment: identity_increment,
        pk_position: pk_position,
        description: description
    }

}