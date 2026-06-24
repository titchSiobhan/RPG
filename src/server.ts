import app from './app.js'
import config from './config/config.js'
import  { Request } from 'express';




app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})