import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`)
})