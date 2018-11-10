const express = require('express')
const router = express.Router()

module.exports = router

router.get('/log_department', async (req, res) => {
  try {
    let rows = await req.db('pk_department_log')
    .orderBy('run_id', 'desc')
    .groupByRaw("d_id")
    .select("*")
    .count("d_id as count")
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})

router.post('/log_department_show', async (req, res) => {
  try {
    let rows = await req.db('pk_department_log').select('*').orderBy('run_id', 'desc')
    .where({
      d_id: req.body.d_id
    })
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})
