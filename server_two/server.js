const express = require('express')
const router = express.Router()


router
.route('/wisilist/add/:product_id')
.put()

module.exports = router