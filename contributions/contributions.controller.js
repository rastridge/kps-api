const express = require('express');
const router = express.Router();
const contributionsService = require('./contributions.service');

////////////// ROUTES //////////////////////
router.get('/total', getTotal)
router.get('/', getAll)
router.get('/sum', getAllSum)

router.post('/status', changeStatus);
router.post('/add', addOne);
router.post('/edit', editOne);
router.get('/:id', getOne);
router.get('/delete/:id', deleteOne);

module.exports = router;

function getAll(req, res, next) {
    contributionsService.getAll()
        .then(contributions => res.json(contributions))
        .catch(err => next(err));
}

function getAllSum(req, res, next) {
    contributionsService.getAllSum()
        .then(contributions => res.json(contributions))
        .catch(err => next(err));
}

function getOne(req, res, next) {
    contributionsService.getOne(req.params.id)
        .then(account => res.json(account))
        .catch(err => next(err));
}

function addOne(req, res, next) {
    contributionsService.addOne(req.body)
        .then(contribution => res.json(contribution))
        .catch(err => next(err));
}

function editOne(req, res, next) {
    contributionsService.editOne(req.body)
        .then(contribution => res.json(contribution))
        .catch(err => next(err))
}

function deleteOne(req, res, next) {
    contributionsService.deleteOne(req.params.id)
        .then(contribution => res.json(contribution))
        .catch(err => next(err))
}


function changeStatus(req, res, next) {
    contributionsService.changeStatus(req.body)
        .then(contribution => res.json(contribution))
        .catch(err => next(err))
}


function getTotal(req, res, next) {
    contributionsService.getTotal()
        .then(total => res.json(total))
        .catch(err => next(err));
}
