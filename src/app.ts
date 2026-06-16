import express from 'express'
import playerRouter from './routes/playerRoutes.js'
import fightRouter from './routes/fightRoutes.js'
import questRouter from './routes/questRouter.js'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/player', playerRouter)
app.use('/fight', fightRouter)
app.use('/quest', questRouter)


export default app