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
//////////////////////// search ///////////////////////////////
router.post('/search/', async (req, res) => {
  try {
    let rows = await req.db('pk_machine').select('*').orderBy("mc_id","desc")
    .where("t_status","!=",0)
    .where("mc_code","like",'%'+req.body.txt_search+'%')
    .orWhere("std_id","like",'%'+req.body.txt_search+'%')
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})
///////////////////////////////////////////////////////////////
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
    let student = await req.db('pk_student').select(
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

    let teacher = await req.db('pk_teacher').select(
      "pk_teacher.t_id",
      "pk_teacher.t_code",
      "pk_teacher.t_name",
      "pk_teacher.t_dep",
      "pk_teacher.t_tel",
      "pk_teacher.t_username",
      "pk_teacher.t_password",
      "pk_teacher.t_status",
      "pk_machine.mc_id",
      "pk_machine.mc_code",
      "pk_machine.mc_brand",
      "pk_machine.mc_series",
      "pk_machine.std_id",
      "pk_machine.t_status",
      "pk_img.img_id",
      "pk_img.img_img",
      "pk_img.u_code",
      "pk_img.u_table"

    ).where("pk_machine.mc_id","=",req.params.mc_id)
    .innerJoin('pk_machine', 'pk_teacher.t_code', 'pk_machine.std_id')
    .innerJoin('pk_img', 'pk_machine.mc_id', 'pk_img.u_code')

    if(teacher.length!=0){
      res.send({
        ok: true,
        datas: teacher,
      })
    }else if(student.length!=0){
      res.send({
        ok: true,
        datas: student,
      })
    }
  }catch(e){
    res.send({ok:false,error:e.message})
  }
})
////////////////////////// user ////////////////////////////////////

router.post("/sh_machine_w_std",async(req,res)=>{
  try{
    let db = req.db
    let student = await req.db('pk_machine').select(
      "pk_machine.mc_id",
      "pk_machine.mc_code",
      "pk_machine.mc_brand",
      "pk_machine.mc_series",
      "pk_machine.std_id",
      "pk_machine.t_status"
    )
    .where("pk_student.std_id","=",req.body.std_id)
    .innerJoin('pk_student', 'pk_machine.std_id', 'pk_student.std_code')
  if(student.length!=0){
      res.send({
        ok: true,
        datas: student,
      })
    }
  }catch(e){
    res.send({ok:false,error:e.message})
  }
})

////////////////////////////////////////////////////////////////////
router.post("/machine_add",async (req,res)=>{
  let db = req.db
  let chk_mc_code=await db("pk_machine").select("mc_code").where("pk_machine.mc_code","=",req.body.mc_code)
  if(chk_mc_code.length>0){res.send({ok:false,txt:"(-_-#) (add!)ไม่สามารถเพิ่มข้อมูลได้ พบทะเบียนรถ "+req.body.mc_code+" ที่ตรงกัน",alt:"warning"})}
  else{
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
    }catch(e){res.send({ok:false,txt:"(-_-') (add!)ไม่สามารถเพิ่มข้อมูลได้"+e.message,alt:"error"})}
  }
})

router.post("/machine_del",async (req,res)=>{//console.log(req.params.mc_id)
  try{
    let mc_id=await req.db("pk_machine").update("t_status",0).where({
      mc_id:req.body.mc_id,
    })
    let log=await req.db("pk_machine_log").insert({
      mc_id:req.body.mc_id,
      mc_code:req.body.mc_code,
      mc_brand:req.body.mc_brand,
      mc_series:req.body.mc_series,
      std_id:req.body.std_id,
      u_id:req.body.u_id,
      mc_log_work:"ลบข้อมูล"
    })
    res.send({ok:true,txt:"ลบข้อมูล "+req.body.mc_id+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"(-_-') (del!)ไม่สามารถลบข้อมูลได้",alt:"error"})}
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
      u_id:req.body.u_id,
      mc_log_work:"แก้ไขข้อมูล"
    })
    res.send({ok:true,txt:"แก้ไขข้อมูล "+req.body.mc_code+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"(-_-') (update!)ไม่สามารถแก้ไขข้อมูล "+req.body.mc_code+" ได้",alt:"error"})}
})
router.post('/restore', async (req, res) => {
  try {
    let rows = await req.db(req.body.data).select('*').where({run_id: req.body.id})
    let restore=await req.db(req.body.target).update({
      t_status:1,
      mc_code:rows[0].mc_code,
      mc_brand:rows[0].mc_brand,
      mc_series:rows[0].mc_series,
      std_id:rows[0].std_id,

    }).where({mc_id:rows[0].mc_id})
    let log=await req.db(req.body.data).insert({
      mc_id:rows[0].mc_id,
      mc_code:rows[0].mc_code,
      mc_brand:rows[0].mc_brand,
      mc_series:rows[0].mc_series,
      std_id:rows[0].std_id,
      u_id:rows[0].u_id,
      mc_log_work:"เรียกคืนข้อมูล",
    })
    res.send({
      ok:true,txt:"เรียกคืนข้อมูล "+rows[0].t_name+" สำเร็จ",alt:"success"
    })
  } catch (e) {
    res.send({ ok: false,txt:"(-_-') (restore!) ไม่สามารถเรียกคืนข้อมูลได้",alt:"error"})
  }
})
