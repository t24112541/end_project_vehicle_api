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

router.post('/', async (req, res) => {
  try{
    let db=req.db
    let ctrl=await db("pk_control_edit_data")
    res.send({datas:ctrl})
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})

router.post("/update_ctrl_edit_data",async(req,res)=>{
  try{
    let db=req.db
    let ctrl=await db("pk_control_edit_data").update("ctrl_status",req.body.ctrl_status).where("ctrl_id",req.body.ctrl_id)
    res.send({ok:true,txt:"บันทึกเรียบ้อย ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถทำงานดังกล่าวได้ "+e.message,alt:"error"})}
})
