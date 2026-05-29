require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);


// TESTE
app.get('/', (req, res) => {
  res.json({ funcionando: true });
});


// CADASTRO
app.post('/auth/registrar', async (req, res) => {

  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      erro: 'Preencha todos os campos'
    });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const { data, error } = await supabase
    .from('clientes')
    .insert([
      {
        nome,
        email,
        senha: senhaHash
      }
    ])
    .select();

  if (error) {
    return res.status(400).json({
      erro: error.message
    });
  }

  res.json(data);
});


// LOGIN
app.post('/auth/login', async (req, res) => {

  const { email, senha } = req.body;

  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    return res.status(400).json({
      erro: 'Usuário não encontrado'
    });
  }

  const senhaCorreta = await bcrypt.compare(
    senha,
    data.senha
  );

  if (!senhaCorreta) {
    return res.status(400).json({
      erro: 'Senha incorreta'
    });
  }

  const token = jwt.sign(
    {
      id: data.id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  );

  res.json({
    token,
    usuario: {
      id: data.id,
      nome: data.nome,
      email: data.email
    }
  });
});


// LISTAR PRODUTOS
app.get('/produtos', async (req, res) => {

  const { data, error } = await supabase
    .from('produtos')
    .select('*');

  if (error) {
    return res.status(400).json(error);
  }

  res.json(data);
});


// CRIAR PRODUTO
app.post('/produtos', async (req, res) => {

  const {
    nome,
    descricao,
    preco,
    imagem,
    categoria,
    estoque
  } = req.body;

  const { data, error } = await supabase
    .from('produtos')
    .insert([
      {
        nome,
        descricao,
        preco,
        imagem,
        categoria,
        estoque
      }
    ])
    .select();

  if (error) {
    return res.status(400).json(error);
  }

  res.json(data);
});


// CRIAR PEDIDO
app.post('/pedidos', async (req, res) => {

  const {
    cliente_id,
    total
  } = req.body;

  const { data, error } = await supabase
    .from('pedidos')
    .insert([
      {
        cliente_id,
        total
      }
    ])
    .select();

  if (error) {
    return res.status(400).json(error);
  }

  res.json(data);
});


module.exports = app;