const express = require('express')
const router = express.Router()

module.exports = router


router.get('/list', async (req, res) => {
  try {
    let rows = await req.db('pk_group').select('*').orderBy("g_code","desc")
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})
router.get('/cus_select/:select', async (req, res) => {//console.log(req.params.select)
    try {
      let rows = await req.db('pk_group').select(req.params.select)
      res.send({
        ok: true,
        datas: rows,
      })
    }catch(e){res.send({ ok: false, error: e.message })}
  })

router.get("/sh_group/:g_id",async(req,res)=>{
  console.log('param='+req.params.g_id)
  try{
    let db = req.db
    let row = await req.db('pk_group').select('*').where({
      g_id: req.params.g_id
    })
    let num_rows=await req.db("pk_student").count("std_id")
    .innerJoin('pk_group', 'pk_student.g_code', 'pk_group.g_code')
    .where("g_id",req.params.g_id)
    
    res.send({
      ok:true,
      datas: row[0] || {},
      nums:num_rows,
    })
  }catch(e){
    res.send({ok:false,error:e.message})
  }
})

router.post("/group_add",async (req,res)=>{
  try{
    let g_id=await req.db("pk_group").insert({
      	g_code:req.body.g_code,
        d_code:req.body.d_code,

    })
    res.send({ok:true,txt:"เพิ่มข้อมูล "+req.body.g_code+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถเพิ่มข้อมูลได้",alt:"error"})}
})

router.get("/group_del/:g_id",async (req,res)=>{//console.log(req.params.g_id)
  try{
    let g_id=await req.db("pk_group").del().where({
      g_id:req.params.g_id
    })
    res.send({ok:true,txt:"ลบข้อมูล "+req.body.g_id+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถลบข้อมูลได้",alt:"error"})}
})
router.post("/group_update",async(req,res)=>{//console.log(req.body.g_id)
  try{
    let sql=await req.db("pk_group").update({
      g_code:req.body.g_code,
      g_name:req.body.g_name,
      d_code:req.body.d_code,

    }).where({
      g_id:req.body.g_id
    })
    res.send({ok:true,txt:"แก้ไขข้อมูล "+req.body.g_code+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถแก้ไขข้อมูล "+req.body.g_code+" ได้",alt:"error"})}
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
