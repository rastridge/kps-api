const config = require('config.json')
const mysql = require('mysql2/promise')
const notifyUser = require('../_helpers/send-mail')
const doDBQuery = require('../_helpers/do-query')
const activityLog = require('../_helpers/activity-log')

module.exports = {
	getAll,
	getSummary,
	getOne,
	addOne,
	deleteOne,
	editOne,
	editNomineeText,
	editOneEval,
	getCurrent,
	getOneByNomineeId,
	changeStatus,
}

async function getAll() {
	const sql = `select
                s.scholarship_id,
                a.account_id as nominee_account_id,
                a.member_firstname as nominee_firstname,
                a.member_lastname as nominee_lastname,
                a.account_addr_street as nominee_street,
                a.account_addr_state as nominee_state,
                a.account_addr_city as nominee_city,
                a.account_addr_postal as nominee_postal,
                a.account_addr_phone as nominee_phone,
                a.account_email as nominee_email,
                b.account_id as nominator_account_id,
                b.member_firstname as nominator_firstname,
                b.member_lastname as nominator_lastname,
                b.account_addr_street as nominator_street,
                b.account_addr_state as nominator_state,
                b.account_addr_city as nominator_city,
                b.account_addr_postal as nominator_postal,
                b.account_addr_phone as nominator_phone,
                b.account_email as nominator_email,
                s.nominator_title as nominator_title,
                s.nominator_team as nominator_team,
                s.nominator_text as nominator_text,
                s.nominee_text as nominee_text,
                s.created_dt as created_dt,
                s.modified_dt as modified_dt,

                s.scholarship_id as id,
                s.status,
                s.nominator_team as title,
                s.created_dt as dt
            FROM
                inbrc_scholarship s, inbrc_accounts a, inbrc_accounts b
            WHERE
                s.nominee_member_id = a.account_id
                AND
                s.nominator_account_id = b.account_id
                AND
                s.deleted = 0
            ORDER BY
                dt DESC`

	const scholarships = await doDBQuery(sql)

	return scholarships
}

async function getSummary() {
	const sql = `select
                    s.scholarship_id as id,
                    a.member_firstname as nominee_firstname,
                    a.member_lastname as nominee_lastname,
                    a.account_addr_street as nominee_street,
                    a.account_addr_state as nominee_state,
                    a.account_addr_city as nominee_city,
                    a.account_addr_phone as nominee_phone,
                    a.account_email as nominee_email,
                    b.member_firstname as nominator_firstname,
                    b.member_lastname as nominator_lastname,
                    b.account_addr_street as nominator_street,
                    b.account_addr_state as nominator_state,
                    b.account_addr_city as nominator_city,
                    b.account_addr_phone as nominator_phone,
                    b.account_email as nominator_email,
                    s.nominator_title as nominator_title,
                    s.nominator_team as nominator_team,
                    case when s.nominator_text = "" then 'Incomplete' else 'Completed' end as nominator_text,
                    case when s.nominee_text = "" then 'Incomplete' else 'Completed' end as nominee_text,
                    s.eval_name_1,
                    s.eval_rating_1,
                    s.eval_name_2,
                    s.eval_rating_2,
                    s.eval_name_3,
                    s.eval_rating_3,
                    s.eval_name_4,
                    s.eval_rating_4,
                    s.eval_name_5,
                    s.eval_rating_5,
                    s.modified_dt,
                    s.modified_dt as modified_dt,
                    s.status
                FROM
                    inbrc_scholarship s, inbrc_accounts a, inbrc_accounts b
                WHERE
                    s.nominee_member_id = a.account_id
                    AND
                    s.nominator_account_id = b.account_id
                    AND
                    s.deleted = 0
                    AND
                    s.status = 1`

	const scholarships = await doDBQuery(sql)

	return scholarships
}

async function getOneByNomineeId(account_id) {
	const sql =
		`select
									scholarship_id,
									nominator_title,
									nominator_team,
									nominator_text,
									nominee_text,
									modified_dt,
									status
							from
									inbrc_scholarship
							where
									nominee_member_id = ` + account_id
	const scholarship = await doDBQuery(sql)
	return scholarship[0]
}

