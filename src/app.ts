import express from 'express'
import playerRouter from './routes/playerRoutes.js'
import fightRouter from './routes/fightRoutes.js'
import questRouter from './routes/questRouter.js'
import shopRouter from './routes/shopRoutes.js'

import { playerServicesInstance } from './service/playerServices.js'

const app = express()
const allowedOrigins = ['http://localhost:5173',
    'https://questage.netlify.app'
];


import cors from 'cors';
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow mobile apps / curl
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);


app.use(express.json())


app.get('/api/ping', (req, res) => {
    res.json({ ok: true });
});


app.use('/player', playerRouter)
app.use('/fight', fightRouter)
app.use('/quest', questRouter)
app.use('/shop', shopRouter)


export default app