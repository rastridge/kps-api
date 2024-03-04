module.exports = recipientMemberMatch

const doDBQuery = require('_helpers/do-query')

function recipientMemberMatch(recipient_type_id, el) {
	recipient_type_id = parseInt(recipient_type_id)
	const member_type_id = parseInt(el.member_type_id)

	// One to one match of recip type and member type
	let include = false
	switch (recipient_type_id) {
		// Nominator
		case 3:
			include = member_type_id === 3
			break
		// Contributor
		case 4:
			include = member_type_id === 4
			break
		// Nominee
		case 12:
			include = member_type_id === 12
			break
		// testing
		case 13:
			include = member_type_id === 13
			break
	}

	return include
}
