//@ts-check
let index = require('../index.js')

exports.go = go

/**
 * list all known sql type
 * @returns {index.type_sql[]}
 */
function go () {
    return [
        //Exact numerics
        {type: 'bigint',            precision: 19,              scale: 0,               len: 'deny',            jstype: 'number',           xsdtype: 'xs:integer',  bytes_on_char: undefined},
        {type: 'bit',               precision: 'deny',          scale: 'deny',          len: 'deny',            jstype: 'number',           xsdtype: 'xs:boolean',  bytes_on_char: undefined},
        {type: 'decimal',           precision: 'allow',         scale: 'allow',         len: 'deny',            jstype: 'number',           xsdtype: 'xs:decimal',  bytes_on_char: undefined},
        {type: 'int',               precision: 10,              scale: 0,               len: 'deny',            jstype: 'number',           xsdtype: 'xs:integer',  bytes_on_char: undefined},
        {type: 'money',             precision: 19,              scale: 4,               len: 'deny',            jstype: 'number',           xsdtype: 'xs:decimal',  bytes_on_char: undefined},
        {type: 'numeric',           precision: 'allow',         scale: 'allow',         len: 'deny',            jstype: 'number',           xsdtype: 'xs:decimal',  bytes_on_char: undefined},
        {type: 'smallint',          precision: 5,               scale: 0,               len: 'deny',            jstype: 'number',           xsdtype: 'xs:integer',  bytes_on_char: undefined},
        {type: 'smallmoney',        precision: 10,              scale: 4,               len: 'deny',            jstype: 'number',           xsdtype: 'xs:integer',  bytes_on_char: undefined},
        {type: 'tinyint',           precision: 3,               scale: 0,               len: 'deny',            jstype: 'number',           xsdtype: 'xs:integer',  bytes_on_char: undefined},
        //Approximate numerics
        {type: 'float',             precision: 53,              scale: 'deny',          len: 'deny',            jstype: 'number',           xsdtype: 'xs:decimal',  bytes_on_char: undefined},
        {type: 'real',              precision: 24,              scale: 'deny',          len: 'deny',            jstype: 'number',           xsdtype: 'xs:decimal',  bytes_on_char: undefined},
        //Date and time
        {type: 'date',              precision: 'deny',          scale: 'deny',          len: 'deny',            jstype: 'Date',             xsdtype: 'xs:date',     bytes_on_char: undefined},
        {type: 'datetime2',         precision: 'deny',          scale: 'deny',          len: 'deny',            jstype: 'Date',             xsdtype: 'xs:dateTime', bytes_on_char: undefined},
        {type: 'datetime',          precision: 'deny',          scale: 'deny',          len: 'deny',            jstype: 'Date',             xsdtype: 'xs:dateTime', bytes_on_char: undefined},
        {type: 'datetimeoffset',    precision: 'deny',          scale: 'deny',          len: 'deny',            jstype: 'Date',             xsdtype: 'xs:string',   bytes_on_char: undefined},
        {type: 'smalldatetime',     precision: 'deny',          scale: 'deny',          len: 'deny',            jstype: 'Date',             xsdtype: 'xs:dateTime', bytes_on_char: undefined},
        {type: 'time',              precision: 'deny',          scale: 'deny',          len: 'deny',            jstype: 'Date',             xsdtype: 'xs:time',     bytes_on_char: undefined},
        //Character strings
        {type: 'char',              precision: 'deny',          scale: 'deny',          len: 'deny_max',        jstype: 'string',           xsdtype: 'xs:string',   bytes_on_char: 2},
        {type: 'text',              precision: 'deny',          scale: 'deny',          len: 2147483647,        jstype: 'string',           xsdtype: 'xs:string',   bytes_on_char: 1},
        {type: 'varchar',           precision: 'deny',          scale: 'deny',          len: 'allow',           jstype: 'string',           xsdtype: 'xs:string',   bytes_on_char: 1},
        {type: 'sysname',           precision: 'deny',          scale: 'deny',          len: 128,               jstype: 'string',           xsdtype: 'xs:string',   bytes_on_char: 1},
        //Unicode character strings
        {type: 'nchar',             precision: 'deny',          scale: 'deny',          len: 'deny_max',        jstype: 'string',           xsdtype: 'xs:string',   bytes_on_char: 2},
        {type: 'ntext',             precision: 'deny',          scale: 'deny',          len: 1073741823,        jstype: 'string',           xsdtype: 'xs:string',   bytes_on_char: 2},
        {type: 'nvarchar',          precision: 'deny',          scale: 'deny',          len: 'allow',           jstype: 'string',           xsdtype: 'xs:string',   bytes_on_char: 2},
        //Binary strings
        {type: 'binary',            precision: 'deny',          scale: 'deny',          len: 'deny_max',        jstype: undefined,          xsdtype: undefined,     bytes_on_char: undefined},
        {type: 'image',             precision: 'deny',          scale: 'deny',          len: 2147483647,        jstype: undefined,          xsdtype: undefined,     bytes_on_char: undefined},
        {type: 'varbinary',         precision: 'deny',          scale: 'deny',          len: 'allow',           jstype: undefined,          xsdtype: undefined,     bytes_on_char: undefined},
        //Other data types
        {type: 'hierarchyid',       precision: 'deny',          scale: 'deny',          len: 892,               jstype: undefined,          xsdtype: undefined,     bytes_on_char: undefined},
        {type: 'sql_variant',       precision: 'deny',          scale: 'deny',          len: 0,                 jstype: undefined,          xsdtype: undefined,     bytes_on_char: undefined},
        {type: 'xml',               precision: 'deny',          scale: 'deny',          len: -1,                jstype: undefined,          xsdtype: undefined,     bytes_on_char: undefined},
        {type: 'uniqueidentifier',  precision: 'deny',          scale: 'deny',          len: 'deny',            jstype: 'string',           xsdtype: 'xs:string',   bytes_on_char: undefined},
        {type: 'timestamp',         precision: 'deny',          scale: 'deny',          len: 'deny',            jstype: undefined,          xsdtype: undefined,     bytes_on_char: undefined},
        {type: 'geometry',          precision: 'deny',          scale: 'deny',          len: -1,                jstype: undefined,          xsdtype: undefined,     bytes_on_char: undefined},
        {type: 'geography',         precision: 'deny',          scale: 'deny',          len: -1,                jstype: undefined,          xsdtype: undefined,     bytes_on_char: undefined}
    ]
}