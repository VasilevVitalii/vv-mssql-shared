//@ts-check
const vvs = require('vv-shared')
const index = require('../index.js')
const get_types_sql = require('./get_types_sql.js').go

exports.go = go

/**
 * convert raw object to type_column object
 * @static
 * @param {Object} object
 * @param {string} [property_name_prefix]
 * @returns {index.type_column}
 */
function go (object, property_name_prefix) {
    if (vvs.isEmpty(object)) {
        throw new Error ("can't convert object to sql type column - object is empty")
    }

    let prefix = vvs.isEmptyString(property_name_prefix) ? '' : property_name_prefix
    let prop = ''

    prop = prefix.concat('name')
    let name = vvs.toString(vvs.findPropertyValueInObject(object, prop), '').trim()
    if (vvs.isEmptyString(name)) {
        throw new Error ("can't convert object to sql type column - name is empty")
    }

    prop = prefix.concat('type')
    let type = get_types_sql().find(f => vvs.equal(f.type, vvs.toString(vvs.findPropertyValueInObject(object, prop), '')))
    if (vvs.isEmpty(type)) {
        throw new Error (vvs.format("can't convert object to sql type column - in column \"{0}\" type is empty", name))
    }

    prop = prefix.concat('len_chars')
    let len_chars = vvs.findPropertyValueInObject(object, prop)
    if (vvs.equal(len_chars, 'max') || len_chars === -1) {
        len_chars = 'max'
    } else {
        len_chars = vvs.toInt(len_chars)
    }
    if (vvs.isEmpty(len_chars) && !vvs.isEmpty(type.bytes_on_char)) {
        throw new Error (vvs.format("can't convert object to sql type column - in column \"{0}\" with type \"{1}\" not found len_chars", [name, type.type]))
    }

    prop = prefix.concat('precision')
    let precision = vvs.toInt(vvs.findPropertyValueInObject(object, prop))
    if (vvs.isEmpty(precision) && type.precision === 'allow') {
        throw new Error (vvs.format("can't convert object to sql type column - in column \"{0}\" with type \"{1}\" not found precision", [name, type.type]))
    }

    prop = prefix.concat('scale')
    let scale = vvs.toInt(vvs.findPropertyValueInObject(object, prop))
    if (vvs.isEmpty(scale) && type.scale === 'allow') {
        throw new Error (vvs.format("can't convert object to sql type column - in column \"{0}\" with type \"{1}\" not found scale", [name, type.type]))
    }

    prop = prefix.concat('identity_seed')
    let identity_seed = vvs.toInt(vvs.findPropertyValueInObject(object, prop))
    prop = prefix.concat('identity_increment')
    let identity_increment = vvs.toInt(vvs.findPropertyValueInObject(object, prop))
    if (vvs.isEmpty(identity_seed) && !vvs.isEmpty(identity_increment)) {
        throw new Error (vvs.format("can't convert object to sql type column - column \"{0}\" with type \"{1}\" contains identity_increment but does not contain identity_seed", [name, type.type]))
    }
    if (!vvs.isEmpty(identity_seed) && vvs.isEmpty(identity_increment)) {
        throw new Error (vvs.format("can't convert object to sql type column - column \"{0}\" with type \"{1}\" contains identity_seed but does not contain identity_increment", [name, type.type]))
    }
    if (!vvs.isEmpty(identity_seed) && type.precision === 'deny') {
        throw new Error (vvs.format("can't convert object to sql type column - column \"{0}\" with type \"{1}\" can't be identity", [name, type.type]))
    }

    prop = prefix.concat('nullable')
    let nullable = vvs.toBool(vvs.findPropertyValueInObject(object, prop), true)

    prop = prefix.concat('pk_position')
    let pk_position = vvs.toInt(vvs.findPropertyValueInObject(object, prop))
    if (!vvs.isEmpty(pk_position) && nullable === true) {
        throw new Error (vvs.format("can't convert object to sql type column - column \"{0}\" with type \"{1}\" can't be primary key and nullable", [name, type.type]))
    }

    prop = prefix.concat('description')
    let description = vvs.toString(vvs.findPropertyValueInObject(object, prop))
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