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
    let pk_machine_all=await db("pk_machine").count("mc_id as count_mc")
    let pk_missing_all=await db("pk_missing").count("ms_id as count_ms")
    let pk_object_control_all=await db("pk_object_control").count("oc_id as count_oc")

    let pk_missing_where=await db("pk_missing").count("ms_id as count_ms").where("ms_status","ขั้นที่ 1 รอรับเรื่อง")
    let pk_missing_where_2=await db("pk_missing").count("ms_id as count_ms").where("ms_status","ขั้นที่ 2 รับเรื่องแล้ว")

    let pk_object_control_where=await db("pk_object_control").count("oc_id as count_oc").where("oc_status","ผิดระเบียบ")
    let pk_object_control_where_2=await db("pk_object_control").count("oc_id as count_oc").where("oc_status","รอการตรวจสอบ")

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
      pk_machine_all,pk_missing_all,pk_object_control_all,
      pk_missing_where,
      pk_missing_where_2,
      pk_object_control_where,
      pk_object_control_where_2,
    })
  }catch(e){res.send({
    ok:false,
    error:e.message
  })}
})
