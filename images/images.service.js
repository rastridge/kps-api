
module.exports = {
    addOne
}

/*
async function addOne() {
    let url = { "url":"/imgs/watsonSilhouwtte.png" }
    return url
}
*/

// SET STORAGE
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   

async function addOne(req, res, next) {
    console.log("addOne"+ Date.now())
}


  