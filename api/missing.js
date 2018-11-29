const express = require('express')
const router = express.Router()

module.exports = router

router.get('/list', async (req, res) => {
  try {
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
    .orderBy("pk_missing.ms_id","desc")



      res.send({
        ok: true,
        datas: missing,
      })

    // if(accessories.length==1){
    //   res.send({
    //     ok: true,
    //     datas: accessories,
    //     type:"อุปกรณ์"
    //   })
    // }
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})

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

// router.get('/list', async (req, res) => {
//   try {
//     let machine = await req.db('pk_missing').select(
//       "pk_missing.ms_id",
//       "pk_missing.ms_u_id as ms_u_id",
//       "pk_missing.ms_u_table",
//       "pk_missing.u_id",
//       "pk_missing.ms_table",
//       "pk_missing.ms_date as ms_date",
//       "pk_missing.u_ms_date as u_ms_date",
//       "pk_missing.ms_status ms_status",
//       // "pk_machine.mc_id",
//       // "pk_machine.mc_code as ms_name",
//       // "pk_machine.mc_brand",
//       // "pk_machine.mc_series",
//       // "pk_machine.std_id",
//     )
//     // .innerJoin('pk_missing', 'pk_machine.mc_id', 'pk_missing.u_id')
//     .orderBy('pk_missing.ms_id', 'desc')
//     .count("pk_missing.ms_id as count")
//
//     let accessories = await req.db('pk_accessories').select(
//       "pk_missing.ms_id",
//       "pk_missing.ms_u_id as ms_u_id",
//       "pk_missing.ms_u_table",
//       "pk_missing.u_id",
//       "pk_missing.ms_table",
//       "pk_missing.ms_date as ms_date",
//       "pk_missing.u_ms_date as u_ms_date",
//       "pk_missing.ms_status as ms_status",
//       "pk_accessories.ac_id",
//       "pk_accessories.ac_name as ms_name",
//       "pk_accessories.ac_description",
//       "pk_accessories.ac_u_id",
//       "pk_accessories.ac_u_table",
//       "pk_accessories.t_status"
//     )
//     .innerJoin('pk_missing', 'pk_accessories.ac_id', 'pk_missing.u_id')
//     .orderBy('pk_missing.ms_id', 'desc')
//     .count("pk_missing.ms_id as count")
//
//     if(machine.length!=0){
//       res.send({
//         ok: true,
//         datas: teacher,
//       })
//     }else if(accessories.length!=0){
//       res.send({
//         ok: true,
//         datas: admin,
//       })
//     }
//   }catch(e){res.send({ok:false,txt:e.message,alt:"error"})}
// })
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
