const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/files/img/accessories')
  },
  filename: function (req, file, cb) {
    cb(null, "veh-ac" + '-' + Date.now()+".jpg")
  }
})

const upload = multer({ storage: storage })
module.exports = router


router.get('/list', async (req, res) => {
  try {
    let data = await req.db('pk_accessories').select("*")
    .where("pk_accessories.t_status","!=",0)
    .orderBy("pk_accessories.ac_id","desc")
      res.send({
        ok: true,
        datas: data,
      })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})
//////////////////////// search ///////////////////////////////
router.post('/search/', async (req, res) => {
  try {
    let rows = await req.db('pk_accessories').select('*').orderBy("pk_accessories.ac_id","desc")

    .where("ac_name","like",'%'+req.body.txt_search+'%')
    .orWhere("ac_u_id","like",'%'+req.body.txt_search+'%')
    .andWhere("t_status","!=",0)

    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})
///////////////////////////////////////////////////////////////
router.post("/sh_accessories",async(req,res)=>{
  try{
    let db = req.db
    let student = await req.db('pk_student').select(
      "pk_student.std_id",
      "pk_student.std_code",
      "pk_student.std_gender",
      "pk_student.std_prename",
      "pk_student.std_name as u_name",
      "pk_student.std_lname as l_name",
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
      "pk_accessories.t_status",
      "pk_img.img_id",
      "pk_img.img_img",
      "pk_img.u_code",
      "pk_img.u_table"
    )
    .innerJoin('pk_accessories', 'pk_student.std_code', 'pk_accessories.ac_u_id')
    .innerJoin('pk_img', 'pk_accessories.ac_id', 'pk_img.u_code')
    .where("pk_accessories.ac_id","=",req.body.ac_id)
    .where("pk_accessories.ac_u_table","=","pk_student")

    let teacher = await req.db('pk_teacher').select(
      "pk_teacher.t_id",
      "pk_teacher.t_code",
      "pk_teacher.t_name as u_name",
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
      "pk_accessories.t_status",
      "pk_img.img_id",
      "pk_img.img_img",
      "pk_img.u_code",
      "pk_img.u_table"
    )
    .innerJoin('pk_accessories', 'pk_teacher.t_code', 'pk_accessories.ac_u_id')
    .innerJoin('pk_img', 'pk_accessories.ac_id', 'pk_img.u_code')
    .where("pk_accessories.ac_id","=",req.body.ac_id)
    .where("pk_accessories.ac_u_table","=","pk_teacher")

    console.log(student.length)
    console.log(teacher.length)
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

/////////////////////////////// user ////////////////////////////////////////

router.post("/sh_accessories_w_std",async(req,res)=>{
  try{
    let db = req.db
    let student = await req.db('pk_accessories').select(
      "pk_accessories.ac_id",
      "pk_accessories.ac_name",
      "pk_accessories.ac_description",
      "pk_accessories.ac_u_id",
      "pk_accessories.ac_u_table",
      "pk_accessories.t_status",
      "pk_student.std_code",
      "pk_student.std_name",
      "pk_student.std_lname",
      "pk_student.std_pin_id"
    )
    .innerJoin('pk_student', 'pk_accessories.ac_u_id', 'pk_student.std_code')
    .where("pk_student.std_code","=",req.body.std_id)
    .where("pk_accessories.ac_u_table","=","pk_student")
    .where("pk_accessories.t_status","!=",0)

      res.send({
        ok: true,
        datas: student,
      })
    
  }catch(e){
    res.send({ok:false,error:e.message})
  }
})
/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////   26/11/61
router.post("/accessories_add",upload.any(),async (req,res,next)=>{
  try{
    let ac_id=await req.db("pk_accessories").insert({
      	ac_name:req.body.ac_name,
        ac_description:req.body.ac_description,
        ac_u_id:req.body.ac_u_id,
        ac_u_table:req.body.ac_u_table,
    })
    for(let i=0;i<req.files.length;i++){
      let img=await req.db("pk_img").insert({
        	img_img:req.files[i].filename,
          u_table:req.body.u_table,
          u_code:ac_id,
      })
    }
    let log=await req.db("pk_accessories_log").insert({
        ac_id:ac_id,
        ac_name:req.body.ac_name,
        ac_description:req.body.ac_description,
        ac_u_id:req.body.ac_u_id,
        ac_u_table:req.body.ac_u_table,
        u_id:req.body.u_id,
        ac_log_work:"เพิ่มข้อมูล"
    })
    res.send({ok:true,txt:"เพิ่มข้อมูล "+req.body.ac_name+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"(-_-') (add!)ไม่สามารถเพิ่มข้อมูลได้",alt:"error"})}
})

router.post("/accessories_del",async (req,res)=>{
  try{
    let ac_id=await req.db("pk_accessories").update({
      t_status:"0"
    }).where({ac_id:req.body.ac_id})
    let log=await req.db("pk_accessories_log").insert({
    	ac_id:req.body.ac_id,
      ac_name:req.body.ac_name,
      ac_description:req.body.ac_description,
      ac_u_id:req.body.ac_u_id,
      ac_u_table:req.body.ac_u_table,
      u_id:req.body.u_id,
      ac_log_work:"ลบข้อมูล",
    })
    res.send({ok:true,txt:"ลบข้อมูล "+req.body.d_id+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"(-_-') (del!)ไม่สามารถลบข้อมูลได้",alt:"error"})}
})
router.post("/accessories_update",upload.any(),async(req,res,next)=>{
  try{
    let sql=await req.db("pk_accessories").update({
      ac_name:req.body.ac_name,
      ac_description:req.body.ac_description,
      ac_u_id:req.body.ac_u_id,
      ac_u_table:req.body.ac_u_table,
    }).where({
      ac_id:req.body.ac_id
    })

    for(let i=0;i<req.files.length;i++){
      var cv_str=req.files[i].fieldname
      var sp=cv_str.split("-")
      let sel=sp[1]
      let img=await req.db("pk_img").update({
        	img_img:req.files[i].filename,
      }).where("img_id","=",sel)
    }

    let log=await req.db("pk_accessories_log").insert({
      ac_id:req.body.ac_id,
      ac_name:req.body.ac_name,
      ac_description:req.body.ac_description,
      ac_u_id:req.body.ac_u_id,
      ac_u_table:req.body.ac_u_table,
      u_id:req.body.u_id,
      ac_log_work:"แก้ไขข้อมูล",
    })
    res.send({ok:true,txt:"แก้ไขข้อมูล "+req.body.ac_name+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"(-_-') (update!)ไม่สามารถแก้ไขข้อมูล "+req.body.ac_name+" ได้",alt:"error"})}
})

router.post('/restore', async (req, res) => {
  try {
    let rows = await req.db(req.body.data).select('*').where({run_id: req.body.id})
    let restore=await req.db(req.body.target).update({
      t_status:1,
      ac_name:rows[0].ac_name,
      ac_description:rows[0].ac_description,
      ac_u_id:rows[0].ac_u_id,
      ac_u_table:rows[0].ac_u_table,
    }).where({ac_id:rows[0].ac_id})
    let log=await req.db(req.body.data).insert({
      ac_id:rows[0].ac_id,
      ac_name:rows[0].ac_name,
      ac_description:rows[0].ac_description,
      ac_u_id:rows[0].ac_u_id,
      ac_u_table:rows[0].ac_u_table,
      u_id:rows[0].u_id,
      ac_log_work:"เรียกคืนข้อมูล",

    })
    res.send({
      ok:true,txt:"เรียกคืนข้อมูล "+rows[0].ac_name+" สำเร็จ",alt:"success"
    })
  } catch (e) {
    res.send({ ok: false,txt:"(-_-') (restore!) ไม่สามารถเรียกคืนข้อมูลได้",alt:"error"})
  }
})
