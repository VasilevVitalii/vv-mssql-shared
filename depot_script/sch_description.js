//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const quote = require('../shared.js').quote

exports.go = go

/**
 * change description in schema or table or table column
 * @param {string} schema
 * @param {string} table
 * @param {string} column
 * @param {string} description
 * @returns {string}
 */
function go (schema, table, column, description) {
    if (vvs.isEmptyString(schema)) return ''
    schema = quote(schema, true)

    if (!vvs.isEmptyString(table)) table = quote(table, true)
    if (!vvs.isEmptyString(column)) column = quote(column, true)
    if (!vvs.isEmptyString(description)) description = quote(description, true)

    /** @type {'schema'|'table'|'column'} */
    let point = undefined
    if (vvs.isEmptyString(table) && vvs.isEmptyString(column)) {
        point = 'schema'
    } else if (!vvs.isEmptyString(table) && vvs.isEmptyString(column)) {
        point = 'table'
    } else if (!vvs.isEmptyString(table) && !vvs.isEmptyString(column)) {
        point = 'column'
    }
    if (vvs.isEmptyString(point)) return ''

    let extended_properties_where = [
        (point === 'schema' ? "[class] = 3" : "[class] = 1"),
        (point === 'schema' ? "major_id = SCHEMA_ID('{0}')" : "major_id = OBJECT_ID('{0}.{1}')"),
        (point === 'column' ? "minor_id = COLUMNPROPERTY(OBJECT_ID('{0}.{1}'),'{2}','ColumnId')" : "minor_id = 0")
    ].join(' AND ')

    let exec_params = [
        "@name = N'MS_Description'",
        "@level0type = 'schema'",
        "@level0name = '{0}'",
        (point === 'table' || point === 'column' ? "@level1type = 'table'" : ""),
        (point === 'table' || point === 'column' ? "@level1name = '{1}'" : ""),
        (point === 'column' ? "@level2type = 'column'" : ""),
        (point === 'column' ? "@level2name = '{2}'" : ""),
    ].filter(f => !vvs.isEmptyString(f)).join(", ")

    if (vvs.isEmptyString(description)) {
        return vvs.format([
            "IF EXISTS (SELECT TOP 1 [value] FROM sys.extended_properties WHERE ".concat(extended_properties_where,") BEGIN"),
            "    EXEC sp_dropextendedproperty ".concat(exec_params),
            "END"
        ].join(os.EOL),[schema, table, column]
        )
    }

    return vvs.format([
        "IF NOT EXISTS (SELECT TOP 1 [value] FROM sys.extended_properties WHERE ".concat(extended_properties_where,") BEGIN"),
        "    EXEC sp_addextendedproperty ".concat(exec_params, ", @value = N'{3}'"),
        "END ELSE IF NOT EXISTS (SELECT TOP 1 [value] FROM sys.extended_properties WHERE ".concat(extended_properties_where," AND [value] = N'{3}') BEGIN"),
        "    EXEC sp_updateextendedproperty ".concat(exec_params, ", @value = N'{3}'"),
        "END"
    ].join(os.EOL),[schema, table, column, description])
}