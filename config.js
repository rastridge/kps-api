// config.js
require('dotenv').config()

module.exports = {
	secret: process.env.secret,
	host: process.env.host,
	port: process.env.port,
	secure: process.env.secure,
	user: process.env.user,
	pass: process.env.pass,

	db_host: process.env.db_host,
	db_user: process.env.db_user,
	db_password: process.env.db_password,
	db_database: process.env.db_database,

	siteContentPath: process.env.siteContentPath,
	siteUrl: process.env.siteUrl,
}
