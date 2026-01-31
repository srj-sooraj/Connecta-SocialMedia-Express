import express from 'express'
import env from 'dotenv'
import connection from './connection.js'
import routes from './routes/router.js'
env.config()
const app = express()

app.use(express.json())
app.use(express.static('../frontend'))
app.use('/api',routes) //http://localhost:3000/api

connection()
    .then(()=>{
        app.listen(process.env.PORT,()=>{
            console.log(`Server started at http://localhost:${process.env.PORT}`);
            
        })
    })
