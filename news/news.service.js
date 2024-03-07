const mysql = require('mysql2/promise')
const doDBQuery = require('../_helpers/do-query')

module.exports = {
	getAll,
	getAllCurrent,
	getOne,
	addOne,
	editOne,
	deleteOne,
	changeStatus,
}

async function getAll() {
	const sql = `SELECT
                    news_id as id,
                    news_title as title,
                    news_event_dt as dt,
                    status,
                    news_synop,
                    news_article
                FROM
                    inbrc_news
                WHERE
                    deleted = 0
                ORDER BY dt DESC`

	news = await doDBQuery(sql)

	return news
}

async function getAllCurrent() {
	let today = new Date()
	let currentDate =
		today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()

	const sql =
		`SELECT
                    news_id as id,
                    news_title as title,
                    news_event_dt as dt,
                    status,
                    news_synop,
                    news_article
                FROM
                    inbrc_news
                WHERE
                    deleted = 0
                    AND
                    status = 1
                    AND
                    DATEDIFF( news_expire_dt, ` +
		`"` +
		currentDate +
		`") >= 0
                    AND
                    DATEDIFF( news_release_dt, ` +
		`"` +
		currentDate +
		`") < 0
                ORDER BY dt DESC`

	news = await doDBQuery(sql)
	return news
}

async function getOne(id) {
	const sql = 'select * from inbrc_news where news_id = ' + id
	news = await doDBQuery(sql)

	return news[0]
}

async function addOne({
	news_type_id,
	news_title,
	news_synop,
	news_article,
	news_event_dt,
	news_release_dt,
	news_expire_dt,
}) {
	var sql =
		'INSERT INTO inbrc_news SET\
        news_type_id = ?,\
        news_title = ?,\
        news_synop = ?,\
        news_article = ?,\
        news_event_dt = ?,\
        news_release_dt = ?,\
        news_expire_dt = ?,\
        created_dt = NOW(),\
        modified_dt= NOW()'

	var inserts = []
	inserts.push(
		news_type_id,
		news_title,
		news_synop,
		news_article,
		news_event_dt,
		news_release_dt,
		news_expire_dt
	)
	news = await doDBQuery(sql, inserts)

	return news
}

async function deleteOne(id) {
	const sql =
		'UPDATE inbrc_news SET deleted=1, deleted_dt= NOW() WHERE news_id = ' + id
	news = await doDBQuery(sql)

	return news
}

async function changeStatus({ id, status }) {
	const sql =
		'UPDATE inbrc_news SET status = "' + status + '" WHERE news_id = ' + id
	news = await doDBQuery(sql)

	return news
}

async function editOne({
	id,
	news_type_id,
	news_title,
	news_synop,
	news_article,
	news_event_dt,
	news_release_dt,
	news_expire_dt,
}) {
	var sql =
		'UPDATE inbrc_news SET \
        news_type_id = ?,\
        news_title = ?,\
        news_synop = ?,\
        news_article = ?,\
        news_event_dt = ?,\
        news_release_dt = ?,\
        news_expire_dt = ?,\
        modified_dt= NOW() WHERE news_id = ?'
	var inserts = []
	inserts.push(
		news_type_id,
		news_title,
		news_synop,
		news_article,
		news_event_dt,
		news_release_dt,
		news_expire_dt,
		id
	)
	news = await doDBQuery(sql, inserts)

	return news
}
