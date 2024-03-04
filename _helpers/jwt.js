const expressJwt = require('express-jwt')
const config = require('config.json')

module.exports = jwt

// Dreamhost Proxy server process inserts extra '/' for reason I don't understand
// Tht's the reason  for double '//' on routes
function jwt() {
	const { secret } = config
	return expressJwt({ secret }).unless({
		path: [
			// public routes that don't require authentication
			// authentication
			// public info
			//
			// access for nominators and nominees forms
			'/', // filemanager
			'//test', //
			'//api/test', //
			'//Upload', // filemanager
			'//Download', // filemanager
			/\/GetImage?.+/, // filemanager
			'//users/authenticate', // login
			'//users/reset', // login
			'//accounts/nominees', // tor and ee input
			'//accounts/edit', // tor and ee input
			/\/accounts\/[1-9]+/, // getOne
			'//scholarships/evals', // tor and ee input
			'//scholarships/editeval', // tor and ee input
			'//scholarships/add', // tor and ee input
			'//scholarships/public', // tor and ee input
			'//scholarships/editnomineetext', // tor and ee input
			/\/scholarships\/[1-9]+/, // tor and ee input
			/\/scholarships\/nominee\/[1-9]+/, // tor and ee input
			'//news', // getAll
			'//news/current', // getAllCurrent
			/\/news\/[1-9]+/, // getOne
			'//content', // getAll
			'//content/menuitems', // getMenuitems
			/\/content\/[1-9]+/, // getOne
			'//contributions', // getAll
			'//contributions/sum', // getAll sum
			'//contributions/total', // getAll total
			'//image', // upload image
		],
	})
}