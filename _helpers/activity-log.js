module.exports = activityLog

const fs = require('fs')
module.exports = activityLog

function activityLog(filename, message, variable) {
	fs.appendFile(
		'/home/rastridge/api.kamilpatelscholarship.org/logs/' + filename + '.txt',
		message + ' ' + variable + '\n',
		function (err) {
			if (err) throw err
			console.log('Saved!')
		}
	)
}
