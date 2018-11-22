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
    .innerJoin('pk_department', 'pk_group_log.d_code', 'pk_department.d_code')
    .where({
      g_id: req.body.g_id
    })
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }fxgnxvc
})
////////////////////////////////////////// log teacher ///////////////////////////////////
router.get('/log_teacher', async (req, res) => {
  try {

    let admin =await req.db("pk_admin").select(
      "pk_teacher_log.t_id",
      "pk_teacher_log.t_code",
      "pk_teacher_log.t_name",
      "pk_teacher_log.t_tel",
      "pk_teacher_log.t_username",
      "pk_teacher_log.t_password",
      "pk_teacher_log.t_log_work",
      "pk_teacher_log.t_log_date",
      "pk_teacher_log.u_id",
      "pk_admin.a_name as u_name",
      "pk_department.d_code",
      "pk_department.d_name",
      "pk_admin.a_id",
      "pk_department.d_id"
    )
    .innerJoin("pk_teacher_log","pk_admin.a_username","pk_teacher_log.u_id")
    .innerJoin('pk_department', 'pk_teacher_log.d_code', 'pk_department.d_code')
    .groupByRaw("pk_teacher_log.t_id")
    .count("pk_teacher_log.t_id as count")
    .orderBy('pk_teacher_log.run_id', 'desc')

    let teacher =await req.db("pk_teacher").select(
      "pk_teacher_log.t_id",
      "pk_teacher_log.t_code",
      "pk_teacher_log.t_name",
      "pk_teacher_log.t_tel",
      "pk_teacher_log.t_username",
      "pk_teacher_log.t_password",
      "pk_teacher_log.t_log_work",
      "pk_teacher_log.t_log_date",
      "pk_teacher_log.u_id",
      "pk_department.d_code",
      "pk_department.d_name",
      "pk_teacher.t_code",
      "pk_teacher.t_name as u_name",
      "pk_teacher.t_dep"
    )
    .innerJoin("pk_teacher_log","pk_teacher.t_username","pk_teacher_log.u_id")
    .innerJoin('pk_department', 'pk_teacher_log.d_code', 'pk_department.d_code')
    .groupByRaw("pk_teacher_log.t_id")
    .count("pk_teacher_log.t_id as count")
    .orderBy('pk_teacher_log.run_id', 'desc')

    // console.log(teacher.length)
    // console.log(admin.length)
    if(teacher.length!=0){
      res.send({
        ok: true,
        datas: teacher,
      })
    }
    else if(admin.length!=0){
      res.send({
        ok: true,
        datas: admin,
      })
    }
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})

router.post('/log_teacher_show', async (req, res) => {
  console.log(req.body.t_id)
  try {
    let teacher =await req.db("pk_teacher").select(
      "pk_teacher_log.run_id",
      "pk_teacher_log.t_id",
      "pk_teacher_log.t_code",
      "pk_teacher_log.t_name",
      "pk_teacher_log.t_tel",
      "pk_teacher_log.t_username",
      "pk_teacher_log.t_password",
      "pk_teacher_log.t_log_work",
      "pk_teacher_log.t_log_date",
      "pk_teacher_log.u_id",
      "pk_department.d_code",
      "pk_department.d_name",
      "pk_teacher.t_code",
      "pk_teacher.t_name as u_name",
      "pk_teacher.t_dep"
    )
    .innerJoin("pk_teacher_log","pk_teacher.t_username","pk_teacher_log.u_id")
    .innerJoin('pk_department', 'pk_teacher_log.d_code', 'pk_department.d_code')
    .orderBy('pk_teacher_log.run_id', 'desc')
    .where("pk_teacher_log.t_id","=" ,req.body.t_id)

    let admin =await req.db("pk_admin").select(
      "pk_teacher_log.run_id",
      "pk_teacher_log.t_id",
      "pk_teacher_log.t_code",
      "pk_teacher_log.t_name",
      "pk_teacher_log.t_tel",
      "pk_teacher_log.t_username",
      "pk_teacher_log.t_password",
      "pk_teacher_log.t_log_work",
      "pk_teacher_log.t_log_date",
      "pk_teacher_log.u_id",
      "pk_admin.a_name as u_name",
      "pk_department.d_code",
      "pk_department.d_name",
      "pk_admin.a_id",
      "pk_department.d_id"
    )
    .innerJoin("pk_teacher_log","pk_admin.a_username","pk_teacher_log.u_id")
    .innerJoin('pk_department', 'pk_teacher_log.d_code', 'pk_department.d_code')
    .orderBy('pk_teacher_log.run_id', 'desc')
    .where("pk_teacher_log.t_id","=" ,req.body.t_id)

    // console.log(teacher.length)
    // console.log(admin.length)

    if(teacher.length!=0){
      res.send({
        ok: true,
        datas: teacher,
      })
    }
    else if(admin.length!=0){
      res.send({
        ok: true,
        datas: admin,
      })
    }


  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})


////////////////////////////////////////// log student ///////////////////////////////////
router.get('/log_student', async (req, res) => {
  try {
    let admin = await req.db('pk_admin')
    .select(
      "pk_admin.a_name as u_name",
      "pk_student_log.run_id",
      "pk_student_log.std_id",
      "pk_student_log.std_code",
      "pk_student_log.std_gender",
      "pk_student_log.std_prename",
      "pk_student_log.std_name",
      "pk_student_log.std_lname",
      "pk_student_log.std_pin_id",
      "pk_student_log.std_birthday",
      "pk_student_log.std_username",
      "pk_student_log.std_password",
      "pk_student_log.g_code",
      "pk_student_log.std_blood",
      "pk_student_log.std_log_date",
      "pk_student_log.u_id",
      "pk_student_log.std_log_work",
      "pk_group.g_name",
      "pk_department.d_name"
    )
    .innerJoin('pk_student_log', 'pk_admin.a_username', 'pk_student_log.u_id')
    .innerJoin('pk_group', 'pk_student_log.g_code', 'pk_group.g_code')
    .innerJoin('pk_department', 'pk_group.d_code', 'pk_department.d_code')
    .orderBy('pk_student_log.run_id', 'desc')
    .groupByRaw("pk_student_log.std_id")
    .count("pk_student_log.std_id as count")

    let teacher = await req.db('pk_teacher')
    .select(
      "pk_department.d_name",
      "pk_group.g_name",
      "pk_student_log.run_id",
      "pk_student_log.std_id",
      "pk_student_log.std_code",
      "pk_student_log.std_gender",
      "pk_student_log.std_prename",
      "pk_student_log.std_name",
      "pk_student_log.std_lname",
      "pk_student_log.std_pin_id",
      "pk_student_log.std_birthday",
      "pk_student_log.std_username",
      "pk_student_log.std_password",
      "pk_student_log.g_code",
      "pk_student_log.std_blood",
      "pk_student_log.std_log_date",
      "pk_student_log.u_id",
      "pk_student_log.std_log_work",
      "pk_teacher.t_name as u_name"
    )
    .innerJoin('pk_student_log', 'pk_teacher.t_username', 'pk_student_log.u_id')
    .innerJoin('pk_group', 'pk_student_log.g_code', 'pk_group.g_code')
    .innerJoin('pk_department', 'pk_group.d_code', 'pk_department.d_code')
    .orderBy('pk_student_log.run_id', 'desc')
    .groupByRaw("pk_student_log.std_id")
    .count("pk_student_log.std_id as count")

    // console.log(teacher.length)
    // console.log(admin.length)
    if(teacher.length!=0){
      res.send({
        ok: true,
        datas: teacher,
      })
    }else if(admin.length!=0){
      res.send({
        ok: true,
        datas: admin,
      })
    }
    // res.send({
    //   ok: true,
    //   datas: rows,
    // })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})

router.post('/log_student_show', async (req, res) => {
  try {
    let admin = await req.db('pk_admin')
    .select(
      "pk_admin.a_name as u_name",
      "pk_student_log.run_id",
      "pk_student_log.std_id",
      "pk_student_log.std_code",
      "pk_student_log.std_gender",
      "pk_student_log.std_prename",
      "pk_student_log.std_name",
      "pk_student_log.std_lname",
      "pk_student_log.std_pin_id",
      "pk_student_log.std_birthday",
      "pk_student_log.std_username",
      "pk_student_log.std_password",
      "pk_student_log.g_code",
      "pk_student_log.std_blood",
      "pk_student_log.std_log_date",
      "pk_student_log.u_id",
      "pk_student_log.std_log_work",
      "pk_group.g_name",
      "pk_department.d_name"
    )
    .innerJoin('pk_student_log', 'pk_admin.a_username', 'pk_student_log.u_id')
    .innerJoin('pk_group', 'pk_student_log.g_code', 'pk_group.g_code')
    .innerJoin('pk_department', 'pk_group.d_code', 'pk_department.d_code')
    .orderBy('pk_student_log.run_id', 'desc')
    .where("pk_student_log.std_id","=",req.body.std_id)

    let teacher = await req.db('pk_teacher')
    .select(
      "pk_department.d_name",
      "pk_group.g_name",
      "pk_student_log.run_id",
      "pk_student_log.std_id",
      "pk_student_log.std_code",
      "pk_student_log.std_gender",
      "pk_student_log.std_prename",
      "pk_student_log.std_name",
      "pk_student_log.std_lname",
      "pk_student_log.std_pin_id",
      "pk_student_log.std_birthday",
      "pk_student_log.std_username",
      "pk_student_log.std_password",
      "pk_student_log.g_code",
      "pk_student_log.std_blood",
      "pk_student_log.std_log_date",
      "pk_student_log.u_id",
      "pk_student_log.std_log_work",
      "pk_teacher.t_name as u_name"
    )
    .innerJoin('pk_student_log', 'pk_teacher.t_username', 'pk_student_log.u_id')
    .innerJoin('pk_group', 'pk_student_log.g_code', 'pk_group.g_code')
    .innerJoin('pk_department', 'pk_group.d_code', 'pk_department.d_code')
    .orderBy('pk_student_log.run_id', 'desc')
    .where("pk_student_log.std_id","=",req.body.std_id)

    if(teacher.length!=0){
      res.send({
        ok: true,
        datas: teacher,
      })
    }else if(admin.length!=0){
      res.send({
        ok: true,
        datas: admin,
      })
    }
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})
