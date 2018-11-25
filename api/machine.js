const express = require('express')
const router = express.Router()
module.exports = router


router.get('/list', async (req, res) => {
  try {
    let rows = await req.db('pk_machine').select('*').orderBy("mc_id","desc")
    .where("t_status","!=",0)
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
    let rows = await req.db('pk_student').select(
      "pk_machine.mc_id",
      "pk_machine.mc_code",
      "pk_machine.mc_brand",
      "pk_machine.mc_series",
      "pk_machine.std_id",
      "pk_student.std_id",
      "pk_student.std_code",
      "pk_student.std_gender",
      "pk_student.std_prename",
      "pk_student.std_name",
      "pk_student.std_lname",
      "pk_student.std_pin_id",
      "pk_student.std_birthday",
      "pk_student.std_username",
      "pk_student.std_password",
      "pk_student.g_code",
      "pk_student.std_blood",
      "pk_student.t_status",
      "pk_img.img_id",
      "pk_img.img_img",
      "pk_img.u_code",
      "pk_img.u_table"
    ).where("pk_machine.mc_id","=",req.params.mc_id
    )
    .innerJoin('pk_machine', 'pk_machine.std_id', 'pk_student.std_code')
    .innerJoin('pk_img', 'pk_machine.mc_id', 'pk_img.u_code')
    res.send({
      ok:true,
      datas: rows,
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
    let img_font=await req.db("pk_img").insert({
      	img_img:req.body.img_font,
        u_table:req.body.u_table,
        u_code:mc_id,
    })
    let img_side=await req.db("pk_img").insert({
      	img_img:req.body.img_side,
        u_table:req.body.u_table,
        u_code:mc_id,
    })
    let img_rear=await req.db("pk_img").insert({
      	img_img:req.body.img_rear,
        u_table:req.body.u_table,
        u_code:mc_id,
    })
    let log=await req.db("pk_machine_log").insert({
      mc_id:mc_id,
      mc_code:req.body.mc_code,
      mc_brand:req.body.mc_brand,
      mc_series:req.body.mc_series,
      std_id:req.body.std_id,
      u_id:req.body.u_id,
      mc_log_work:"เพิ่มข้อมูล"
    })
    res.send({ok:true,txt:"เพิ่มข้อมูล "+req.body.mc_code+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถเพิ่มข้อมูลได้",alt:"error"})}
})

router.post("/machine_del",async (req,res)=>{//console.log(req.params.mc_id)
  try{
    let mc_id=await req.db("pk_machine").update("t_status","=",0).where({
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
    }).where({
      mc_id:req.body.mc_id
    })
    let img_font=await req.db("pk_img").update({
      	img_img:req.body.img_font,
    }).where("img_id","=",req.body.img_font_id)

    let img_side=await req.db("pk_img").update({
      	img_img:req.body.img_side,
    }).where("img_id","=",req.body.img_side_id)

    let img_rear=await req.db("pk_img").update({
      	img_img:req.body.img_rear,
    }).where("img_id","=",req.body.img_rear_id)

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
