const config = require('config.json')
const mysql = require('mysql2/promise')

module.exports = doDBQuery

async function doDBQuery(sql, inserts) {
    const conn1 = await mysql.createConnection({
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
    })
    if(inserts) {
        sql = mysql.format(sql, inserts)
    }
    const [rows, fields] = await conn1.execute(sql)
    conn1.close()
    
    return rows
}