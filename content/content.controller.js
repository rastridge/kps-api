const express = require('express')
const router = express.Router()
const contentService = require('./content.service')

////////////// ROUTES //////////////////////
router.get('/menuitems', getMenuIems)
router.get('/:id', getOne)
router.get('/delete/:id', deleteOne)
router.post('/add', addOne)
router.post('/edit', editOne)
router.post('/status', changeStatus)
router.get('/', getAll)

module.exports = router

function getAll(req, res, next) {
	contentService
		.getAll()
		.then((content) => res.json(content))
		.catch((err) => next(err))
}

function getMenuIems(req, res, next) {
	contentService
		.getMenuItems()
		.then((content) => res.json(content))
		.catch((err) => next(err))
}

function getOne(req, res, next) {
	contentService
		.getOne(req.params.id)
		.then((content) => res.json(content))
		.catch((err) => next(err))
}

function addOne(req, res, next) {
	contentService
		.addOne(req.body)
		.then((content) => res.json(content))
		.catch((err) => next(err))
}

function editOne(req, res, next) {
	contentService
		.editOne(req.body)
		.then((content) => res.json(content))
		.catch((err) => next(err))
}

function changeStatus(req, res, next) {
	contentService
		.changeStatus(req.body)
		.then((content) => res.json(content))
		.catch((err) => next(err))
}

function deleteOne(req, res, next) {
	contentService
		.deleteOne(req.params.id)
		.then((content) => res.json(content))
		.catch((err) => next(err))
}
