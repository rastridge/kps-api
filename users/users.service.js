const config = require('config.json')
const jwt = require('jsonwebtoken')
const md5 = require('md5')
const notifyUser = require('../_helpers/send-mail')
const doDBQuery = require('../_helpers/do-query')
const generator = require('generate-password')

module.exports = {
	authenticate,
	reSet,
	getAll,
	getOne,
	addOne,
	deleteOne,
	editOne,
	changeStatus,
}

async function authenticate({ username, password }) {
	let lc_username = username.toLowerCase()

	const sql = 'SELECT * FROM inbrc_admin_users WHERE deleted = 0'
	users = await doDBQuery(sql)

	const user = users.find(
		(u) => u.admin_user_name === lc_username && u.admin_user_remind === password
	)
	if (user) {
		const { secret } = config
		const token = jwt.sign(
			{
				sub: user.admin_user_id,
				// exp: Math.floor(Date.now() / 1000) + 60 * 60,
			},
			secret
		)
		//create token here //, { expires In: '60 m' }
		// const token = jwt.sign({ sub: user.admin_user_id, exp: Math.floor(Date.now() / 1000) + ( 60*60)  }, secret)
		const { admin_user_remind, admin_user_pass, ...userWithoutPassword } = user

		return {
			...userWithoutPassword,
			token,
		}
	}
	return null
}

async function reSet({ username, email }) {
	let sql = 'select * from inbrc_admin_users WHERE 1 AND deleted = 0'
	users = await doDBQuery(sql)

	let user = users.find(
		(u) => u.admin_user_name === username && u.admin_user_email === email
	)
	if (user) {
		const msg = 'Password is "' + user.admin_user_remind + '"'
		notifyUser(msg, email).catch(console.error)

		return user
	}
}

async function getAll() {
	const sql =
		'select admin_user_name as title, modified_dt as dt, admin_user_id as id, admin_user_remind, admin_user_pass, STATUS as status from inbrc_admin_users where deleted = 0'
	users = await doDBQuery(sql)

	return users.map((u) => {
		//strips key value pair from all objects in the array with key=
		const { admin_user_remind, admin_user_pass, ...userWithoutPassword } = u
		return userWithoutPassword
	})
}

async function getOne(id) {
	const sql = 'select * from inbrc_admin_users where admin_user_id = ' + id
	user = await doDBQuery(sql)
	return user[0]
}

async function deleteOne(id) {
	const sql =
		'UPDATE inbrc_admin_users SET deleted=1, deleted_dt= NOW() WHERE admin_user_id=' +
		id
	user = await doDBQuery(sql)

	return user
}

async function addOne({ username, password, email, admin_user_perm }) {
	let lc_username = username.toLowerCase()

	const sql = 'select * from inbrc_admin_users where deleted = 0'
	users = await doDBQuery(sql)
	let user = users.find((u) => u.admin_user_name === lc_username)

	if (!user) {
		// no other users with proposed username
		let hashedpassword = md5(password).substring(3, 11)
		const sql = `INSERT INTO 
                        inbrc_admin_users 
                    SET 
                        admin_user_name  = ?,
                        admin_user_pass  = ?,
                        admin_user_remind  = ?,  
                        admin_user_email  = ?,
                        admin_user_perm = ?,
                        status = 1, 
                        created_dt = NOW(), 
                        modified_dt = NOW()`

		var inserts = []
		inserts.push(lc_username, hashedpassword, password, email, admin_user_perm)
		user = await doDBQuery(sql, inserts)
		user.error = ''
		const msg =
			'An account for user ' +
			lc_username +
			'  has been created ' +
			password +
			' ' +
			hashedpassword +
			' ' +
			email
		console.log(msg)
		notifyUser(msg, 'director@kamilpatelscholarship.org').catch(console.error)
	} else {
		user.error = 'A user with username ' + lc_username + ' already exists'
		console.log(user.error)
	}
	return user
}

async function editOne({ id, username, password, email, admin_user_perm }) {
	let lc_username = username.toLowerCase()

	let sql =
		'SELECT * FROM inbrc_admin_users WHERE deleted = 0 AND admin_user_id <> ' +
		id
	users = await doDBQuery(sql)
	let user = users.find((u) => u.admin_user_name === lc_username)

	if (!user) {
		// no other users with proposed username

		sql = `UPDATE inbrc_admin_users 
                SET 
                    admin_user_name = ?, 
                    admin_user_email = ?, 
                    admin_user_remind = ?, 
                    admin_user_pass = ?, 
                    admin_user_perm = ?,
                    modified_dt= NOW() 
                WHERE 
                    admin_user_id = ?`

		let hashedpassword = md5(password).substring(3, 11)

		var inserts = []
		inserts.push(
			lc_username,
			email,
			password,
			hashedpassword,
			admin_user_perm,
			id
		)
		user = await doDBQuery(sql, inserts)
		user.error = ''
		const msg =
			'The account for user ' +
			lc_username +
			'  has been modified ' +
			password +
			' ' +
			hashedpassword +
			' ' +
			email
		console.log(msg)
		notifyUser(msg, 'director@kamilpatelscholarship.org').catch(console.error)
	} else {
		user.error = 'A user with username ' + lc_username + ' already exists'
		console.log(user.error)
	}
	return user
}

async function changeStatus({ id, status }) {
	const sql =
		'UPDATE inbrc_admin_users SET STATUS = "' +
		status +
		'" WHERE admin_user_id  = ' +
		id
	user = await doDBQuery(sql)

	return user
}
