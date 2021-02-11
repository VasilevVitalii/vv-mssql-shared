//@ts-check

let lib = require('./index.js')

console.log(lib.depot_sch_table('dbo', 'aaa', undefined, [{name: 'a', type: 'nvarchar', len_chars: 150, pk_position: 1, collate: 'SQL_Latin1_General_CP1_CS_AS'}], 'ignore'))
