//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const s = require('../shared')

exports.go = go

/**
 * database list, include system
 * @param {string[]} [filter]
 * @param {boolean} [allow_size]
 * @returns {string}
 */
function go (filter, allow_size) {
    let beauty_filter = vvs.isEmpty(filter) ? [] : s.beautify_filter(filter.map(m => { return {base: m} }), '', '')

    let dabatase_filter = beauty_filter.length > 0
        ? vvs.format("    IF ''?'' NOT IN (''{0}'') RETURN", beauty_filter.map(m => { return vvs.replaceAll(m.base, "'", "''''") } ).join("'',''") )
        : ""

    return [
        "IF OBJECT_ID('tempdb..#databases') IS NOT NULL DROP TABLE #databases ",
        "CREATE TABLE #databases(",
        "     [database_name] NVARCHAR(125) NOT NULL PRIMARY KEY",
        "    ,[system] BIT NOT NULL DEFAULT(0)",
        "    ,[database_description] NVARCHAR(MAX)",
        allow_size === true ? "    ,[log_size_kb] BIGINT" : "",
        allow_size === true ? "    ,[raw_size_kb] BIGINT" : "",
        ")",
        "EXEC sp_MSforeachdb N'",
        "BEGIN",
        dabatase_filter,
        "    USE ?",
        "    DECLARE @database_name NVARCHAR(128); SET @database_name = DB_NAME()",
        "    INSERT INTO #databases([database_name]) VALUES (@database_name)",
        "    UPDATE t SET t.[database_description] = CONVERT(NVARCHAR(MAX),p.[value])",
        "    FROM #databases t",
        "    OUTER APPLY sys.fn_listextendedproperty(default, default, default, default, default, default, default) p",
        "    WHERE t.[database_name] = @database_name",
        "END'",
        "UPDATE #databases SET [system] = 1 WHERE database_name IN ('master', 'model', 'msdb', 'tempdb')",
        allow_size === true ? [
            ";WITH s AS (",
            "    SELECT",
            "        r.database_name,",
            "        SUM(CASE WHEN f.type_desc = 'LOG' THEN f.[size] ELSE 0 END) size_log,",
            "        SUM(CASE WHEN f.type_desc = 'ROWS' THEN f.[size] ELSE 0 END) size_row",
            "    FROM #databases r",
            "    JOIN sys.master_files f ON f.database_id = DB_ID(r.database_name)",
            "    GROUP BY r.database_name",
            ") UPDATE r SET r.log_size_kb = s.size_log * 8, r.raw_size_kb = s.size_row * 8",
            "FROM #databases r ",
            "JOIN s ON s.database_name = r.database_name",
        ].join(os.EOL) : "",
        "SELECT * FROM #databases ORDER BY [system] DESC, database_name",

    ].filter(f => !vvs.isEmptyString(f)).join(os.EOL)
}