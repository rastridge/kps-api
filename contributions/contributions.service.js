const notifyUser = require('../_helpers/send-mail')
const doDBQuery = require('../_helpers/do-query')

module.exports = {
    getAll,
    getOne,
    addOne,
    deleteOne,
    editOne,
    changeStatus,
    getTotal,
    getAllSum
}

async function getAll() {

    const sql = `SELECT 
                    m.account_id,
                    CONCAT(m.member_firstname, ' ', m.member_lastname )  as title,
                    m.member_firstname,
                    m.member_lastname,
                    contribution_id as id,
                    contribution_amount,
                    contribution_date,
                    contribution_comment,
                    contribution_date dt,
                    contribution_showamount,
                    contribution_showname,
                    c.status
                FROM 
                    inbrc_contributions c,
                    inbrc_accounts m
                WHERE 
                    (c.account_id = m.account_id)
                    AND c.deleted = 0
                ORDER BY dt DESC`

    contributions = await doDBQuery(sql)
    return contributions
}

async function getAllSum() {

    const sql = `SELECT 
                    IF (c.contribution_showname = 1 , CONCAT(m.member_firstname,' ', m.member_lastname), "Anonymous") as Name,
                    SUM(contribution_amount) as Total
                FROM 
                    inbrc_contributions c,
                    inbrc_accounts m
                WHERE 
                    (c.account_id = m.account_id)
                    AND c.deleted = 0
                    AND m.deleted = 0
                GROUP BY 
                    Name
                ORDER BY 
                    Total DESC`
    contributions = await doDBQuery(sql)

    return contributions
}

async function getTotal() {
    const sql = `SELECT
                    sum(contribution_amount) as total, 
                    min(contribution_date) as earliest
                FROM 
                    inbrc_contributions 
                WHERE
                    deleted=0
                    AND
                    status=1`

    total = await doDBQuery(sql)
    return total[0]
}


async function getOne(id) {

    const sql = `SELECT 
                        m.account_id,
                        m.member_firstname,
                        m.member_lastname,
                        contribution_id,
                        contribution_amount,
                        contribution_date,
                        contribution_showamount,
                        contribution_showname,
                        contribution_comment,
                        c.modified_dt,
                        c.status
                    FROM 
                        inbrc_contributions c,
                        inbrc_accounts m
                    WHERE 
                        (c.account_id = m.account_id)
                        AND c.deleted = 0
                        AND contribution_id = ` + id

    contribution = await doDBQuery(sql)
    return contribution[0]
}


async function deleteOne(id) {

        const sql = 'UPDATE inbrc_contributions SET deleted=1, deleted_dt= NOW() WHERE contribution_id = ' + id
        contribution = await doDBQuery(sql)

        return contribution
}

async function addOne({ account_id, contribution_amount , contribution_date, contribution_showname, contribution_showamount, contribution_comment }) {

    var sql = 'INSERT INTO inbrc_contributions SET\
        account_id = ?,\
        contribution_amount = ?,\
        contribution_date = ?,\
        contribution_showName = ?,\
        contribution_showAmount = ?,\
        contribution_comment = ?,\
        created_dt = NOW(),\
        modified_dt= NOW()'

        var inserts = []
        inserts.push( account_id, contribution_amount , contribution_date, contribution_showname, contribution_showamount, contribution_comment )
        contribution = await doDBQuery(sql, inserts)

        const msg = 'A ' + contribution_amount + 'contribution has been made to the KP Scholarship'
        console.log(msg)
        notifyUser( msg, 'director@kamilpatelscholarship.org').catch(console.error);

        return contribution
}

async function editOne({ contribution_id, contribution_amount , contribution_date, contribution_showname, contribution_showamount, contribution_comment }) {

    const sql = 'UPDATE inbrc_contributions SET \
        contribution_amount = ? ,\
        contribution_date = ? ,\
        contribution_showname = ? , \
        contribution_showamount = ? ,\
        contribution_comment= ? ,\
        modified_dt= NOW() WHERE contribution_id = ?'
    
    var inserts = []
    inserts.push(contribution_amount , contribution_date, contribution_showname, contribution_showamount, contribution_comment,contribution_id )
    contribution = await doDBQuery(sql, inserts)

    return contribution
}

async function changeStatus({ id, status }) {
    const sql = 'UPDATE inbrc_contributions SET status = "' + status + '" WHERE contribution_id = ' + id
    contribution = await doDBQuery(sql)
    return contribution
}