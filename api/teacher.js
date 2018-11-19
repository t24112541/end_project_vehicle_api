const express = require('express')
const router = express.Router()

module.exports = router

router.get('/', async (req,res)=>{
    consolr.log("teacher")
})
router.get('/list', async (req, res) => {
  try {
    let rows = await req.db('pk_teacher').select('*')
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})

router.get("/sh_teacher/:t_id",async(req,res)=>{
  console.log('param='+req.params.t_id)
  try{
    let db = req.db
    let row = await req.db('pk_teacher').select('*').where({
      t_id: req.params.t_id
    })
    res.send({
      ok:true,
      datas: row[0] || {},
    })
  }catch(e){
    res.send({ok:false,error:e.message})
  }
})

router.post("/teacher_add",async (req,res)=>{
  try{
    let t_id=await req.db("pk_teacher").insert({
      	t_code:req.body.t_code,
        t_name:req.body.t_name,
        t_dep:req.body.t_dep,
        t_tel:req.body.t_tel,
      	t_username:req.body.t_code,
      	t_password:req.body.t_tel
    })
    let log=await req.db("pk_teacher_log").insert({
      t_id:t_id,
      t_code:req.body.t_code,
      t_name:req.body.t_name,
      d_code:req.body.t_dep,
      t_tel:req.body.t_tel,
      t_username:req.body.t_code,
      t_password:req.body.t_tel,
      t_log_work:"เพิ่มข้อมูล",
      u_id:req.body.u_id
    })

    res.send({ok:true,txt:"เพิ่มข้อมูล "+req.body.t_code+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถเพิ่มข้อมูลได้",alt:"error"})}
})

router.post("/teacher_del/:t_id",async (req,res)=>{//console.log(req.params.t_id)
  try{
    let t_id=await req.db("pk_teacher").update({t_status:"0"}).where({
      t_id:req.body.t_id
    })
    let log=await req.db("pk_teacher_log").insert({
        t_id:req.body.t_id,
      	t_code:req.body.t_code,
        t_name:req.body.t_name,
        d_code:req.body.t_dep,
        t_tel:req.body.t_tel,
      	t_username:req.body.t_code,
      	t_password:req.body.t_tel,
        t_log_work:"ลบข้อมูล",
        u_id:req.body.u_id
    })
    res.send({ok:true,txt:"ลบข้อมูล "+req.body.t_id+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถลบข้อมูลได้",alt:"error"})}
})
router.post("/teacher_update",async(req,res)=>{//console.log(req.body.t_id)
  try{
    let sql=await req.db("pk_teacher").update({
        t_code:req.body.t_code,
        t_name:req.body.t_name,
        t_dep:req.body.t_dep,
        t_tel:req.body.t_tel,
      	t_username:req.body.t_code,
      	t_password:req.body.t_tel
    }).where({
      t_id:req.body.t_id
    })
    let log=await req.db("pk_teacher_log").insert({
        t_id:req.body.t_id,
      	t_code:req.body.t_code,
        t_name:req.body.t_name,
        d_code:req.body.t_dep,
        t_tel:req.body.t_tel,
      	t_username:req.body.t_code,
      	t_password:req.body.t_tel,
        t_log_work:"แก้ไขข้อมูล",
        u_id:req.body.u_id
    })
    res.send({ok:true,txt:"แก้ไขข้อมูล "+req.body.t_code+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถแก้ไขข้อมูล "+req.body.t_code+" ได้",alt:"error"})}
})


router.post('/restore', async (req, res) => {
  try {
    let rows = await req.db(req.body.data).select('*').where({run_id: req.body.id})
    let restore=await req.db(req.body.target).update({
      t_status:1,
      t_code:rows[0].t_code,
      t_name:rows[0].t_name,
      t_dep:rows[0].t_dep,
      t_tel:rows[0].t_tel,
      t_username:rows[0].t_username,
      t_password:rows[0].t_password,
    }).where({t_id:rows[0].t_id})
    let log=await req.db(req.body.data).insert({
      t_code:rows[0].t_code,
      t_name:rows[0].t_name,
      d_code:rows[0].t_dep,
      t_tel:rows[0].t_tel,
      t_username:rows[0].t_username,
      t_password:rows[0].t_password,
      t_log_work:"เรียกคืนข้อมูล",
      u_id:req.body.u_id

    })
    res.send({
      ok:true,txt:"เรียกคืนข้อมูล "+rows[0].t_name+" สำเร็จ",alt:"success"
    })
  } catch (e) {
    res.send({ ok: false,txt:"(-_-') (restore!) ไม่สามารถเรียกคืนข้อมูลได้",alt:"error"})
  }
})
