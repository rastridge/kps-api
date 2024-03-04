const express = require('express');
const router = express.Router();
//const imagesService = require('./images.service');
const multer = require('multer');
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
config = require('../config.json');
const { localhost, siteUrl, siteContentPath, localUrl, localContentPath } = config;

let contentRootPath = '';
let BASE_URL = '';
if(localhost) {
  contentRootPath = localContentPath;
  BASE_URL = localUrl
} else {
  contentRootPath = siteContentPath;
  BASE_URL = siteUrl
}
const FILE_PATH = contentRootPath
const TEMP_DIR = '/uploads'
const NEWS_NEWSLETTER_IMAGE_DIR = 'news_newsletter_images'

////////////// ROUTES //////////////////////
//router.post('/', addOne);

// SET STORAGE
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${FILE_PATH}${TEMP_DIR}`)
  },
  filename: function (req, file, cb) {
    let y = new Date().getFullYear();
    let n = Math.random()*100000000000000000;
    cb(null, y + '-'+ n + '-'+ file.originalname)
  }
})
 
let upload = multer({ storage: storage })

router.post('/', upload.single('file'), async (req, res, next) => {
  const file = req.file
  if (file) {
    await sharp(file.path)
    .resize(640)
    .jpeg({quality: 90})
    .toFile(
      path.resolve(file.destination, NEWS_NEWSLETTER_IMAGE_DIR, file.filename)
      )
      fs.unlinkSync(file.path)
      // must be full BASE_URL when embedded in email
      res.send( { "imageUrl": `${BASE_URL}${TEMP_DIR}/${NEWS_NEWSLETTER_IMAGE_DIR}/${file.filename}`})
  } else {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
})
module.exports = router;


/*
router.post('/', upload.single('file'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
	}
    res.send( { "imageUrl": `${BASE_URL}${TEMP_DIR}/${file.filename}`})
  
})
module.exports = router;
*/

/*
function addOne(req, res, next) {
    imagesService.addOne(req)
        .then(images => res.json(images))
        .catch(err => next(err));
}
*/