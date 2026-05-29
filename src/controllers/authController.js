import supabase from '../config/supabase.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function register(req, res) {

  const {
    nome,
    email,
    senha,
    telefone,
    endereco
  } = req.body

  const senhaHash = await bcrypt.hash(senha, 10)

  const { data, error } = await supabase
    .from('clientes')
    .insert([
      {
        nome,
        email,
        senha: senhaHash,
        telefone,
        endereco
      }
    ])
    .select()

  if (error) {
    return res.status(500).json(error)
  }

  res.json(data)
}

export async function login(req, res) {

  const { email, senha } = req.body

  const { data: cliente, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !cliente) {
    return res.status(401).json({
      error: 'Cliente não encontrado'
    })
  }

  const senhaValida = await bcrypt.compare(
    senha,
    cliente.senha
  )

  if (!senhaValida) {
    return res.status(401).json({
      error: 'Senha inválida'
    })
  }

  const token = jwt.sign(
    {
      id: cliente.id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  )

  res.json({
    token,
    cliente
  })
}