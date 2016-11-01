const sqlite3 = require('sqlite3');
const Bluebird = require('bluebird');
const Datastore = require('nedb');
const path = require('path');
const fs = Bluebird.promisifyAll(require('fs'));
const async = require('asyncawait/async');
const await = require('asyncawait/await');

module.exports = function converter(dbParam, nedbFolder = '.', ext='nedb') {
  if(!dbParam) {
    return  Promise.reject(new Error("Forgot to specify the location of the db file"));
  }
  return (async (convert))(dbParam, nedbFolder, ext);
}

function convert(sqlDbFile, nedbFolder, ext) {
  let exporter = new SqliteToJson(sqlDbFile);
  Bluebird.promisifyAll(exporter);
  let tables = await (exporter.tablesAsync());
  let nedbs = tables.map(table => {
    let tableData = await (exporter.dataForAsync(table));
    trimJSON(tableData);
    let dbTmp = new Datastore({filename: path.join(nedbFolder, `${table}.${ext}`), autoload: true});
    Bluebird.promisifyAll(dbTmp);
    await (dbTmp.insertAsync(tableData));
  });
}

function trimJSON(data) {
  data.forEach(item => Object.keys(item)
                             .filter(key => !item[key])
                             .map(key => delete item[key]));
}

class SqliteToJson {
  constructor(dbFile) {
    this.client = new sqlite3.Database(dbFile);
  }
  tables(cb) {
    var query = "SELECT name FROM sqlite_master WHERE type='table'";
    this.client.all(query, function (err, tables) {
      if (err)  return cb(err);
      cb(null, tables.map(r => r.name));
    });
  }
  dataFor(table, cb) {
    this.client.all('SELECT * FROM '+table, cb);
  }
}
