const express = require('express')
const router = express.Router()

module.exports = router

router.post('/sh_profile', async (req, res) => {
  try {
    let rows = await req.db('pk_admin').select('*').where("a_id","=",req.body.id)
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})

router.post("/admin_del",async (req,res)=>{
  try{
    let t_id=await req.db("pk_admin").del().where({
      a_id:req.body.id
    })
    res.send({ok:true,txt:"ลบบัญชีดังกล่าวแล้ว",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถลบบัญชีดังกล่าวได้",alt:"error"})}
})

router.post("/profile_update",async(req,res)=>{
  try{
    let sql=await req.db("pk_admin").update({
        a_name:req.body.a_name,
        a_lname:req.body.a_lname,
        a_tel:req.body.a_tel,
    }).where({
      a_id:req.body.id
    })
    res.send({ok:true,txt:"อัพเดทข้อมูลแล้ว",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถอัพเดทข้อมูลได้",alt:"error"})}
})

router.post("/security_update",async(req,res)=>{
  try{
    if(req.body.cv_set==="username"){
        let sql=await req.db("pk_admin").update({
            a_username:req.body.a_username
        }).where({a_id:req.body.a_id})
    }
    else if(req.body.cv_set==="password"){
        let sql=await req.db("pk_admin").update({
            a_password:req.body.a_password
        }).where({a_id:req.body.a_id})
    }
    res.send({ok:true,txt:"อัพเดทข้อมูลแล้ว",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถอัพเดทข้อมูลได้",alt:"error"})}



})
