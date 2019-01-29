const express = require('express')
const router = express.Router()

module.exports = router

router.use('/login', require('./login'))
router.use('/student', require('./student'))
router.use('/teacher', require('./teacher'))
router.use('/group', require('./group'))
router.use('/department', require('./department'))
router.use('/machine', require('./machine'))
router.use('/log_list', require('./log_list'))
router.use('/upload', require('./upload'))
router.use('/accessories', require('./accessories'))
router.use('/missing', require('./missing'))
router.use('/admin', require('./admin'))
router.use('/object_control', require('./object_control'))
