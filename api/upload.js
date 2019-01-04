
const express = require('express')
const router = express.Router()

module.exports = router


router.post('/upload', async (req, res) => {
  console.log(req.files) // ข้อมูลไฟล์ที่ถูกสร้าง
  res.send({status: true, url: '/files/' + req.files.myFile.name})
})
