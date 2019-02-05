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
    let rows=await db("pk_missing").select("*")
    for(let i=1;i<=12;i++){
      var sp=rows[i].ms_date.split("-")
      let sel=sp[1]
      if()

      console.log(sel)
    }


    // let itm=await db('pk_missing').select("*")
    //
    // res.send({
    //   ok:true,
    //   datas:itm
    // })
  }catch(e){res.send({
    ok:false,
    error:e.message
  })}
})
