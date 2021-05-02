//@ts-check

const vvs = require('vv-shared')
const index = require('../index.js')

exports.go = go

/**
 * @param {Object} object
 * @param {index.sqltype|'guid'} sql_type
 * @param {boolean} [empty_to_null] for types nvarchar,nchar,xml,char,sysname,varchar; default true
 * @returns {string|undefined}
 */
function go (object, sql_type, empty_to_null) {
    if (vvs.isEmpty(object)) return undefined

    if (sql_type === 'guid') {
        sql_type = 'uniqueidentifier'
    }

    if (sql_type === 'bigint' || sql_type === 'int' || sql_type === 'smallint' || sql_type === "tinyint") {

        if (isNaN(object)) return undefined
        let res = vvs.toInt(object)
        if (!vvs.isEmpty(res)) return res.toString()

    } else if (sql_type === 'decimal' || sql_type === 'float' || sql_type === 'money' || sql_type === 'numeric' || sql_type === 'real' || sql_type === "smallmoney") {

        if (isNaN(object)) return undefined
        let res = vvs.toFloat(object)
        if (!vvs.isEmpty(res)) return res.toString()

    } else if (sql_type === 'nvarchar' || sql_type === 'nchar' || sql_type === 'xml' || sql_type === 'char' || sql_type === 'sysname' || sql_type === 'varchar') {

        let res = vvs.toString(object)
        if (!vvs.isEmpty(res)) {
            if (vvs.toBool(empty_to_null, true) === true && res.trim() === '') return undefined
            return escape(res)
        }

    } else if (sql_type === 'bit') {

        let res = vvs.toBool(object)
        if (!vvs.isEmpty(res)) {
            if (res === true) return '1'
            if (res === false) return '0'
        }

    } else if (sql_type === 'datetime' || sql_type === 'datetime2' || sql_type === 'smalldatetime' || sql_type === 'datetimeoffset') {

        let res = vvs.toDate(object)
        if (!vvs.isEmpty(res)) return vvs.formatDate(res, 126)

    } else if (sql_type === 'date') {

        let res = vvs.toDateWithoutTime(object)
        if (!vvs.isEmpty(res)) return vvs.formatDate(res, 126)

    } else if (sql_type === 'time') {

        let res1 = vvs.toTime(object)
        if (!vvs.isEmpty(res1)) return vvs.formatDate(res1, 126)

        let res2 = vvs.toTime(object)
        if (!vvs.isEmpty(res2)) return vvs.formatDate(res2, 126)

    } else if (sql_type === 'uniqueidentifier') {

        let res = vvs.toGuid(object)
        if (!vvs.isEmpty(res)) return res

    } else if (sql_type === 'binary' || sql_type === 'varbinary' || sql_type === 'timestamp') {

        if (Buffer.isBuffer(object)) {
            return '0x'.concat(Buffer.from(object).toString('hex'))
        }

        let res1 = vvs.toGuid(object)
        if (!vvs.isEmpty(res1)) return '0x'.concat(res1.toString())

        let res2 = vvs.toString(object)
        if (!vvs.isEmpty(res2)) {

            if (res2 === '0x' || res2 ===  '0X') return '0x'

            let valid_ch = ['0','1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','A','B','C','D','E','F']

            for (let i = 0; i < res2.length; i++) {
                let ch = res2[i]
                if (i === 0 && ch === '0') continue
                if (i === 1 && (ch === 'x' || ch === 'X')) continue
                if (!valid_ch.includes(ch)) {
                    throw new Error(vvs.format('failed convert value to sql type "{0}" - invalid character "{1}" at position {2}',[sql_type, ch, i]))
                }
            }

            if (vvs.equal(res2.substring(0, 2), '0x')) {
                res2 = '0x'.concat(res2.substring(2, res2.length).toUpperCase())
            } else {
                res2 = '0x'.concat(res2.toUpperCase())
            }

            return res2
        }

    } else if (sql_type === 'sql_variant') {

        let res = vvs.toString(object)
        if (!vvs.isEmpty(res)) return res

    } else if (sql_type === 'geography' || sql_type === 'geometry' || sql_type === 'hierarchyid') {

        throw new Error(vvs.format('sql type "{0}" not supported now',[sql_type]))

    } else if (sql_type === 'image' || sql_type === 'ntext' || sql_type === 'text') {

        throw new Error(vvs.format('sql type "{0}" not supported',[sql_type]))

    } else {

        throw new Error(vvs.format('unknown sql type "{0}"',[sql_type]))

    }

    throw new Error(vvs.format('failed convert value "{0}" to sql type "{1}"',[object, sql_type]))
}

            // "	&quot;
            // '	&apos;
            // <	&lt;
            // >	&gt;
            // &	&amp;

/**
 * @param {string} text
 * @returns {string}
 */
function escape(text) {
    if (vvs.isEmptyString(text)) return text
    const esc = [
        {from: '&', to: '&amp;'},
        {from: '"', to: '&quot;'},
        {from: "'", to: '&apos;'},
        {from: '<', to: '&lt;'},
        {from: '>', to: '&gt;'},
    ]
    let pos = 0
    let i = text.indexOf('&', pos)
    while (i >= 0) {
        //console.log(text.substring(i, 100))
        let known_e = false
        for (let j = 0; j < esc.length; j++) {
            const escj = esc[j].to
            const subst = text.substring(i, i + escj.length)
            if (vvs.equal(escj, subst)) {
                pos = pos + escj.length
                known_e = true
                break
            }
        }
        if (!known_e) {
            text = text.substring(0, i) + '&amp;' + text.substring(i + 1, text.length)
            pos = pos + 5
        }
        i = text.indexOf('&', pos)
    }

    esc.forEach((item, idx) => {
        if (idx === 0) return
        text = vvs.replaceAll(text, item.from, item.to)
    })

    return text
}