//@ts-check
const vvs = require('vv-shared')

exports.quote = quote

/**
 * @param {string} val
 * @param {boolean} [no_bracket]
 */
function quote(val, no_bracket) {
    if (vvs.isEmpty(val)) return 'NULL'
    if (no_bracket === true) {
        return vvs.replaceAll(vvs.border_del(vvs.toString(val, ''),'[',']'), "'", "''")
    }
    return vvs.replaceAll(vvs.toString(val, ''), "'", "''")
}