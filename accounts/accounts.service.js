const md5 = require('md5')
const notifyUser = require('../_helpers/send-mail')
const doDBQuery = require('../_helpers/do-query')

module.exports = {
	getAll,
	getType,
	getOne,
	addOne,
	deleteOne,
	editOne,
	getAllNominees,
	getMemberTypes,
	changeStatus,
}

async function getAll() {
	const sql =
		'select newsletter_recipient, account_id, account_id as id, member_type_id,  member_firstname, member_lastname,  CONCAT(member_firstname," ", member_lastname) as title, account_email,   modified_dt, modified_dt as dt, status from inbrc_accounts where deleted = 0 ORDER BY member_lastname ASC'
	accounts = await doDBQuery(sql)

	return accounts
}

async function getType(id) {
	const sql =
		'select account_id, account_id as id, member_type_id, member_firstname, member_lastname,  CONCAT(member_firstname," ", member_lastname) as title, account_email,   modified_dt, modified_dt as dt, status from inbrc_accounts where deleted = 0 AND member_type_id = ' +
		id +
		' ORDER BY dt DESC'
	accounts = await doDBQuery(sql)

	return accounts
}

async function getAllNominees() {
	const sql =
		'select account_id, account_id as id, member_type_id, member_firstname, member_lastname,  CONCAT(member_firstname," ", member_lastname) as title, account_email,   modified_dt, modified_dt as dt, status from inbrc_accounts where deleted = 0 and member_type_id = 12 ORDER BY member_lastname ASC'
	accounts = await doDBQuery(sql)

	return accounts
}

async function getOne(id) {
	const sql = 'select * from inbrc_accounts where account_id = ' + id
	account = await doDBQuery(sql)
	return account[0]
}

async function deleteOne(id) {
	const sql =
		'UPDATE inbrc_accounts SET deleted=1, deleted_dt= NOW() WHERE account_id=' +
		id
	account = await doDBQuery(sql)
	return account
}

async function addOne({
	email,
	member_firstname,
	member_lastname,
	account_addr_street,
	newsletter_recipient,
	member_type_id,
	account_addr_city,
	account_addr_state,
	account_addr_country,
	account_addr_postal,
	account_addr_phone,
}) {
	var sql = 'select * from inbrc_accounts where deleted = 0'
	accounts = await doDBQuery(sql)

	let account = accounts.find((u) => u.account_email === email)

	if (!account) {
		// no other users with proposed username
		sql = `INSERT INTO inbrc_accounts 
                    SET 
                    member_firstname = ?,
                    member_lastname =  ?,
                    account_email = ?,
                    account_addr_street = ?,
                    newsletter_recipient = ?,
                    member_type_id = ?,
                    account_addr_city = ?, 
                    account_addr_state = ?, 
                    account_addr_country = ?, 
                    account_addr_postal = ?, 
                    account_addr_phone = ?, 
                    STATUS = 1,
                    deleted = 0,
                    created_dt = NOW(),
                    modified_dt = NOW()`

		var inserts = []
		inserts.push(
			member_firstname,
			member_lastname,
			email,
			account_addr_street,
			newsletter_recipient,
			member_type_id,
			account_addr_city,
			account_addr_state,
			account_addr_country,
			account_addr_postal,
			account_addr_phone
		)
		account = await doDBQuery(sql, inserts)
		account.error = ''
		const msg =
			'The account for ' +
			member_firstname +
			' ' +
			member_lastname +
			' email = ' +
			email
		console.log(msg)
		notifyUser(msg, 'director@kamilpatelscholarship.org').catch(console.error)
	} else {
		account.error = 'Account with email ' + email + ' already exists'
		console.log(account.error)
	}

	return account
}

async function editOne({
	id,
	account_email,
	member_firstname,
	member_lastname,
	account_addr_street,
	newsletter_recipient,
	member_type_id,
	account_addr_city,
	account_addr_state,
	account_addr_country,
	account_addr_postal,
	account_addr_phone,
}) {
	let sql =
		'SELECT * FROM inbrc_accounts WHERE deleted = 0 AND account_id <> ' + id
	accounts = await doDBQuery(sql)
	let account = accounts.find((u) => u.account_email === account_email)

	if (!account) {
		// no other users with proposed username

		sql = `UPDATE inbrc_accounts SET 
                    account_email = ?,
                    member_firstname = ?,
                    member_lastname =  ?,
                    account_addr_street = ?,
                    newsletter_recipient = ?,
                    member_type_id = ?,
                    account_addr_city = ?, 
                    account_addr_state = ?, 
                    account_addr_country = ?, 
                    account_addr_postal = ?, 
                    account_addr_phone = ?,
                    modified_dt= NOW() 
                WHERE account_id = ?`

		var inserts = []
		inserts.push(
			account_email,
			member_firstname,
			member_lastname,
			account_addr_street,
			newsletter_recipient,
			member_type_id,
			account_addr_city,
			account_addr_state,
			account_addr_country,
			account_addr_postal,
			account_addr_phone,
			id
		)
		account = await doDBQuery(sql, inserts)
		account.error = ''

		const msg =
			'The account for ' +
			member_firstname +
			' ' +
			member_lastname +
			'  has been modified email = ' +
			account_email
		console.log(msg)
		notifyUser(msg, 'director@kamilpatelscholarship.org').catch(console.error)
	} else {
		account.error = 'Account with email ' + account_email + ' already exists'
		console.log(account.error)
	}
	return account
}

async function changeStatus({ id, status }) {
	const sql =
		'UPDATE inbrc_accounts SET STATUS = "' +
		status +
		'" WHERE account_id  = ' +
		id
	account = await doDBQuery(sql)
	return account
}

async function getMemberTypes() {
	const sql = 'SELECT * FROM inbrc_member_types WHERE 1'
	membertypes = await doDBQuery(sql)
	return membertypes
}
