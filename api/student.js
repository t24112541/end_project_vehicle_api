const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/users')
  },
  filename: function (req, file, cb) {
    cb(null, "veh-u" + '-' + Date.now()+".jpg")
  }
})

const upload = multer({ storage: storage })

module.exports = router

router.get('/list', async (req, res) => {
  try {
    let rows = await req.db('pk_student').select(
      "pk_group.g_name",
      "pk_department.d_name",
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
      "pk_student.std_tel",
      "pk_student.std_blood",
      "pk_student.t_status",
      "pk_student.std_tel",
      "pk_student.std_tel2"
    )
    .orderBy("pk_student.std_code","desc").where("pk_student.t_status","!=","0")
    .innerJoin("pk_group","pk_student.g_code","pk_group.g_code")
    .innerJoin("pk_department","pk_group.d_code","pk_department.d_code")
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
    let rows = await req.db('pk_student').select(
      "pk_group.g_name",
      "pk_group.g_code",
      "pk_department.d_name",
      "pk_department.d_code",
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
      "pk_student.std_tel",
      "pk_student.std_blood",
      "pk_student.t_status",
      "pk_student.std_tel",
      "pk_student.std_tel2"
    )
    .orderBy("pk_student.std_code","desc")
    .where("pk_student.t_status","!=",0)
    .innerJoin("pk_group","pk_student.g_code","pk_group.g_code")
    .innerJoin("pk_department","pk_group.d_code","pk_department.d_code")
    .where("pk_student.std_code","like",'%'+req.body.txt_search+'%')
    .orWhere("pk_student.std_name","like",'%'+req.body.txt_search+'%')
    .orWhere("pk_group.g_code","like",'%'+req.body.txt_search+'%')
    .orWhere("pk_group.g_name","like",'%'+req.body.txt_search+'%')
    .orWhere("pk_department.d_code","like",'%'+req.body.txt_search+'%')
    .orWhere("pk_department.d_name","like",'%'+req.body.txt_search+'%')
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})
///////////////////////////////////////////////////////////////
////////////////////// select std_id ////////////////////////
router.post('/std_id', async (req, res) => {
  try {
    let rows = await req.db('pk_student').select('*').where("t_status","!=","0")
    .where("std_code","like",'%'+req.body.std_code+'%')
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})
/////////////////////////////////////////////////////////////
router.post('/list_g', async (req, res) => {
  console.log(req.body.g_code)
  console.log(req.body.txt_search)
  if(req.body.txt_search!="txt_search"){
    try {
      let rows = await req.db('pk_student').select(
        "pk_group.g_name",
        "pk_group.g_code",
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
        "pk_student.std_tel",
        "pk_student.std_blood",
        "pk_student.t_status",
        "pk_student.std_tel",
        "pk_student.std_tel2"
      )
      .orderBy("pk_student.std_code","desc")
      .where("pk_student.t_status","!=",0)
      .where("pk_student.g_code","=",req.body.g_code)
      .innerJoin("pk_group","pk_student.g_code","pk_group.g_code")
      .where("pk_student.std_code","like",'%'+req.body.txt_search+'%')
      .orWhere("pk_student.std_name","like",'%'+req.body.txt_search+'%')

      console.log(rows)
      res.send({
        ok: true,
        datas: rows,
      })
    } catch (e) {
      res.send({ ok: false, error: e.message })
    }
  }else{
    try {
      let rows = await req.db('pk_student').select('*')
      .where({
        g_code:req.body.g_code
      })
      .orderBy("std_code","desc")
      console.log(rows)
      res.send({
        ok: true,
        datas: rows,
      })
    } catch (e) {
      res.send({ ok: false, error: e.message })
    }
  }
})

router.get("/sh_std/:std_id",async(req,res)=>{
  console.log('param='+req.params.std_id)
  try{
    let db = req.db
    let row = await req.db('pk_student').select(
      "pk_group.g_name",
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
      "pk_department.d_name",
      "pk_student.std_tel",
      "pk_student.std_tel2"
    )
    .innerJoin('pk_group', 'pk_student.g_code', 'pk_group.g_code')
    .innerJoin('pk_department', 'pk_group.d_code', 'pk_department.d_code')
    .where("pk_student.std_id","=",req.params.std_id)

    let img=await db("pk_img").select("*").where("u_code",req.params.std_id).where("u_table","pk_student")

    res.send({
      ok:true,
      datas: row[0] || {},
      img,
    })
  }catch(e){
    res.send({ok:false,error:e.message})
  }
})

router.post("/std_add",upload.any(),async (req,res)=>{
  try{
    let chk_std=await req.db("pk_student").where("std_code",req.body.std_code)
    if (chk_std.length==0){
      let std_id=await req.db("pk_student").insert({
        	std_code:req.body.std_code,
          std_gender:req.body.std_gender,
          std_prename:req.body.std_prename,
          std_name:req.body.std_name,
          std_lname:req.body.std_lname,
          std_pin_id:req.body.std_pin_id,
          std_birthday:req.body.std_birthday,
        	std_blood:req.body.std_blood,
        	g_code:req.body.g_code,
        	std_username:req.body.std_code,
        	std_password:req.body.std_pin_id,
          std_tel:req.body.std_tel,
          std_tel2:req.body.std_tel2
      })
      if(req.files.length==0){
        let img=await req.db("pk_img").insert({
            img_img:"veh-u-default.jpg",
            u_table:req.body.u_table,
            u_code:std_id,
        })
      }
      else{
        for(let i=0;i<req.files.length;i++){
          let img=await req.db("pk_img").insert({
              img_img:req.files[i].filename,
              u_table:req.body.u_table,
              u_code:std_id,
          })
        }
      }

      let log=await req.db("pk_student_log").insert({
          std_id:std_id,
        	std_code:req.body.std_code,
          std_gender:req.body.std_gender,
          std_prename:req.body.std_prename,
          std_name:req.body.std_name,
          std_lname:req.body.std_lname,
          std_tel:req.body.std_tel,
          std_tel2:req.body.std_tel2,
          std_pin_id:req.body.std_pin_id,
          std_birthday:req.body.std_birthday,
        	std_blood:req.body.std_blood,
        	g_code:req.body.g_code,
        	std_username:req.body.std_code,
        	std_password:req.body.std_pin_id,
          std_log_work:"เพิ่มข้อมูล",
          u_id:req.body.u_id
      })
      res.send({ok:true,txt:"เพิ่มข้อมูล "+req.body.std_code+" สำเร็จ",alt:"success"})
    }else{
      res.send({ok:false,txt:"พบข้อมูล "+req.body.std_code+" อยู่ในระบบอยู่แล้ว",alt:"error"})
    }

  }catch(e){res.send({ok:false,txt:"ไม่สามารถเพิ่มข้อมูลได้",alt:"error"})}
})

router.post("/std_del",async (req,res)=>{//console.log(req.params.std_id)
  try{
    let std_id=await req.db("pk_student").update({
      t_status:"0"
    }).where({
      std_id:req.body.std_id
    })
    let log=await req.db("pk_student_log").insert({
        std_id:req.body.std_id,
      	std_code:req.body.std_code,
        std_gender:req.body.std_gender,
        std_prename:req.body.std_prename,
        std_name:req.body.std_name,
        std_lname:req.body.std_lname,
        std_pin_id:req.body.std_pin_id,
        std_birthday:req.body.std_birthday,
      	std_blood:req.body.std_blood,
        std_tel:req.body.std_tel,
        std_tel2:req.body.std_tel2,
      	g_code:req.body.g_code,
      	std_username:req.body.std_code,
      	std_password:req.body.std_pin_id,
        std_log_work:"ลบข้อมูล",
        u_id:req.body.u_id
    })
    res.send({ok:true,txt:"ลบข้อมูล "+req.body.std_id+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถลบข้อมูลได้",alt:"error"})}
})
router.post("/std_update",upload.any(),async(req,res)=>{//console.log(req.body.std_id)
  try{
    let sql=await req.db("pk_student").update({
      std_code:req.body.std_code,
      std_pin_id:req.body.std_pin_id,
      std_prename:req.body.std_prename,
      std_name:req.body.std_name,
      std_lname:req.body.std_lname,
      std_birthday:req.body.std_birthday,
      std_gender:req.body.std_gender,
      std_blood:req.body.std_blood,
      std_tel:req.body.std_tel,
      std_tel2:req.body.std_tel2,
      g_code:req.body.g_code
    }).where({
      std_id:req.body.std_id
    })
    for(let i=0;i<req.files.length;i++){
      var cv_str=req.files[i].fieldname
      var sp=cv_str.split("-")
      let sel=sp[1]
      let img=await req.db("pk_img").update({
        	img_img:req.files[i].filename,
      }).where("img_id","=",sel)
    }
    let log=await req.db("pk_student_log").insert({
        std_id:req.body.std_id,
      	std_code:req.body.std_code,
        std_gender:req.body.std_gender,
        std_prename:req.body.std_prename,
        std_name:req.body.std_name,
        std_lname:req.body.std_lname,
        std_pin_id:req.body.std_pin_id,
        std_birthday:req.body.std_birthday,
      	std_blood:req.body.std_blood,
      	g_code:req.body.g_code,
      	std_username:req.body.std_code,
      	std_password:req.body.std_pin_id,
        std_tel:req.body.std_tel,
        std_tel2:req.body.std_tel2,
        std_log_work:"แก้ไขข้อมูล",
        u_id:req.body.u_id
    })
    res.send({ok:true,txt:"แก้ไขข้อมูล "+req.body.std_code+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถแก้ไขข้อมูล "+req.body.std_code+" ได้",alt:"error"})}
})

router.post('/restore', async (req, res) => {
  try {
    let rows = await req.db(req.body.data).select('*').where({run_id: req.body.id})
    let restore=await req.db(req.body.target).update({
      t_status:1,
      std_code:rows[0].std_code,
      std_gender:rows[0].std_gender,
      std_prename:rows[0].std_prename,
      std_name:rows[0].std_name,
      std_lname:rows[0].std_lname,
      std_pin_id:rows[0].std_pin_id,
      std_birthday:rows[0].std_birthday,
      std_username:rows[0].std_username,
      std_password:rows[0].std_password,
      g_code:rows[0].g_code,
      std_blood:rows[0].std_blood,
      std_tel:rows[0].std_tel,
      std_tel2:rows[0].std_tel2
    }).where({std_id:rows[0].std_id})
    let log=await req.db(req.body.data).insert({
      std_id:rows[0].std_id,
      std_code:rows[0].std_code,
      std_gender:rows[0].std_gender,
      std_prename:rows[0].std_prename,
      std_name:rows[0].std_name,
      std_lname:rows[0].std_lname,
      std_pin_id:rows[0].std_pin_id,
      std_birthday:rows[0].std_birthday,
      std_blood:rows[0].std_blood,
      g_code:rows[0].g_code,
      std_username:rows[0].std_code,
      std_password:rows[0].std_pin_id,
      std_log_work:"เรียกคืนข้อมูล",
      u_id:rows[0].u_id,
      std_tel:rows[0].std_tel,
      std_tel2:rows[0].std_tel2
    })
    res.send({
      ok:true,txt:"เรียกคืนข้อมูล "+rows[0].t_name+" สำเร็จ",alt:"success"
    })
  } catch (e) {
    res.send({ ok: false,txt:"(-_-') (restore!) ไม่สามารถเรียกคืนข้อมูลได้",alt:"error"})
  }
})

router.post('/sh_profile', async (req, res) => {
  try {
    let rows = await req.db('pk_student').select('*').where("std_id","=",req.body.id)
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})

router.post("/profile_update",async(req,res)=>{
  try{
    let sql=await req.db("pk_student").update({
        std_name:req.body.std_name,
        std_lname:req.body.std_lname,
        std_tel:req.body.std_tel,
        std_tel2:req.body.std_tel2,
    }).where({
      std_id:req.body.id
    })
    res.send({ok:true,txt:"อัพเดทข้อมูลแล้ว",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถอัพเดทข้อมูลได้",alt:"error"})}
})

router.post("/security_update",async(req,res)=>{
  try{
    if(req.body.cv_set==="username"){
        let sql=await req.db("pk_student").update({
            std_username:req.body.std_username
        }).where({std_id:req.body.std_id})
    }
    else if(req.body.cv_set==="password"){
        let sql=await req.db("pk_student").update({
            std_password:req.body.std_password
        }).where({std_id:req.body.std_id})
    }
    res.send({ok:true,txt:"อัพเดทข้อมูลแล้ว",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถอัพเดทข้อมูลได้",alt:"error"})}
})
