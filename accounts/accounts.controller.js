const express = require('express');
const router = express.Router();
const accountsService = require('./accounts.service');

////////////// ROUTES //////////////////////
router.get('/membertypes', getMemberTypes)
router.get('/nominees', getAllNominees)
router.post('/status', changeStatus)
router.post('/add', addOne)
router.post('/edit', editOne)
router.get('/type/:id', getType)
router.get('/:id', getOne)
router.get('/delete/:id', deleteOne)
router.get('/', getAll)

module.exports = router;

function addOne(req, res, next) {
    accountsService.addOne(req.body)
        .then(account => res.json(account))
        .catch(err => next(err))
}

function editOne(req, res, next) {
   accountsService.editOne(req.body)
        .then(account => res.json(account))
        .catch(err => next(err))
}
function getAll(req, res, next) {
    accountsService.getAll()
        .then(accounts => res.json(accounts))
        .catch(err => next(err))
}
function getType(req, res, next) {
    accountsService.getType(req.params.id)
        .then(accounts => res.json(accounts))
        .catch(err => next(err))
}
function getAllNominees(req, res, next) {
    accountsService.getAllNominees()
        .then(accounts => res.json(accounts))
        .catch(err => next(err))
}
function getMemberTypes(req, res, next) {
    accountsService.getMemberTypes()
        .then(membertypes => res.json(membertypes))
        .catch(err => next(err))
}

function getOne(req, res, next) {
    accountsService.getOne(req.params.id)
        .then(account => res.json(account))
        .catch(err => next(err))
}

function deleteOne(req, res, next) {
    accountsService.deleteOne(req.params.id)
        .then(account => res.json(account))
        .catch(err => next(err))
}


function changeStatus(req, res, next) {
    accountsService.changeStatus(req.body)
        .then( account => res.json(account) )
        .catch(err => next(err))
}
