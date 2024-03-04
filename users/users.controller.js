const express = require('express')
const router = express.Router()
const userService = require('./users.service')

////////////// ROUTES //////////////////////
router.post('/authenticate', authenticate)
router.post('/reset', reSet)
router.post('/status', changeStatus)
router.post('/add', addOne)
router.post('/edit', editOne)
router.get('/:id', getOne)
router.get('/delete/:id', deleteOne)
router.get('/', getAll)

module.exports = router

function authenticate(req, res, next) {
	userService
		.authenticate(req.body)
		.then((user) => {
			user ? res.json(user) : res.status(400).json({ message: 'Login failed' })
		})
		.catch((err) => next(err))
}

function reSet(req, res, next) {
	userService
		.reSet(req.body)
		.then((user) =>
			user
				? res.json(user)
				: res.status(400).json({ message: 'Username or email is incorrect' })
		)
		.catch((err) => next(err))
}

function addOne(req, res, next) {
	userService
		.addOne(req.body)
		.then((user) => res.json(user))
		.catch((err) => next(err))
}

function editOne(req, res, next) {
	userService
		.editOne(req.body)
		.then((user) => res.json(user))
		.catch((err) => next(err))
}
function getAll(req, res, next) {
	userService
		.getAll()
		.then((users) => res.json(users))
		.catch((err) => next(err))
}

function getOne(req, res, next) {
	userService
		.getOne(req.params.id)
		.then((user) => res.json(user))
		.catch((err) => next(err))
}

function deleteOne(req, res, next) {
	userService
		.deleteOne(req.params.id)
		.then((user) => res.json(user))
		.catch((err) => next(err))
}

function changeStatus(req, res, next) {
	userService
		.changeStatus(req.body)
		.then((user) => res.json(user))
		.catch((err) => next(err))
}
