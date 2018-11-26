const express = require('express')
const router = express.Router()

module.exports = router


router.get('/list', async (req, res) => {
  try {
    let student = await req.db('pk_student').select(
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
      "pk_accessories.ac_id",
      "pk_accessories.ac_name",
      "pk_accessories.ac_description",
      "pk_accessories.ac_u_id",
      "pk_accessories.ac_u_table",
      "pk_accessories.t_status"
    )
    .innerJoin('pk_accessories', 'pk_student.std_code', 'pk_accessories.ac_u_id')
    .where("pk_accessories.t_status","!=",0)
    .orderBy("pk_accessories.ac_id","desc")

    let teacher = await req.db('pk_teacher').select(
      "pk_teacher.t_id",
      "pk_teacher.t_code",
      "pk_teacher.t_name",
      "pk_teacher.t_dep",
      "pk_teacher.t_tel",
      "pk_teacher.t_username",
      "pk_teacher.t_password",
      "pk_teacher.t_status",
      "pk_accessories.ac_id",
      "pk_accessories.ac_name",
      "pk_accessories.ac_description",
      "pk_accessories.ac_u_id",
      "pk_accessories.ac_u_table",
      "pk_accessories.t_status"
    )
    .innerJoin('pk_accessories', 'pk_teacher.t_code', 'pk_accessories.ac_u_id')
    .where("pk_accessories.t_status","!=",0)
    .orderBy("pk_accessories.ac_id","desc")

    if(student.length!=0){
      res.send({
        ok: true,
        datas: student,
      })
    }else if(teacher.length!=0){
      res.send({
        ok: true,
        datas: teacher,
      })
    }
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})

router.post("/sh_dep",async(req,res)=>{
  try{
    let db = req.db
    let student = await req.db('pk_student').select(
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
      "pk_accessories.ac_id",
      "pk_accessories.ac_name",
      "pk_accessories.ac_description",
      "pk_accessories.ac_u_id",
      "pk_accessories.ac_u_table",
      "pk_accessories.t_status"
    )
    .innerJoin('pk_accessories', 'pk_student.std_code', 'pk_accessories.ac_u_id')
    .where("pk_accessories.t_status","!=",0)
    .where("pk_accessories.ac_u_id","=",req.body.ac_u_id)
    .where("pk_accessories.ac_u_table","=","pk_student")

    let teacher = await req.db('pk_teacher').select(
      "pk_teacher.t_id",
      "pk_teacher.t_code",
      "pk_teacher.t_name",
      "pk_teacher.t_dep",
      "pk_teacher.t_tel",
      "pk_teacher.t_username",
      "pk_teacher.t_password",
      "pk_teacher.t_status",
      "pk_accessories.ac_id",
      "pk_accessories.ac_name",
      "pk_accessories.ac_description",
      "pk_accessories.ac_u_id",
      "pk_accessories.ac_u_table",
      "pk_accessories.t_status"
    )
    .innerJoin('pk_accessories', 'pk_teacher.t_code', 'pk_accessories.ac_u_id')
    .where("pk_accessories.t_status","!=",0)
    .where("pk_accessories.ac_u_id","=",req.body.ac_u_id)
    .where("pk_accessories.ac_u_table","=","pk_teacher")
    .orderBy("pk_accessories.ac_id","desc")

    if(student.length!=0){
      res.send({
        ok: true,
        datas: student,
      })
    }else if(teacher.length!=0){
      res.send({
        ok: true,
        datas: teacher,
      })
    }
  }catch(e){
    res.send({ok:false,error:e.message})
  }
})
///////////////////////////////////////////////////////   26/11/61
router.post("/dep_add",async (req,res)=>{
  try{
    let d_id=await req.db("pk_department").insert({
      	d_code:req.body.d_code,
        d_name:req.body.d_name,
    })
    let log=await req.db("pk_department_log").insert({
    	d_id:d_id,
    	d_code:req.body.d_code,
        d_name:req.body.d_name,
        u_id:req.body.u_id,
        d_log_work:"เพิ่มข้อมูล",
    })
    res.send({ok:true,txt:"เพิ่มข้อมูล "+req.body.d_name+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถเพิ่มข้อมูลได้",alt:"error"})}
})

router.post("/dep_del",async (req,res)=>{
  try{
    let d_id=await req.db("pk_department").update({
      t_status:"0"
    }).where({d_id:req.body.d_id})
    let log=await req.db("pk_department_log").insert({
    	d_id:req.body.d_id,
    	d_code:req.body.d_code,
      d_name:req.body.d_name,
      u_id:req.body.u_id,
      d_log_work:"ลบข้อมูล",
    })
    res.send({ok:true,txt:"ลบข้อมูล "+req.body.d_id+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถลบข้อมูลได้",alt:"error"})}
})
router.post("/dep_update",async(req,res)=>{
  try{
    let sql=await req.db("pk_department").update({
        d_code:req.body.d_code,
        d_name:req.body.d_name,
    }).where({
      d_id:req.body.d_id
    })
    let log=await req.db("pk_department_log").insert({
    	d_id:req.body.d_id,
    	d_code:req.body.d_code,
      d_name:req.body.d_name,
      u_id:req.body.u_id,
      d_log_work:req.body.type
    })
    res.send({ok:true,txt:"แก้ไขข้อมูล "+req.body.d_name+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถแก้ไขข้อมูล "+req.body.d_name+" ได้",alt:"error"})}
})
router.post("/log",async (req,res)=>{
  try{
    let log=await req.db("pk_department_log").insert({
    	d_id:req.body.d_id,
    	d_code:req.body.d_code,
      d_name:req.body.d_name,
      u_id:req.body.u_id,
      d_log_work:req.body.type
    })
    res.send({
      ok:true,
    })
  }catch(e){res.send({ok:false,txt:"(-_-') (log!) ไม่สามารถบันทึกการทำงานได้",alt:"error"})}
})

router.post('/restore', async (req, res) => {
  try {
    let rows = await req.db(req.body.data).select('*').where({run_id: req.body.id})
    let restore=await req.db(req.body.target).update({
      t_status:1,
      d_code:rows[0].d_code,
      d_name:rows[0].d_name,
    }).where({d_id:rows[0].d_id})
    let log=await req.db(req.body.data).insert({
    	d_id:rows[0].d_id,
    	d_code:rows[0].d_code,
      d_name:rows[0].d_name,
      u_id:req.body.u_id,
      d_log_work:"เรียกคืนข้อมูล",
    })
    res.send({
      ok:true,txt:"เรียกคืนข้อมูล "+rows[0].d_name+" สำเร็จ",alt:"success"
    })
  } catch (e) {
    res.send({ ok: false,txt:"(-_-') (restore!) ไม่สามารถเรียกคืนข้อมูลได้",alt:"error"})
  }
})
