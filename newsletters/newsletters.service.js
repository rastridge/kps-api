const mysql = require('mysql2/promise')
const doDBQuery = require('../_helpers/do-query')
const recipientMemberMatch = require('_helpers/recipient-member-match')
const activityLog = require('_helpers/activity-log')

const NEWSLETTER_BEGIN_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1.0' />
<style>
html {
font-size: 12px;
@media screen and (min-width: 576px) {
font-size: 14px;
}
@media screen and (min-width: 768px) {
font-size: 16px;
}
@media screen and (min-width: 1200px) {
font-size: 18px;
}
}
.nl-container {	background-color: #FFF;
width: 100%;
padding-top: 2rem;
padding-bottom: 2rem;
}
.nl-banner { width: 100%;
padding-top: 0.5rem;
padding-bottom: 0.5rem;
color: #FFF;
background-color: #00D;
font-family: Verdana, Geneva, sans-serif;
font-weight: bold;
font-size: 1rem;
text-align: center;
@media screen and (min-width: 576px) {
padding-top: 1rem;
padding-bottom: 1rem;
font-size: 2rem;
}
}
.nl-content {
width: 80%;
padding: 1rem;
font-size: 1.5rem;
}
.nl-footer { font-size: 1rem;
padding: 1rem;
}
@media screen and (min-width: 576px) {
.nl-banner {
padding-top: 1rem;
padding-bottom: 1rem;
font-size: 2rem;
}
.ql-align-center {	text-align: center;	}
.ql-align-justify {	text-align: justify;}
.ql-align-right {	text-align: right;}
.ql-indent-1,
.ql-indent-2,
.ql-indent-3 {
background: #f9f9f9;
border-left: 10px solid #ccc;
margin: 1.5em 10px;
padding: 0.5em 10px;
}
.img-fluid {
display: block;
margin-left: auto;
margin-right: auto;
}
</style>
</head>
<body>
<div class='nl-container'>
 <div class='nl-banner'>
  <h2>Kamil Patel Memorial</h2><h2> Scholarship News</h2>
 </div>
 <div>  <!-- message -->`

const NEWSLETTER_END_HTML = `</div> <!-- message -->
</div>
</body>
</html>`

module.exports = {
	getAll,
	getOne,
	addOne,
	editOne,
	sendNewsletter,
	deleteOne,
	changeStatus,
}
async function sendNewsletter({
	id,
	newsletter_body_html,
	newsletter_subject,
	recipient_type_id,
}) {
	// activityLog('email', 'newsletter_body_html= ', newsletter_body_html)

	const sql = `SELECT
                    account_id,
                    member_firstname,
                    member_lastname,
                    member_type_id,
                    account_email,
                    account_addr_phone
                FROM
                    accounts
                WHERE
                    deleted = 0
                    AND
                    status = 1
                    AND
                    newsletter_recipient = 1
                ORDER BY account_email ASC`

	// Eligible accounts
	const accounts = await doDBQuery(sql)

	// Recipient type matches
	const recipients = accounts.filter(function (el) {
		return recipientMemberMatch(recipient_type_id, el)
	})

	const rec_cnt = recipients.length

	;(function myLoop(i) {
		// Using recursion
		// Send emails to Elasticemail slowly
		setTimeout(function () {
			const trackingpixel = `<img src="${API_URL}/newsletters/track?account_id=${
				recipients[i - 1].account_id
			}&newsletter_id=${id}" height="1" width="1" alt="" />`

			const email = {
				from: FROM,
				fromName: FROM_NAME,
				to: recipients[i - 1].account_email,
				subject: newsletter_subject,
				body_text: '',
				body_html:
					NEWSLETTER_BEGIN_HTML +
					trackingpixel +
					newsletter_body_html +
					NEWSLETTER_END_HTML,
			}
			activityLog('email', 'email= ', email)
			sendEmail(email)
			if (--i) myLoop(i) //  decrement i and call myLoop again if i > 0
		}, 500)
	})(rec_cnt)

	// Assume emails sent - update DB
	const sql2 = `UPDATE newsletters
								SET
									newsletter_sent = NOW(),
									newsletter_send = NOW(),
									newsletter_send_complete = NOW(),
									newsletter_send_status = 3,
									newsletter_opened_cnt = 0,
									newsletter_recp_cnt = ${rec_cnt}
									WHERE newsletter_id = ${id}`

	newsletters = await doDBQuery(sql2)

	return newsletters
}

async function getAll() {
	const sql = `SELECT
                    newsletter_id as id,
                    newsletter_recipient_type_id,
                    newsletter_subject as subject,
                    newsletter_subject as title,
                    newsletter_body_text as body_text,
                    newsletter_body_html as body_html,
                    newsletter_sent as sent_dt,
                    status,
                    deleted,
                    deleted_dt,
                    created_dt,
                    created_dt as dt,
                    modified_dt

                FROM
                    inbrc_newsletters
                WHERE
                    deleted = 0
                ORDER BY dt DESC`

	newsletter = await doDBQuery(sql)

	return newsletter
}

async function getOne(id) {
	const sql = 'select * from inbrc_newsletters where newsletter_id = ' + id
	newsletter = await doDBQuery(sql)

	return newsletter[0]
}

async function addOne({
	newsletter_recipient_type_id,
	newsletter_subject,
	newsletter_body_text,
	newsletter_body_html,
	newsletter_sent,
}) {
	var sql =
		'INSERT INTO inbrc_newsletters SET\
                newsletter_recipient_type_id = ?,\
                newsletter_subject = ?,\
                newsletter_body_text = ?,\
                newsletter_body_html = ?,\
                newsletter_sent = ?,\
                created_dt = NOW(),\
                modified_dt= NOW()'

	var inserts = []
	inserts.push(
		newsletter_recipient_type_id,
		newsletter_subject,
		newsletter_body_text,
		newsletter_body_html,
		newsletter_sent
	)
	newsletter = await doDBQuery(sql, inserts)

	return newsletter
}

async function deleteOne(id) {
	const sql =
		'UPDATE inbrc_newsletters SET deleted=1, deleted_dt= NOW() WHERE newsletter_id = ' +
		id
	newsletter = await doDBQuery(sql)

	return newsletter
}

async function changeStatus({ id, status }) {
	const sql =
		'UPDATE inbrc_newsletters SET status = "' +
		status +
		'" WHERE newsletter_id = ' +
		id
	newsletter = await doDBQuery(sql)

	return newsletter
}

async function editOne({
	id,
	newsletter_recipient_type_id,
	newsletter_subject,
	newsletter_body_text,
	newsletter_body_html,
	newsletter_sent,
}) {
	var sql =
		'UPDATE inbrc_newsletters SET \
                    newsletter_recipient_type_id = ?,\
                    newsletter_subject = ?,\
                    newsletter_body_text = ?,\
                    newsletter_body_html = ?,\
                    newsletter_sent = ?,\
                    modified_dt= NOW()\
                WHERE newsletter_id = ?'

	var inserts = []
	inserts.push(
		newsletter_recipient_type_id,
		newsletter_subject,
		newsletter_body_text,
		newsletter_body_html,
		newsletter_sent,
		id
	)
	newsletter = await doDBQuery(sql, inserts)

	return newsletter
}
