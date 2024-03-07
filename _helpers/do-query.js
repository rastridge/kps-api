const { db_host, db_user, db_password, db_database } = require('config.js')
const mysql = require('mysql2/promise')

module.exports = doDBQuery

async function doDBQuery(sql, inserts) {
	const conn1 = await mysql.createConnection({
		host: db_host,
		user: db_user,
		password: db_password,
		database: db_database,
	})
	if (inserts) {
		sql = mysql.format(sql, inserts)
	}
	const [rows, fields] = await conn1.execute(sql)
	conn1.close()

	return rows
}
