import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express()
app.get('/hello', (req, res) => {
  res.json({ message: 'Olá!' })
})


app.use(cors())
app.use(helmet())