const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({users : [ { username : "", password : "", /*genre*/ preference : "", category : ""} ] })
  .write()

  
db.get('users')
  .push({ username: "JUCHEN", password: 'Juchen2!', preference: "Film", category : "R&B" })
  .write();