async function getOne(id) {
	const sql = `select
                    s.scholarship_id as id,
                    a.account_id as nominee_account_id,
                    a.member_firstname as nominee_firstname,
                    a.member_lastname as nominee_lastname,
                    a.account_addr_street as nominee_street,
                    a.account_addr_state as nominee_state,
                    a.account_addr_city as nominee_city,
                    a.account_addr_postal as nominee_postal,
                    a.account_addr_phone as nominee_phone,
                    a.account_email as nominee_email,
                    b.account_id as nominator_account_id,
                    b.member_firstname as nominator_firstname,
                    b.member_lastname as nominator_lastname,
                    b.account_addr_street as nominator_street,
                    b.account_addr_state as nominator_state,
                    b.account_addr_city as nominator_city,
                    b.account_addr_postal as nominator_postal,
                    b.account_addr_phone as nominator_phone,
                    b.account_email as nominator_email,
                    s.nominator_title as nominator_title,
                    s.nominator_team as nominator_team,
                    s.nominator_text as nominator_text,
                    s.nominee_text as nominee_text,
                    s.eval_name_1,
                    s.eval_rating_1,
                    s.eval_name_2,
                    s.eval_rating_2,
                    s.eval_name_3,
                    s.eval_rating_3,
                    s.eval_name_4,
                    s.eval_rating_4,
                    s.eval_name_5,
                    s.eval_rating_5,
                    s.modified_dt as modified_dt,
                    s.status
                FROM
                    inbrc_scholarship s, inbrc_accounts a, inbrc_accounts b
                WHERE
                    s.scholarship_id = ${id}
                    AND
                    s.nominee_member_id = a.account_id
                    AND
                    s.nominator_account_id = b.account_id
                    AND
                    s.deleted = 0`

	const scholarship = await doDBQuery(sql)
	return scholarship[0]
}

//
// delete scholarship and associated nominee account
//
async function deleteOne(scholarship_id) {
	try {
		const conn = await mysql.createConnection({
			host: config.db.host,
			user: config.db.user,
			password: config.db.password,
			database: config.db.database,
		})
		await conn.beginTransaction()
		//
		// Save ACCOUNT_ID of nominee in scholarship being deleted
		//
		let sql1 =
			'SELECT nominee_member_id FROM inbrc_scholarship WHERE scholarship_id = ?'
		let inserts1 = []
		inserts1.push(scholarship_id)
		sql1 = mysql.format(sql1, inserts1)
		let [rows, fields] = await conn.query(sql1)
		// save id
		let account_id = rows[0].nominee_member_id
		//
		// delete scholarship record
		//
		let sql0 =
			'UPDATE inbrc_scholarship SET deleted = 1, deleted_dt = NOW(), STATUS = 0, modified_dt = NOW() WHERE scholarship_id = ?'
		let inserts0 = []
		inserts0.push(scholarship_id)
		sql0 = mysql.format(sql0, inserts0)
		await conn.query(sql0)

		//
		// delete nominee record
		//
		let sql =
			'UPDATE inbrc_accounts SET deleted = 1, deleted_dt = NOW(), STATUS = 0, modified_dt = NOW() WHERE account_id = ?'
		let inserts = []
		inserts.push(account_id)
		sql = mysql.format(sql, inserts)
		await conn.query(sql)

		await conn.commit()

		const msg =
			'A scholarship nomination and account has been deleted for nominee id = ' +
			account_id
		console.log(msg)
		notifyUser(msg, 'director@kamilpatelscholarship.org').catch(console.error)
		await conn.end()

		return 1
	} catch (e) {
		console.log(e)
		await conn.rollback()
		await conn.end()
	}
}

