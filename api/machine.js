const express = require('express')
const router = express.Router()

module.exports = router


router.get('/list', async (req, res) => {
  try {
    let rows = await req.db('pk_machine').select('*').orderBy("mc_id","desc")
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
      let rows = await req.db('pk_machine').select(req.params.select)
      res.send({
        ok: true,
        datas: rows,
      })
    }catch(e){res.send({ ok: false, error: e.message })}
  })

router.get("/sh_machine/:mc_id",async(req,res)=>{
  console.log('param='+req.params.mc_id)
  try{
    let db = req.db
    let row = await req.db('pk_machine').select('*').where({
      mc_id: req.params.mc_id
    })
    res.send({
      ok:true,
      datas: row[0] || {},
    })
  }catch(e){
    res.send({ok:false,error:e.message})
  }
})

router.post("/machine_add",async (req,res)=>{
  try{
    let mc_id=await req.db("pk_machine").insert({
      	mc_code:req.body.mc_code,
        mc_brand:req.body.mc_brand,
        mc_series:req.body.mc_series,
        std_id:req.body.std_id,
    })
    let log=await req.db("pk_machine_log").insert({
      mc_id:mc_id,
      mc_code:req.body.mc_code,
      mc_brand:req.body.mc_brand,
      mc_series:req.body.mc_series,
      std_id:req.body.std_id,
      u_id:req.body.username,
      mc_log_work:"เพิ่มข้อมูล"
    })
    res.send({ok:true,txt:"เพิ่มข้อมูล "+req.body.mc_code+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถเพิ่มข้อมูลได้",alt:"error"})}
})

router.post("/machine_del",async (req,res)=>{//console.log(req.params.mc_id)
  try{
    let mc_id=await req.db("pk_machine").del().where({
      mc_id:req.body.mc_id,
    })
    let log=await req.db("pk_machine_log").insert({
      mc_id:req.body.mc_id,
      mc_code:req.body.mc_code,
      mc_brand:req.body.mc_brand,
      mc_series:req.body.mc_series,
      std_id:req.body.std_id,
      u_id:req.body.username,
      mc_log_work:"ลบข้อมูล"
    })
    res.send({ok:true,txt:"ลบข้อมูล "+req.body.mc_id+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถลบข้อมูลได้",alt:"error"})}
})
router.post("/machine_update",async(req,res)=>{//console.log(req.body.mc_id)
  try{
    let sql=await req.db("pk_machine").update({
        mc_code:req.body.mc_code,
        mc_brand:req.body.mc_brand,
        mc_series:req.body.mc_series,
        std_id:req.body.std_id,

    }).where({
      mc_id:req.body.mc_id
    })
    let log=await req.db("pk_machine_log").insert({
      mc_id:req.body.mc_id,
      mc_code:req.body.mc_code,
      mc_brand:req.body.mc_brand,
      mc_series:req.body.mc_series,
      std_id:req.body.std_id,
      u_id:req.body.username,
      mc_log_work:"แก้ไขข้อมูล"
    })
    res.send({ok:true,txt:"แก้ไขข้อมูล "+req.body.mc_code+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถแก้ไขข้อมูล "+req.body.mc_code+" ได้",alt:"error"})}
})
