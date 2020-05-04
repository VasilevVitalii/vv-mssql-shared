//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const quote = require('../shared').quote
const descr = require('./sch_description.js')

exports.go = go

/**
 * create or update schema
 * @param {string} name
 * @param {string} [description]
 * @returns {string}
 */
function go (name, description) {

    let query = [
        vvs.format("IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '{0}') BEGIN", quote(name, true)),
        vvs.format("   EXEC('CREATE SCHEMA [{0}]')", quote(name, true)),
        "END",
        descr.go(name, undefined, undefined, description)
    ]

    return query.join(os.EOL)
}