//@ts-check
const vvs = require('vv-shared')

exports.go = go

/**
 * exec sp_releaseapplock
 * @param {string} key name lock
 * @param {string} [database] name database
 * @returns {string}
 */
function go (key, database) {
    let key_beauty = vvs.toString(key, '')
    if (vvs.isEmptyString(key_beauty)) return undefined

    let exec_path = 'sp_releaseapplock'

    let database_beauty = vvs.toString(database, '')
    if (!vvs.isEmptyString(database_beauty)) {
        exec_path = vvs.border_add(database_beauty, '[', ']').concat('..', exec_path)
    }

    return vvs.format("EXEC {0} @Resource='{1}', @LockOwner='Session'", [exec_path, key_beauty])
}