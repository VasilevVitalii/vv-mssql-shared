//@ts-check
const vvs = require('vv-shared')
const os = require('os')

exports.go = go

/**
 * exec sp_getapplock
 * @param {string} key name lock
 * @param {number} wait in msec, wait for free key, if 0, without wait
 * @param {string} [database] name database
 * @returns {string}
 */
function go (key, wait, database) {
    let key_beauty = vvs.toString(key, '')
    if (vvs.isEmptyString(key_beauty)) return undefined

    let wait_beauty = vvs.toInt(wait, -1)
    if (wait_beauty < 0) return undefined

    let exec_path = 'sp_getapplock'

    let database_beauty = vvs.toString(database, '')
    if (!vvs.isEmptyString(database_beauty)) {
        exec_path = vvs.border_add(database_beauty, '[', ']').concat('..', exec_path)
    }

    let error_text = vvs.format('Timed out wait sp_getapplock with key "{0}" and wait time {1} msec', [key_beauty, wait_beauty])
    if (!vvs.isEmpty(database_beauty)) {
        error_text = error_text.concat(' in database ', database_beauty)
    }

    return vvs.format([
        "DECLARE @result INT",
        "EXEC @result={0} @Resource='{1}', @LockOwner='Session', @LockMode='exclusive', @LockTimeOut={2}",
        "IF @result < 0 BEGIN",
        "    RAISERROR('{3}', 16, 1)",
        "    RETURN",
        "END",
    ].join(os.EOL), [exec_path, key_beauty, wait_beauty, error_text])
}