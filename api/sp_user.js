const express = require('express')
const router = express.Router()

module.exports = router

router.post("/user_add",async (req,res)=>{
  try{
    let d_id=await req.db("sp_user").insert({
      	u_fullname:req.body.u_fullname,
        u_username:req.body.u_username,
        u_password:req.body.u_password,
        u_tel:req.body.u_tel,
        u_type:req.body.u_type
    })
    res.send({ok:true,txt:"ลงทะเบียนสำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถลงทะเบียนได้",alt:"error"})}
})

router.get('/sh_user/:u_id', async (req, res) => {
  let db = req.db
  let rows = await db('sp_user')
    .where('u_id', '=', req.params.u_id)
  res.send({
    ok: true,
    user: rows[0] || {},
  })
})

router.post("/user_update",async (req,res)=>{
  try{
    let d_id=await req.db("sp_user").update({
      	u_fullname:req.body.u_fullname,
        u_username:req.body.u_username,
        u_password:req.body.u_password,
        u_tel:req.body.u_tel,
    }).where("u_id","=",req.body.u_id)
    res.send({ok:true,txt:"แก้ไขข้อมูลสำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถแก้ไขข้อมูลได้",alt:"error"})}
})
