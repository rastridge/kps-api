const mysql = require('mysql2/promise');
const config = require('config.json');
const doDBQuery = require('../_helpers/do-query')

module.exports = {
    getAll,
    getMenuItems,
    getOne,
    addOne,
    editOne,
    deleteOne,
    changeStatus
}

async function getAll() {

    const sql = 'select content_id as id, content_name as title, modified_dt as dt, status, content_name, content_body, content_release_dt, content_expire_dt FROM inbrc_content WHERE deleted = 0'
    content = await doDBQuery(sql)

    return  content
}

async function getMenuItems() {

    //const sql = 'select content_id as id, content_name as title, modified_dt as dt, status, content_name, content_body, content_release_dt, content_expire_dt FROM inbrc_content WHERE deleted = 0 AND status = 1 AND content_expire_dt < NOW()'
    const sql = 'select content_id as id, content_name as title, modified_dt as dt, status, content_name, content_body, content_release_dt, content_expire_dt FROM inbrc_content WHERE deleted = 0 AND status = 1'
    content = await doDBQuery(sql)

    return  content
}

async function getOne(id) {

    const sql = 'select * from inbrc_content where content_id = ' + id
    content = await doDBQuery(sql)

    return content[0]
}


async function addOne({ content_name, content_body, content_release_dt, content_expire_dt }) {

    var sql = `INSERT INTO inbrc_content SET
        content_name = ?,
        content_body= ?,
        content_release_dt = ?,
        content_expire_dt = ?,
        created_dt = NOW(),
        modified_dt= NOW()`

    var inserts = []
    inserts.push(content_name, content_body, content_release_dt, content_expire_dt)
    content = await doDBQuery(sql, inserts)

    return content

}

async function deleteOne(id) {

    const sql = 'UPDATE inbrc_content SET deleted=1, deleted_dt= NOW() WHERE content_id = ' + id    
    content = await doDBQuery(sql)

    return content
}

async function changeStatus({ id, status }) {
    const sql = 'UPDATE inbrc_content SET status = "' + status + '" WHERE content_id = ' + id
    content = await doDBQuery(sql)

    return content
}


async function editOne({ content_id, content_name, content_body, content_release_dt, content_expire_dt  }) {

    let sql = `UPDATE inbrc_content SET 
        content_name = ?,
        content_body = ?,
        content_release_dt = ?,
        content_expire_dt = ?,
        modified_dt= NOW() WHERE content_id = ?`
    
    let inserts = []
    inserts.push(content_name, content_body, content_release_dt, content_expire_dt, content_id )
    content = await doDBQuery(sql, inserts)
    return content
}
