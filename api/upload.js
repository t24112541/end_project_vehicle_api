const express = require('express')
const router = express.Router()

module.exports = router


router.post('/file-drag-drop', async (req, res) => {
  console.log(req.body)
})