async function addOne({
	nominee_firstname,
	nominee_lastname,
	nominee_phone,
	nominee_email,
	nominator_firstname,
	nominator_lastname,
	nominator_email,
	nominator_phone,
	nominator_title,
	nominator_team,
	nominator_text,
}) {
	try {
		const CONN = await mysql.createConnection({
			host: config.db.host,
			user: config.db.user,
			password: config.db.password,
			database: config.db.database,
		})
		await CONN.beginTransaction()
		//
		// See if Nominator email already exists
		//
		const sql =
			'SELECT account_email, account_id FROM inbrc_accounts WHERE deleted = 0'
		const accounts = await doDBQuery(sql)
		let nominator_account_id = 0
		const account = accounts.find((u) => u.account_email === nominator_email)
		//
		// New or existing?
		//
		if (!account) {
			// new nominator account - member type 3
			let sql0 = `INSERT INTO inbrc_accounts SET
                member_firstname = ?,
                member_lastname = ?,
                account_email = ?,
                account_addr_phone = ?,
                member_type_id = "3",
                created_dt = NOW(),
                modified_dt= NOW()`

			let inserts0 = []
			inserts0.push(
				nominator_firstname,
				nominator_lastname,
				nominator_email,
				nominator_phone
			)
			sql0 = mysql.format(sql0, inserts0)
			let [rows, fields] = await CONN.query(sql0)
			const accountnew = rows

			// new nominator account created, save id for scholarship record
			nominator_account_id = accountnew.insertId
			activityLog(
				'scholarships',
				'IN addOne 3 nominator_account_id =  ',
				nominator_account_id
			)
		} else {
			//  nominator account exists, save id for scholarship record
			nominator_account_id = account.account_id
		}
		//
		// create new Nominee account for  member type 12
		//
		let sql1 = `INSERT INTO inbrc_accounts SET
            member_firstname = ?,
            member_lastname = ?,
            account_email = ?,
            account_addr_phone = ?,
            member_type_id = "12",
            created_dt = NOW(),
            modified_dt= NOW()`

		let inserts1 = []
		inserts1.push(
			nominee_firstname,
			nominee_lastname,
			nominee_email,
			nominee_phone
		)
		sql1 = mysql.format(sql1, inserts1)
		let [rows, fields] = await CONN.query(sql1)
		const nominee = rows
		// save id for scholarship record
		const nominee_member_id = nominee.insertId

		//
		// create new scholarship record
		//
		let sql2 = `INSERT INTO inbrc_scholarship
                SET
                    nominee_member_id = ?,
                    nominator_account_id = ?,
                    nominator_title = ?,
                    nominator_team = ?,
                    nominator_text = ?,
                    nominee_text = '',
                    created_dt = NOW(),
                    modified_dt= NOW()`

		let inserts2 = []
		inserts2.push(
			nominee_member_id,
			nominator_account_id,
			nominator_title,
			nominator_team,
			nominator_text
		)
		sql2 = mysql.format(sql2, inserts2)
		if (true) {
			// hack to allow creation of rows variable
			let [rows, fields] = await CONN.query(sql2)
			const scholarship = rows
			const scholarship_id = scholarship.insertId

			//
			// Insert scholarship id in nominee account
			//
			let sql3 =
				`UPDATE
					inbrc_accounts
				SET
					scholarship_id = ?,
					modified_dt= NOW()
				WHERE
					account_id = ` + nominee_member_id

			let inserts3 = []
			inserts3.push(scholarship_id, nominee_member_id)
			sql3 = mysql.format(sql3, inserts3)

			await CONN.query(sql3)
		}

		await CONN.commit()

		const msg =
			'A scholarship nomination has been entered by ' +
			nominator_firstname +
			' ' +
			nominator_lastname
		notifyUser(msg, 'director@kamilpatelscholarship.org').catch(console.error)
		await CONN.end()

		return 'SUCCESS ' + msg
	} catch (e) {
		await CONN.rollback()
		await CONN.end()
		return 'ERROR ' + e
	}
}

