import express from 'express'
import playerRouter from './routes/playerRoutes.js'
import fightRouter from './routes/fightRoutes.js'
import questRouter from './routes/questRouter.js'

import { playerServicesInstance } from './service/playerServices.js'

const app = express()
const allowedOrigins = ['http://localhost:5173',
    'https://questage.netlify.app'
];


import cors from 'cors';
const options: cors.CorsOptions = {
    origin: allowedOrigins,
    credentials: true
}

app.use(cors(options));
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/player', playerRouter)
app.use('/fight', fightRouter)
app.use('/quest', questRouter)  


export default app