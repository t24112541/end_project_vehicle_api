const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/object_control')
  },
  filename: function (req, file, cb) {
    cb(null, "veh-oc" + '-' + Date.now()+".jpg")
  }
})

const upload = multer({ storage: storage })
module.exports = router



//////////////////////////// missing_chart ///////////////////////////////
router.post('/missing_chart',async(req,res)=>{console.log("missing_chart")
  try{
    let db=req.db
    let pk_machine_all=await db("pk_machine").select("*").where("t_status","!=","0")
    let pk_accessories_all=await db("pk_accessories").select("*").where("t_status","!=","0")
    let pk_missing_all=await db("pk_missing").select("*")
    let pk_object_control_all=await db("pk_object_control").select("*")

    let chart_ms=await db("pk_missing").select("*").groupBy("ms_chart_month").count("ms_id as num")
    let chart_oc=await db("pk_object_control").select("*").groupBy("oc_chart_month").count("oc_id as num")
    // let pk_accessories_all=await db("pk_accessories").count("ac_id as count_ac")
    //
    // let pk_missing_where_ac=await db("pk_missing").count("ms_id as count_ms").where("ms_status","ขั้นที่ 1 รอรับเรื่อง").where("ms_table","pk_machine")
    // let pk_missing_where_2_ac=await db("pk_missing").count("ms_id as count_ms").where("ms_status","ขั้นที่ 2 รับเรื่องแล้ว").where("ms_table","pk_machine")
    //
    // let pk_object_control_where_ac=await db("pk_object_control").count("oc_id as count_oc").where("oc_status","ผิดระเบียบ").where("oc_u_table","pk_machine")
    // let pk_object_control_where_2_ac=await db("pk_object_control").count("oc_id as count_oc").where("oc_status","รอการตรวจสอบ").where("oc_u_table","pk_machine")

    // console.log(pk_missing_all)
    // for(let i=1;i<=12;i++){
    //   var sp=rows[i].ms_date.split("-")
    //   let sel=sp[1]
    //   if()
    //
    //   console.log(sel)
    // }


    // let itm=await db('pk_missing').select("*")
    //
    res.send({
      ok:true,
      pk_machine_all,pk_missing_all,pk_object_control_all,pk_accessories_all,
      chart_ms,chart_oc

    })
  }catch(e){res.send({
    ok:false,
    error:e.message
  })}
})
