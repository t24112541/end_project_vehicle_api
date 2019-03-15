const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/files/img/missing')
  },
  filename: function (req, file, cb) {
    cb(null, "veh-ms" + '-' + Date.now()+".jpg")
  }
})

const upload = multer({ storage: storage })
module.exports = router

router.post('/list', async (req, res) => {
  try {
    let field_name=''
    let name_1=[]
    let name_2=[]
    let name_3=[]
    let db=req.db
    let missing = await req.db('pk_missing').select(

      "pk_missing.ms_id",
      "pk_missing.ms_u_id",
      "pk_missing.ms_u_table",
      "pk_missing.u_id ",
      "pk_missing.ms_table",
      "pk_missing.ms_date",
      "pk_missing.u_ms_date",
      "pk_missing.ms_status"
    )
    .where("ms_table","=",req.body.cv_filter)
    .where("ms_status","=",req.body.cv_filter_stp)
    .orderBy("pk_missing.ms_id","desc")

    for(let i=0;i<missing.length;i++){
      let tb_name=missing[i].ms_u_table
      let tb_dev=missing[i].ms_table
      if(tb_name=='pk_teacher'){
        field_name="t_code"
        let u_1=await db(tb_name).where(field_name,missing[i].ms_u_id)
        name_1[i]=u_1[0].t_name
      }
      else if(tb_name=="pk_admin"){
        field_name="a_username"
        let u_1=await db(tb_name).where(field_name,missing[i].ms_u_id)
        name_1[i]=u_1[0].a_name+' '+u_1[0].a_lname
      }
      else if(tb_name=="pk_student"){
        field_name="std_code"
        let u_1=await db(tb_name).where(field_name,missing[i].ms_u_id)
        name_1[i]=u_1[0].std_name+' '+u_1[0].std_lname
      }

      if(tb_dev=='pk_machine'){
        field_dev_name="mc_id"
        let field_1=''
        let bld_name=''
        let u_1=await db(tb_dev).where(field_dev_name,missing[i].u_id)
        if(u_1[0].mc_u_table=="pk_teacher"){field_1="t_code"
          let u_2=await db(u_1[0].mc_u_table).select("t_name").where(field_1,u_1[0].std_id)
          bld_name=u_2[0].t_name
        }
        else if(u_1[0].mc_u_table=="pk_student"){field_1="std_code"
          let u_2=await db(u_1[0].mc_u_table).select("std_name","std_lname").where(field_1,u_1[0].std_id)
          bld_name=u_2[0].std_name+" "+u_2[0].std_lname
        }
        name_2[i]=u_1[0].mc_code
        name_3[i]=bld_name
      }
      else if(tb_dev=="pk_accessories"){
        field_dev_name="ac_id"
        let field_1=''
        let bld_name=''
        let u_1=await db(tb_dev).where(field_dev_name,missing[i].u_id)
        if(u_1[0].ac_u_table=="pk_teacher"){field_1="t_code"
          let u_2=await db(u_1[0].ac_u_table).select("t_name").where(field_1,u_1[0].ac_u_id)
          bld_name=u_2[0].t_name
        }
        else if(u_1[0].ac_u_table=="pk_student"){field_1="std_code"
          let u_2=await db(u_1[0].ac_u_table).select("std_name","std_lname").where(field_1,u_1[0].ac_u_id)
          bld_name=u_2[0].std_name+" "+u_2[0].std_lname
        }
        name_2[i]=u_1[0].ac_name
        name_3[i]=bld_name
      }
      missing[i].ms_u_id=name_2[i]
      missing[i].u_id=name_1[i]
      missing[i].ms_u_table=name_3[i]
    }

    let stp1=await db('pk_missing').count('ms_id as count').where("ms_status","ขั้นที่ 1 รอรับเรื่อง").where("ms_table","=",req.body.cv_filter)
    let stp2=await db('pk_missing').count('ms_id as count').where("ms_status","ขั้นที่ 2 รับเรื่องแล้ว").where("ms_table","=",req.body.cv_filter)
    let stp3=await db('pk_missing').count('ms_id as count').where("ms_status","ขั้นที่ 3 พบเเล้ว").where("ms_table","=",req.body.cv_filter)

    let machines=await db("pk_missing").count("ms_id as count").where("ms_table","pk_machine").where("ms_status","ขั้นที่ 1 รอรับเรื่อง")
    let accessories=await db("pk_missing").count("ms_id as count").where("ms_table","pk_accessories").where("ms_status","ขั้นที่ 1 รอรับเรื่อง")

      res.send({
        ok: true,
        datas: missing,
        stp1,stp2,stp3,machines,accessories,
      })

  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})
//////////////////////// search ///////////////////////////////

///////////////////////////////////////////////////////////////
router.post('/sh_missing', async (req, res) => {
  try {
    let machine = await req.db('pk_machine').select(
      "pk_missing.ms_id",
      "pk_missing.ms_u_id",
      "pk_missing.ms_u_table",
      "pk_missing.u_id",
      "pk_missing.ms_table",
      "pk_missing.ms_date",
      "pk_missing.u_ms_date",
      "pk_missing.ms_status",
      "pk_missing.ms_detail",
      "pk_machine.mc_id",
      "pk_machine.mc_code as ms_name",
      "pk_machine.mc_brand",
      "pk_machine.mc_series",
      "pk_machine.std_id",
      "pk_machine.t_status",
      "pk_machine.mc_u_table",
      "pk_img.img_img"
    )
    .innerJoin('pk_missing', 'pk_machine.mc_id', 'pk_missing.u_id')
    .innerJoin("pk_img","pk_missing.ms_id","pk_img.u_code")
    .orderBy("pk_missing.ms_id","desc")
    .where("pk_missing.ms_id","=",req.body.ms_id)
    .where("pk_img.u_table","pk_missing")

    let accessories = await req.db('pk_accessories').select(
      "pk_accessories.ac_id",
      "pk_accessories.ac_name as ms_name",
      "pk_accessories.ac_description",
      "pk_accessories.ac_u_id",
      "pk_accessories.ac_u_table",
      "pk_accessories.t_status",
      "pk_missing.ms_id",
      "pk_missing.ms_u_id",
      "pk_missing.ms_u_table",
      "pk_missing.u_id",
      "pk_missing.ms_table",
      "pk_missing.ms_date",
      "pk_missing.u_ms_date",
      "pk_missing.ms_status",
      "pk_img.img_img",
      "pk_missing.ms_detail",
    )
    .innerJoin('pk_missing', 'pk_accessories.ac_id', 'pk_missing.u_id')
    .innerJoin("pk_img","pk_missing.ms_id","pk_img.u_code")
    .orderBy("pk_missing.ms_id","desc")
    .where("pk_missing.ms_id","=",req.body.ms_id)
    .where("pk_img.u_table","pk_missing")

    console.log(machine)
    console.log(accessories)
    if(machine.length==1){
      res.send({
        ok: true,
        datas: machine,
        type:"พาหนะ ทะเบียน "
      })
    }
    if(accessories.length==1){
      res.send({
        ok: true,
        datas: accessories,
        type:"อุปกรณ์"
      })
    }

  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})

//////////////////////////// user ////////////////////////////////
router.post('/sh_missing_w_std', async (req, res) => {
try {
  if(req.body.type=="pk_machine"){
      let machine = await req.db('pk_machine').select(
        "pk_missing.ms_id",
        "pk_missing.ms_u_id",
        "pk_missing.ms_u_table",
        "pk_missing.u_id",
        "pk_missing.ms_table",
        "pk_missing.ms_date",
        "pk_missing.u_ms_date",
        "pk_missing.ms_status"
      )
      .innerJoin('pk_missing', 'pk_machine.mc_id', 'pk_missing.u_id')
      .innerJoin('pk_student', 'pk_student.std_code', 'pk_machine.std_id')
      .orderBy("pk_missing.ms_id","desc")
      .where("pk_student.std_id","=",req.body.std_id)
      console.log(machine)
        res.send({
          ok: true,
          datas: machine,
          type:"พาหนะ ทะเบียน "
        })

  }else if(req.body.type=="pk_accessories"){
    // console.log("pk_accessories");
    let accessories = await req.db('pk_accessories').select(
      "pk_missing.ms_id",
      "pk_missing.ms_u_id",
      "pk_missing.ms_u_table",
      "pk_missing.u_id",
      "pk_missing.ms_table",
      "pk_missing.ms_date",
      "pk_missing.u_ms_date",
      "pk_missing.ms_status"
    )
    .innerJoin('pk_student', 'pk_accessories.ac_u_id', 'pk_student.std_code')
    .innerJoin('pk_missing', 'pk_accessories.ac_id', 'pk_missing.u_id')
    .orderBy("pk_missing.ms_id","desc")
    .where("pk_student.std_id","=",req.body.std_id)
    // console.log(accessories.length);

      res.send({
        ok: true,
        datas: accessories,
        type:"อุปกรณ์"
      })

  }



  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})

////////////////////////////////////////////////////////////////////

router.post('/missing',upload.any(),async (req, res) => {
  let db=req.db
  try {
    let rows = await req.db('pk_missing').insert({
      u_id:req.body.u_id,
      ms_table:req.body.ms_table,
      ms_u_id:req.body.ms_u_id,
      ms_u_table:req.body.ms_u_table,
      ms_status:req.body.ms_status,
      ms_detail:req.body.ms_detail,
    })
    let get_month=await db("pk_missing").select("ms_date").where("ms_id",rows)
    // console.log(get_month[0].ms_date)
    let spl=get_month[0].ms_date.split("-")
    console.log(spl[1])
    let set_chart = await req.db('pk_missing').update({
      ms_chart_month:spl[1]
    }).where("ms_id",rows)
    if(req.files.length==0){
      let img=await req.db("pk_img").insert({
          img_img:"veh-u-default.jpg",
          u_table:"pk_missing",
          u_code:rows,
      })
    }
    else{
      for(let i=0;i<req.files.length;i++){
        let img=await req.db("pk_img").insert({
            img_img:req.files[i].filename,
            u_table:"pk_missing",
            u_code:rows,
        })
      }
    }

    res.send({ok:true,txt:"ทำการแจ้งหายเเล้ว",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถทำการแจ้งหายได้"+e.message,alt:"error"})}
})

router.post("/missing_update",async(req,res)=>{
  try{
    let sql=await req.db("pk_missing").update({
        ms_status:req.body.ms_status,
    }).where({
      ms_id:req.body.ms_id
    })

    res.send({ok:true,txt:"อัพเดทสถานะแล้ว",alt:"success"})
  }catch(e){res.send({ok:false,txt:e.message,alt:"error"})}
})
