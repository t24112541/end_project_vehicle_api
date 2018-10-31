const express = require('express')
const router = express.Router()

module.exports = router

router.post('/', async (req, res) => {

  let std = await req.db('pk_student')
    .where('std_username', '=', req.body.username || '')
    .where('std_password', '=', req.body.password || '')
  let tch = await req.db('pk_teacher')
    .where('t_username', '=', req.body.username || '')
    .where('t_password', '=', req.body.password || '')

    // console.log("std"+std.length)
    // console.log("tch"+tch.length)
    if(std.length===1){
      let user=std[0]
      res.send({
        status:"std",
        ok: true,
        login:user,})
        // console.log('std='.std)
    }
    else if(("t24112541"==req.body.username && "c24112541"==req.body.password) || ("siriluk1998"==req.body.username && "2541joy"==req.body.password)){
      res.send({
        status:"bld",
        ok: true,
        login:{bld_username:req.body.username,bld_password:req.body.password}
      })
    }
    else if(tch.length===1){
      let user=tch[0]
      res.send({
        status:"tch",
        ok: true,
        login:user,})
      // console.log('tch='.tch)
    }
    else{
      res.send({
        status:"oth",
        ok: false,
        alt_txt:"รหัสชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
      })
    }

})
