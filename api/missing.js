const express = require('express')
const router = express.Router()

module.exports = router

router.post('/list', async (req, res) => {
  try {
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
    .orderBy("pk_missing.ms_id","desc")

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
      "pk_machine.mc_id",
      "pk_machine.mc_code as ms_name",
      "pk_machine.mc_brand",
      "pk_machine.mc_series",
      "pk_machine.std_id",
      "pk_machine.t_status",
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
    .orderBy("pk_missing.ms_id","desc")
    .where("pk_missing.ms_id","=",req.body.ms_id)

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
      "pk_missing.ms_status"
    )
    .innerJoin('pk_missing', 'pk_accessories.ac_id', 'pk_missing.u_id')
    .orderBy("pk_missing.ms_id","desc")
    .where("pk_missing.ms_id","=",req.body.ms_id)
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

router.post('/missing', async (req, res) => {
  try {
    let rows = await req.db('pk_missing').insert({
      u_id:req.body.u_id,
      ms_table:req.body.ms_table,
      ms_u_id:req.body.ms_u_id,
      ms_u_table:req.body.ms_u_table,
      ms_status:req.body.ms_status,
    })

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
