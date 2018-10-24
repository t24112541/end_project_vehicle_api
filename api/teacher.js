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
    res.send({ok:true,txt:"เพิ่มข้อมูล "+req.body.t_code+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถเพิ่มข้อมูลได้",alt:"error"})}
})

router.get("/teacher_del/:t_id",async (req,res)=>{//console.log(req.params.t_id)
  try{
    let t_id=await req.db("pk_teacher").del().where({
      t_id:req.params.t_id
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
    res.send({ok:true,txt:"แก้ไขข้อมูล "+req.body.t_code+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถแก้ไขข้อมูล "+req.body.t_code+" ได้",alt:"error"})}
})


router.post('/save2', (req, res) => {
  let db = req.db  
  db('t1').insert({}).then(ids => {
    let id = ids[0]
    Promise.all([
      db('t2').insert({}).catch(),
      db('t3').insert({}).catch(),
    ]).then(() => {
      res.send({status: true})
    }).catch(err => {
      res.send({status: false})
    })    
  })
  console.log('ok')
})
// router.get('/save3', async (req, res) => {
//   try {
//     let db = req.db  
//     let ids = await db('t1').insert({})
//     await Promise.all([
//       db('t2').insert({}),
//       db('t3').insert({})
//     ])
//     res.send({status: true})
//   } catch (e) {
//     res.send({status: false})
//   }
// })
