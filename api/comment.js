const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/files/img/comment')
  },
  filename: function (req, file, cb) {
    cb(null, "veh-co" + '-' + Date.now()+".jpg")
  }
})

const upload = multer({ storage: storage })
module.exports = router


//////////////////////////////////// comment //////////////////////////////////////
//////////////////////////// item_object_control ///////////////////////////////
router.post('/list_comment_where_topic',async(req,res)=>{
  try{
    let db=req.db
    let itm=await db('pk_comment').select("*").where("co_u_id",req.body.co_u_id).where("co_u_table",req.body.co_u_table).orderBy("co_id","desc")

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
router.post('/add_comment',async (req, res)=>{
  try{
    // console.log(req.body)
    let db=req.db
    let itm=await db('pk_comment').insert({
      co_co_u_id:req.body.co_co_u_id,
      co_co_u_table:req.body.co_co_u_table,
      co_u_id:req.body.co_u_id,
      co_u_table:req.body.co_u_table,
      co_comment:req.body.co_comment,
    })
    res.send({ok:true,itm,alt:"success"})
  }catch(e){res.send({ok:false,txt:e.message,alt:"error"})}
})
