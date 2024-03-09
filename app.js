require('rootpath')()
const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('_helpers/jwt')
const errorHandler = require('_helpers/error-handler')
const nocache = require('nocache')

const {
	db_host,
	port,
	secure,
	db_user,
	db_password,
	db_database,
} = require('config.js')
console.log(
	'db_host, port, secure, db_user, db_password, db_database = ',
	db_host,
	port,
	secure,
	db_user,
	db_password,
	db_database
)

/* const activityLog = require('_helpers/activity-log')
activityLog(
	'KPS_Testing',
	'IN app.js db_host, db_database = ',
	db_host + ' ' + db_database
) */

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(jwt())
app.use(nocache())

// Dreamhost Proxy server process inserts extra '/' for reason I don't understand
//   this eliminates 'extra' '/'
//

// Middleware to normalise the request URL
app.use((req, res, next) => {
	// Replace multiple leading slashes with a single slash
	req.url = req.url.replace(/^\/+/, '/')
	next()
})

// for testing purposes
//
app.get('/', function (request, response) {
	response.writeHead(200, { 'Content-Type': 'text/plain' })
	response.end('/ is working yahoo')
})

app.get('/test', function (request, response) {
	response.writeHead(200, { 'Content-Type': 'text/plain' })
	response.end('/test is working')
})

app.get('/api/test', (req, res) => {
	response.writeHead(200, { 'Content-Type': 'text/plain' })
	res.send('/api/test is working')
})

// api routes  - ENTRY POINTS
app.use('/image', require('./images/images.controller'))
app.use('/users', require('./users/users.controller'))
app.use('/news', require('./news/news.controller'))
app.use('/newsletters', require('./newsletters/newsletters.controller'))
app.use('/contributions', require('./contributions/contributions.controller'))
app.use('/scholarships', require('./scholarships/scholarships.controller'))
app.use('/accounts', require('./accounts/accounts.controller'))
app.use('/content', require('./content/content.controller'))
/* end first server */
app.use(errorHandler)

// start server
const server = app.listen(port, function () {
	console.log('KPS Server listening on port ' + port)
})
