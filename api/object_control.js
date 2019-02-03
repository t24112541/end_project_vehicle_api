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


//////////////////////////////////// item //////////////////////////////////////
//////////////////////////// item_object_control ///////////////////////////////
router.get('/item_object_control',async(req,res)=>{
  try{
    let db=req.db
    let itm=await db('pk_item_object_control').select("*")

    res.send({
      ok:true,
      datas:itm
    })
  }catch(e){res.send({
    ok:false,
    error:e.message
  })}
})

//////////////////////////// add_item_object_control ///////////////////////////
router.post('/add_item_object_control',async(req,res)=>{
  try{
    let db=req.db
    let itm=await db('pk_item_object_control').insert({
      itm_oc_name:req.body.itm_oc_name,
    })
    res.send({ok:true,itm,alt:"success"})
  }catch(e){res.send({ok:false,txt:e.message,alt:"error"})}
})


////////////////////////////// object_control /////////////////////////////////
//////////////////////////// add_object_control ///////////////////////////////
router.post('/add_object_control',upload.any(),async (req, res)=>{
  try{
    console.log(req.body.oc_u_id)
    let db=req.db
    let itm=await db('pk_object_control').insert({
      oc_u_id:req.body.oc_u_id,
      oc_u_table:req.body.oc_u_table,
      oc_oc_u_id:req.body.oc_oc_u_id,
      oc_oc_u_table:req.body.oc_oc_u_table,
      oc_status:"ผิดระเบียบ",
      itm_oc_id:req.body.itm_oc_id,
    })
    // for(let i=0;i<req.files.length;i++){
    if(req.files.length>0){
      let img=await req.db("pk_img").insert({
        	img_img:req.files[0].filename || "",
          u_code:itm,
          u_table:"pk_object_control",
      })
    }
    // else{
    //   let img=await req.db("pk_img").insert({
    //     	img_img:"",
    //       u_code:itm,
    //       u_table:"pk_object_control",
    //     })
    // }
    // // }

    res.send({ok:true,txt:"ทำการแจ้งสิ่งผิดระเบียบแล้ว",alt:"success"})
  }catch(e){res.send({ok:false,txt:e.message,alt:"error"})}
})

//////////////////////////// update_object_control ///////////////////////////////
router.post('/update_object_control',async(req,res)=>{
  try{
    let db=req.db
    let itm=await db('pk_object_control').update({
      oc_status:req.body.oc_status,
    }).where('oc_id',req.body.oc_id)
    res.send({
      ok: true,
      txt:"ผ่านการตรวจแก้แล้ว",
      alt:"success"
    })
  }catch(e){res.send({ok:false,error:e.message,txt:"ไม่สามารถแก้ไขข้อมูลได้",alt:"error"})}
})

router.post('/list', async (req, res) => {
  try {
    let db=req.db
    let rows = await db('pk_object_control').select("*")
    .where("oc_u_table","=",req.body.cv_filter)
    .orderBy("oc_id","desc")
    .innerJoin("pk_item_object_control","pk_item_object_control.itm_oc_id","pk_object_control.itm_oc_id")

    let stp1=await db('pk_object_control').count('oc_id as count').where("oc_status","ผิดระเบียบ").where("oc_u_table","=",req.body.cv_filter)
    let stp2=await db('pk_object_control').count('oc_id as count').where("oc_status","รอการตรวจสอบ").where("oc_u_table","=",req.body.cv_filter)
    let stp3=await db('pk_object_control').count('oc_id as count').where("oc_status","ผ่านการตรวจสอบ").where("oc_u_table","=",req.body.cv_filter)

    //
    let machines=await db("pk_object_control").count("oc_id as count").where("oc_u_table","pk_machine").where("oc_status","ผิดระเบียบ")
    let accessories=await db("pk_object_control").count("oc_id as count").where("oc_u_table","pk_accessories").where("oc_status","ผิดระเบียบ")

    console.log(rows)
      res.send({
        ok: true,
        datas:rows,
        stp1,stp2,stp3,machines,accessories,
      })

  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})


/////////////////////////  sh_object_control  /////////////////////////////////
router.post('/sh_object_control', async (req, res) => {
  try {
    let db=req.db
    let machine = await req.db('pk_machine').select(
      "pk_object_control.oc_id",
      "pk_object_control.oc_u_id",
      "pk_object_control.oc_u_table",
      "pk_object_control.oc_oc_u_id",
      "pk_object_control.oc_oc_u_table",
      "pk_object_control.oc_date",
      "pk_object_control.oc_update_date",
      "pk_object_control.oc_status",
      "pk_item_object_control.itm_oc_name",
      "pk_machine.mc_id as u_id",
      "pk_machine.mc_code as oc_name",
      "pk_machine.mc_brand",
      "pk_machine.mc_series",
      "pk_machine.std_id",
      "pk_machine.t_status",
      "pk_machine.mc_u_table",

    )
    .innerJoin('pk_object_control', 'pk_object_control.oc_u_id', 'pk_machine.mc_id')
    .innerJoin('pk_item_object_control', 'pk_item_object_control.itm_oc_id', 'pk_object_control.itm_oc_id')
    // .innerJoin("pk_img","pk_missing.ms_id","pk_img.u_code")
    .orderBy("pk_object_control.oc_id","desc")
    .where("pk_object_control.oc_id","=",req.body.oc_id)
    // .where("pk_img.u_table","pk_object_control")

    let accessories = await req.db('pk_accessories').select(
      "pk_object_control.oc_id",
      "pk_object_control.oc_u_table",
      "pk_object_control.oc_oc_u_id",
      "pk_object_control.oc_oc_u_table",
      "pk_object_control.oc_date",
      "pk_object_control.oc_update_date",
      "pk_object_control.oc_status",
      "pk_item_object_control.itm_oc_name",
      "pk_accessories.ac_id as u_id",
      "pk_accessories.ac_name as oc_name",
      "pk_accessories.ac_description",
      "pk_accessories.ac_u_id",
      "pk_accessories.ac_u_table",
      "pk_accessories.t_status"
    )
    .innerJoin('pk_object_control', 'pk_object_control.oc_u_id', 'pk_accessories.ac_id')
    .innerJoin('pk_item_object_control', 'pk_item_object_control.itm_oc_id', 'pk_object_control.itm_oc_id')

    .orderBy("pk_object_control.oc_id","desc")
    .where("pk_object_control.oc_id","=",req.body.oc_id)
    // // .where("pk_img.u_table","pk_missing")


    // console.log(machine[0].mc_id)
    // console.log(accessories)
    if(machine.length==1){
      let img=await db("pk_img").select("*").where("u_code","=",machine[0].oc_id).where("u_table","pk_object_control")
      console.log(img)
      res.send({
        ok: true,
        datas: machine,
        type:"พาหนะ ทะเบียน ",
        img
      })
    }
    if(accessories.length==1){
      let img=await db("pk_img").select("*").where("u_code","=",accessories[0].oc_id).where("u_table","pk_object_control")
      res.send({
        ok: true,
        datas: accessories,
        type:"อุปกรณ์",
        img
      })
    }

  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})
