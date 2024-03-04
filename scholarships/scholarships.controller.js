const express = require('express');
const router = express.Router();
const scholarshipService = require('./scholarships.service');

////////////// ROUTES //////////////////////

router.post('/add', addOne)
router.post('/edit', editOne)
router.post('/editnomineetext', editNomineeText)
router.post('/editeval', editOneEval)
router.post('/status', changeStatus)
router.get('/evals', getCurrent)
router.get('/delete/:id', deleteOne)
router.get('/summary', getSummary)
router.get('/public', getAll)
router.get('/', getAll)
router.get('/:id', getOne)
router.get('/nominee/:id', getOneByNomineeId)

module.exports = router;

function getAll(req, res, next) {
    scholarshipService.getAll()
        .then(
            scholarships => res.json(scholarships),
        )
        .catch(err => next(err));
}

function getSummary(req, res, next) {
    scholarshipService.getSummary()
        .then(
            scholarships => res.json(scholarships),
        )
        .catch(err => next(err));
}

function getOne(req, res, next) {
    scholarshipService.getOne(req.params.id)
        .then(scholarship => res.json(scholarship))
        .catch(err => next(err));
}

function getOneByNomineeId(req, res, next) {
    scholarshipService.getOneByNomineeId(req.params.id)
        .then(scholarship => res.json(scholarship))
        .catch(err => next(err));
}

function addOne(req, res, next) {

    //console.log( 'in controller addOne ', req.body)

    scholarshipService.addOne(req.body)
        .then(scholarship => res.json(scholarship))
        .catch(err => next(err));
}

function editOne(req, res, next) {
    scholarshipService.editOne(req.body)
        .then(scholarship => res.json(scholarship))
        .catch(err => next(err))
}

function editNomineeText(req, res, next) {
    
    scholarshipService.editNomineeText(req.body)
        .then(scholarship => res.json(scholarship))
        .catch(err => next(err))
}

function changeStatus(req, res, next) {
    scholarshipService.changeStatus(req.body)
        .then( scholarship => res.json(scholarship))
        .catch(err => next(err));
}

function deleteOne(req, res, next) {
    scholarshipService.deleteOne(req.params.id)
        .then(scholarship => res.json(scholarship))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    scholarshipService.getCurrent()
        .then(
            scholarships => res.json(scholarships),
        )
        .catch(err => next(err))
}

function editOneEval(req, res, next) {
    scholarshipService.editOneEval(req.body)
        .then(
            scholarships => res.json(scholarships),
        )
        .catch(err => next(err))
}

