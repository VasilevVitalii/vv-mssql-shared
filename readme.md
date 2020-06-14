## Install & Use
```cmd
npm i vv-mssql-shared
```
```js
const vvms = require('vv-mssql-shared')

let script_create_or_alter_table = vvms.depot_sch_table('dbo', 'table1', 'my table #1', [
    {name: 'fld1', description: 'field #1 - primary key', type: 'int', identity: true, pk_position: 1},
    {name: 'fld2', description: 'field #2', type: 'bit'},
    {name: 'fld3', description: 'field #3', type: 'nvarchar', len_chars: 100},
    {name: 'fld4', description: 'field #4', type: 'nvarchar', len_chars: 'max'},
    {name: 'fld5', description: 'field #5', type: 'decimal', precision: 14, scale: 3}
], 'ignore')
console.log(script_create_or_alter_table)
```
## Typedefs

<dl>
<dt><a href="#sqltype">sqltype</a> : <code>&#x27;bigint&#x27;</code> | <code>&#x27;bit&#x27;</code> | <code>&#x27;decimal&#x27;</code> | <code>&#x27;int&#x27;</code> | <code>&#x27;money&#x27;</code> | <code>&#x27;numeric&#x27;</code> | <code>&#x27;smallint&#x27;</code> | <code>&#x27;smallmoney&#x27;</code> | <code>&#x27;tinyint&#x27;</code> | <code>&#x27;float&#x27;</code> | <code>&#x27;real&#x27;</code> | <code>&#x27;date&#x27;</code> | <code>&#x27;datetime2&#x27;</code> | <code>&#x27;datetime&#x27;</code> | <code>&#x27;datetimeoffset&#x27;</code> | <code>&#x27;smalldatetime&#x27;</code> | <code>&#x27;time&#x27;</code> | <code>&#x27;char&#x27;</code> | <code>&#x27;text&#x27;</code> | <code>&#x27;varchar&#x27;</code> | <code>&#x27;sysname&#x27;</code> | <code>&#x27;nchar&#x27;</code> | <code>&#x27;ntext&#x27;</code> | <code>&#x27;nvarchar&#x27;</code> | <code>&#x27;binary&#x27;</code> | <code>&#x27;image&#x27;</code> | <code>&#x27;varbinary&#x27;</code> | <code>&#x27;hierarchyid&#x27;</code> | <code>&#x27;sql_variant&#x27;</code> | <code>&#x27;xml&#x27;</code> | <code>&#x27;uniqueidentifier&#x27;</code> | <code>&#x27;timestamp&#x27;</code> | <code>&#x27;geometry&#x27;</code> | <code>&#x27;geography&#x27;</code></dt>
<dd><p>MS SQL datatype</p>
</dd>
<dt><a href="#type_column">type_column</a></dt>
<dd><p>MS SQL tables column</p>
</dd>
<dt><a href="#type_sql">type_sql</a></dt>
<dd><p>MS SQL datatype params</p>
</dd>
<dt><a href="#type_sql_object_name">type_sql_object_name</a></dt>
<dd></dd>
</dl>

<a name="sqltype"></a>

## sqltype : <code>&#x27;bigint&#x27;</code> \| <code>&#x27;bit&#x27;</code> \| <code>&#x27;decimal&#x27;</code> \| <code>&#x27;int&#x27;</code> \| <code>&#x27;money&#x27;</code> \| <code>&#x27;numeric&#x27;</code> \| <code>&#x27;smallint&#x27;</code> \| <code>&#x27;smallmoney&#x27;</code> \| <code>&#x27;tinyint&#x27;</code> \| <code>&#x27;float&#x27;</code> \| <code>&#x27;real&#x27;</code> \| <code>&#x27;date&#x27;</code> \| <code>&#x27;datetime2&#x27;</code> \| <code>&#x27;datetime&#x27;</code> \| <code>&#x27;datetimeoffset&#x27;</code> \| <code>&#x27;smalldatetime&#x27;</code> \| <code>&#x27;time&#x27;</code> \| <code>&#x27;char&#x27;</code> \| <code>&#x27;text&#x27;</code> \| <code>&#x27;varchar&#x27;</code> \| <code>&#x27;sysname&#x27;</code> \| <code>&#x27;nchar&#x27;</code> \| <code>&#x27;ntext&#x27;</code> \| <code>&#x27;nvarchar&#x27;</code> \| <code>&#x27;binary&#x27;</code> \| <code>&#x27;image&#x27;</code> \| <code>&#x27;varbinary&#x27;</code> \| <code>&#x27;hierarchyid&#x27;</code> \| <code>&#x27;sql\_variant&#x27;</code> \| <code>&#x27;xml&#x27;</code> \| <code>&#x27;uniqueidentifier&#x27;</code> \| <code>&#x27;timestamp&#x27;</code> \| <code>&#x27;geometry&#x27;</code> \| <code>&#x27;geography&#x27;</code>
MS SQL datatype

**Kind**: global typedef  
<a name="type_column"></a>

## type\_column
MS SQL tables column

**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| name | <code>string</code> | 
| type | [<code>sqltype</code>](#sqltype) | 
| [len_chars] | <code>number</code> \| <code>&#x27;max&#x27;</code> | 
| [precision] | <code>number</code> | 
| [scale] | <code>number</code> | 
| [nullable] | <code>boolean</code> | 
| [identity] | <code>boolean</code> | 
| [pk_position] | <code>number</code> | 
| [description] | <code>string</code> | 

<a name="type_sql"></a>

## type\_sql
MS SQL datatype params

**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| precision | <code>&#x27;deny&#x27;</code> \| <code>&#x27;allow&#x27;</code> \| <code>number</code> | 
| scale | <code>&#x27;deny&#x27;</code> \| <code>&#x27;allow&#x27;</code> \| <code>number</code> | 
| len | <code>&#x27;deny&#x27;</code> \| <code>&#x27;allow&#x27;</code> \| <code>&#x27;deny\_max&#x27;</code> \| <code>number</code> | 
| jstype | <code>&#x27;number&#x27;</code> \| <code>&#x27;Date&#x27;</code> \| <code>&#x27;string&#x27;</code> | 
| xsdtype | <code>&#x27;xs:integer&#x27;</code> \| <code>&#x27;xs:decimal&#x27;</code> \| <code>&#x27;xs:boolean&#x27;</code> \| <code>&#x27;xs:date&#x27;</code> \| <code>&#x27;xs:dateTime&#x27;</code> \| <code>&#x27;xs:time&#x27;</code> \| <code>&#x27;xs:string&#x27;</code> | 
| bytes_on_char | <code>number</code> | 
| type | [<code>sqltype</code>](#sqltype) | 

<a name="type_sql_object_name"></a>

## type\_sql\_object\_name
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| base | <code>string</code> | 
| schema | <code>string</code> | 
| table | <code>string</code> | 

