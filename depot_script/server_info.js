//@ts-check
const os = require('os')

exports.go = go

/**
 * get server info: version, timezone
 * @returns {string}
 */
function go () {
    return [
        "DECLARE @serverproperty_productversion VARCHAR(128)",
        "SET @serverproperty_productversion = CONVERT(VARCHAR(128),SERVERPROPERTY ('productversion'))",
        "DECLARE @version VARCHAR(8)",
        "SET @version = CASE",
        "    WHEN @serverproperty_productversion like '8%' THEN '2000'",
        "    WHEN @serverproperty_productversion like '9%' THEN '2005'",
        "    WHEN @serverproperty_productversion like '10.0%' THEN '2008'",
        "    WHEN @serverproperty_productversion like '10.5%' THEN '2008R2'",
        "    WHEN @serverproperty_productversion like '11%' THEN '2012'",
        "    WHEN @serverproperty_productversion like '12%' THEN '2014'",
        "    WHEN @serverproperty_productversion like '13%' THEN '2016'",
        "    WHEN @serverproperty_productversion like '14%' THEN '2017'",
        "    WHEN @serverproperty_productversion like '15%' THEN '2019'",
        "    ELSE NULL",
        "END",
        "SELECT",
        "    @version [version],",
        "    DATEDIFF(MINUTE,GETUTCDATE(), GETDATE()) [timezone]",
    ].join(os.EOL)
}