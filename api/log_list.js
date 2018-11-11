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

////////////////////////////////////////// log group ///////////////////////////////////
router.get('/log_group', async (req, res) => {
  try {
    let rows = await req.db('pk_group_log')
    .innerJoin('pk_department', 'pk_group_log.d_code', 'pk_department.d_code')
    .orderBy('run_id', 'desc')
    .groupByRaw("g_id")
    .select("*")
    .count("g_id as count")
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})

router.post('/log_group_show', async (req, res) => {
  try {
    let rows = await req.db('pk_group_log').select('*').orderBy('run_id', 'desc')
    .where({
      g_id: req.body.g_id
    })
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})

