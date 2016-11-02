# sqlite-to-nedb
Util for converting a sqlite database into a nedb database (one file per table)

the Module is quite simple to use, and it returns you a Promsie:
```javascript
const converter = require('sqlite-to-nedb');
let dbLocation = './sqlite/data.db';    // location of your sqlite file
let nedbFolder = './datastore';         // destination folder where your files have to be save, defaults to "."
let ext = '.ne':                        // extension of your nedb files, defaults to ".nedb"

// three ways to use the module:
converter(dbLocation, nedbFolder, ext)  // OR
converter(dbLocation, nedbFolder)       // OR
converter(dbLocation)
```