async function editOne({
	id,
	nominator_title,
	nominator_team,
	nominator_text,
	nominee_text,
}) {
	// update scholarship
	let sql = `UPDATE inbrc_scholarship SET
                    nominator_title = ?,
                    nominator_team = ?,
                    nominator_text = ?,
                    nominee_text  =  ?,
                    modified_dt= NOW()
                WHERE scholarship_id = ?`

	let inserts = []
	inserts.push(
		nominator_title,
		nominator_team,
		nominator_text,
		nominee_text,
		id
	)
	const scholarship = await doDBQuery(sql, inserts)

	const msg =
		'The scholarship nomination from team ' +
		nominator_team +
		' has been modified'
	console.log(msg)
	return scholarship
}

async function editOneEval({
	scholarship_id,
	eval_rating_index,
	eval_rating,
	eval_name,
}) {
	let sql = `UPDATE inbrc_scholarship SET
                    eval_rating_${eval_rating_index} = ? ,
                    eval_name_${eval_rating_index} = ? ,
                    modified_dt= NOW()
                WHERE scholarship_id = ?`

	let inserts = []
	inserts.push(eval_rating, eval_name, scholarship_id)
	const scholarship = await doDBQuery(sql, inserts)

	const msg =
		'A scholarship with id ' +
		scholarship_id +
		' has been evaluated by ' +
		eval_name
	console.log(msg)
	notifyUser(msg, 'director@kamilpatelscholarship.org').catch(console.error)

	return scholarship
}

async function changeStatus({ id, status }) {
	// changeStatus scholarship nomination and nominee account
	try {
		const conn = await mysql.createConnection({
			host: config.db.host,
			user: config.db.user,
			password: config.db.password,
			database: config.db.database,
		})
		await conn.beginTransaction()

		// get nominee id from scholarship
		let sql1 =
			'SELECT nominee_member_id FROM inbrc_scholarship WHERE scholarship_id = ?'
		let inserts1 = []
		inserts1.push(id)
		sql1 = mysql.format(sql1, inserts1)

		let [rows, fields] = await conn.query(sql1)
		let account_id = rows[0].nominee_member_id

		let sql0 =
			'UPDATE inbrc_scholarship SET STATUS = ?, modified_dt = NOW() WHERE scholarship_id = ?'
		let inserts0 = []
		inserts0.push(status, id)
		sql0 = mysql.format(sql0, inserts0)

		await conn.query(sql0)

		let sql =
			'UPDATE inbrc_accounts SET STATUS = ?, modified_dt = NOW() WHERE account_id = ?'
		let inserts = []
		inserts.push(status, account_id)
		sql = mysql.format(sql, inserts)

		await conn.query(sql)
		//[rows, fields] = await conn.query('UPDATE inbrc_accounts SET deleted = 1, deleted_dt = NOW(), STATUS = 0, modified_dt = NOW() WHERE account_id = 1338')
		//console.log(rows[0])

		await conn.commit()

		const msg =
			'A scholarship nomination and account status has been changed for scholarship id = ' +
			id
		console.log(msg)
		notifyUser(msg, 'director@kamilpatelscholarship.org').catch(console.error)
		await conn.end()

		return 1
	} catch (e) {
		console.log(e)
		await conn.rollback()
		await conn.end()
	}
}

async function editNomineeText({ id, nominee_text }) {
	var sql =
		'UPDATE inbrc_scholarship SET \
        nominee_text = ? ,\
        modified_dt= NOW() WHERE scholarship_id = ?'

	var inserts = []
	inserts.push(nominee_text, id)
	const scholarship = await doDBQuery(sql, inserts)

	const msg =
		'A scholarship nominee with id ' +
		id +
		' has completed their scholarship form'
	console.log(msg)
	notifyUser(msg, 'director@kamilpatelscholarship.org').catch(console.error)

	return scholarship
}

async function getCurrent() {
	// get Scholarship items from db
	const sql = `SELECT
                scholarship_id,
                eval_name_1,
                eval_name_2,
                eval_name_3,
                eval_name_4,
                eval_name_5,
                eval_rating_1,
                eval_rating_2,
                eval_rating_3,
                eval_rating_4,
                eval_rating_5
            FROM
                inbrc_scholarship
            WHERE
                deleted = 0
                AND
                status = 1
                AND
                nominee_text != ''`

	const scholarships = await doDBQuery(sql)

	return scholarships
}
