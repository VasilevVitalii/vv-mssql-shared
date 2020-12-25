//@ts-check
const vvs = require('vv-shared')
const os = require('os')
const s = require('../shared')

exports.go = go

/**
 * get table list
 * @param {s.type_sql_object_name[]} [filter]
 * @returns {string}
 */
function go (filter) {
    let beauty_filter = s.beautify_filter(filter, 's.name', 'p.name')

    let query_per_database = [
        "SELECT ",
        "	 {0} [database_name]",
        "	,s.name [schema_name]",
        "	,p.name [procedure_name]",
        "	,CASE WHEN LEFT(p2.PARAMETER_NAME,1) = '@' THEN SUBSTRING(p2.PARAMETER_NAME,2,LEN(p2.PARAMETER_NAME)-1) ELSE p2.PARAMETER_NAME END [procedure_param_name]",
        "	,p2.ORDINAL_POSITION [procedure_param_position]",
        "	,p2.PARAMETER_MODE [procedure_param_mode]",
        "	--,'???' [procedure_param_nullable]",
        "	--,'???' [procedure_param_default]",
        "	,p2.DATA_TYPE [procedure_param_type]",
        "	,p2.CHARACTER_MAXIMUM_LENGTH [procedure_param_len_chars]",
        "	,p2.NUMERIC_PRECISION [procedure_param_precision]",
        "	,p2.NUMERIC_SCALE [procedure_param_scale]",
        "FROM {1}sys.procedures p",
        "JOIN {1}sys.schemas s ON p.schema_id = s.schema_id",
        "JOIN {1}INFORMATION_SCHEMA.PARAMETERS p2 ON p2.SPECIFIC_SCHEMA = s.name AND p2.SPECIFIC_NAME = p.name",
        "{2}"
    ].filter(f => !vvs.isEmptyString(f)).join(os.EOL)
    return beauty_filter.map(m => {
        return vvs.format(query_per_database, [m.query_dbname, m.query_db, vvs.isEmptyString(m.query_filter) ? "" : "".concat("WHERE ", m.query_filter)])
    }).join(os.EOL.concat('UNION ALL', os.EOL))
}

// SELECT
// 	 NULL [database_name]
// 	,s.name [schema_name]
// 	,p.name [procedure_name]
// 	,CASE WHEN LEFT(p2.PARAMETER_NAME,1) = '@' THEN SUBSTRING(p2.PARAMETER_NAME,2,LEN(p2.PARAMETER_NAME)-1) ELSE p2.PARAMETER_NAME END [procedure_param_name]
// 	,p2.ORDINAL_POSITION [procedure_param_position]
// 	,p2.PARAMETER_MODE [procedure_param_mode]
// 	,'???' [procedure_param_nullable]
// 	,'???' [procedure_param_default]
// 	,p2.DATA_TYPE [procedure_param_type]
// 	,p2.CHARACTER_MAXIMUM_LENGTH [procedure_param_len_chars]
// 	,p2.NUMERIC_PRECISION [procedure_param_precision]
// 	,p2.NUMERIC_SCALE [procedure_param_scale]
// FROM sys.procedures p
// JOIN sys.schemas s ON p.schema_id = s.schema_id
// JOIN INFORMATION_SCHEMA.PARAMETERS p2 ON p2.SPECIFIC_SCHEMA = s.name AND p2.SPECIFIC_NAME = p.name
// WHERE p.[type] = 'p' AND p.name = 'boDocList'
// ORDER BY p.name

/*
SELECT  
	 data3.name
    ,REVERSE(RTRIM(SUBSTRING(data3.rtoken, CASE WHEN CHARINDEX(N',', data3.rtoken) > 0 THEN CHARINDEX(N',', data3.rtoken) + 1 WHEN CHARINDEX(N')', data3.rtoken) > 0 THEN CHARINDEX(N')', data3.rtoken) + 1 ELSE 1 END, LEN(data3.rtoken)))) [default_value]
    ,data3.is_output
    ,data3.s_name
    ,data3.p_name
FROM (
    SELECT
         data2.name
        ,REVERSE(SUBSTRING(ptoken, CHARINDEX('=', ptoken, 1) + 1, LEN(data2.ptoken))) [rtoken]
        ,data2.is_output
        ,data2.s_name
        ,data2.p_name
    FROM (
        SELECT  
             data.name
            ,SUBSTRING(data.tokens, token_pos + name_length + 1, ISNULL(ABS(next_token_pos - token_pos - name_length - 1), LEN(data.tokens))) [ptoken]
			,data.is_output
			,data.s_name
			,data.p_name
        FROM (
            SELECT  
                 sm3.tokens
                ,p.name
                ,p.is_output
                ,LEN(p.name) [name_length]
                ,CHARINDEX(p.name, sm3.tokens) [token_pos]
                ,CHARINDEX(p2.name, sm3.tokens) [next_token_pos]
                ,sm3.s_name
                ,sm3.p_name
            FROM (
                SELECT 
                     sm2.[object_id]
                    ,sm2.[type]
                    ,REVERSE(SUBSTRING(sm2.tokens, ISNULL(CHARINDEX('SA', sm2.tokens) + 2, 0), LEN(sm2.tokens))) [tokens]
                    ,sm2.s_name
                    ,sm2.p_name 
                FROM (
                    SELECT 
                         sm.[object_id]
                        ,o.[type]
                        ,s.name s_name
                        ,o.name p_name
                        ,REVERSE(SUBSTRING(sm.[definition], CHARINDEX(o.name, sm.[definition]) + LEN(o.name) + 1, ABS(CHARINDEX(N'AS', sm.[definition])))) [tokens]
                    FROM sys.sql_modules sm WITH (NOLOCK)
                    JOIN sys.objects o WITH (NOLOCK) ON sm.[object_id] = o.[object_id]
                    JOIN sys.schemas s WITH (NOLOCK) ON o.[schema_id] = s.[schema_id] 
                    WHERE o.[type] = 'P '
                ) sm2
                WHERE sm2.tokens LIKE '%=%'
            ) sm3
            JOIN sys.parameters p WITH (NOLOCK) ON sm3.[object_id] = p.[object_id]
            OUTER APPLY (
                SELECT p2.name
                FROM sys.parameters p2 WITH (NOLOCK) 
                WHERE p2.is_output = 0 AND sm3.[object_id] = p2.[object_id] AND p.parameter_id + 1 = p2.parameter_id
            ) p2
        ) data
    ) data2
    WHERE data2.ptoken LIKE '%=%'
) data3
*/