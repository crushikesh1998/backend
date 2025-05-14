import connectDB from "./db/db.js";
import app from "./app.js";
import dotenv from 'dotenv'

dotenv.config({
    path : './env'
})

connectDB()
.then(()=>{
    app.on('error',(err)=>{
        console.log('ERROR ',err);
        throw err
    })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running on port :${process.env.PORT || 8000}`)
    })
})
.catch((err)=>{
console.log('Mongo db  connection failed!',err);
throw err;
})
