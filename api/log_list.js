const express = require('express')
const router = express.Router()

module.exports = router

router.get('/log_department', async (req, res) => {
  try {
    let rows = await req.db('pk_department_log').select('*').orderBy('run_id', 'desc')
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})

