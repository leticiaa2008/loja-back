const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Configuração Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ============================================
// CONTROLLERS SIMPLIFICADOS (inline para Vercel)
// ============================================

// Auth Controllers
async function register(req, res) {
  try {
    const { email, password, nome } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    
    if (data.user) {
      await supabase.from('perfis').insert([{ id: data.user.id, nome }]);
    }
    
    res.status(201).json({ success: true, user: data.user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    res.json({ 
      success: true, 
      token: data.session.access_token,
      user: data.user
    });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
}

// Middleware de autenticação
async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Token não fornecido' });
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ success: false, error: 'Token inválido' });
  }
  
  req.user = user;
  next();
}

// Produtos Controllers
async function listarProdutos(req, res) {
  try {
    let query = supabase.from('produtos').select('*');
    
    if (req.query.categoria) {
      query = query.eq('categoria', req.query.categoria);
    }
    if (req.query.destaque === 'true') {
      query = query.eq('destaque', true);
    }
    if (req.query.busca) {
      query = query.ilike('nome', `%${req.query.busca}%`);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    res.json({ success: true, produtos: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function buscarProduto(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', parseInt(id))
      .single();
    
    if (error) throw error;
    res.json({ success: true, produto: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function criarProduto(req, res) {
  try {
    const produto = req.body;
    const { data, error } = await supabase.from('produtos').insert([produto]).select();
    if (error) throw error;
    res.status(201).json({ success: true, produto: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function atualizarProduto(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('produtos')
      .update(updates)
      .eq('id', parseInt(id))
      .select();
    if (error) throw error;
    res.json({ success: true, produto: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function deletarProduto(req, res) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('produtos').delete().eq('id', parseInt(id));
    if (error) throw error;
    res.json({ success: true, message: 'Produto deletado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Pedidos Controllers
async function criarPedido(req, res) {
  try {
    const { items, endereco_entrega, total } = req.body;
    const usuario_id = req.user.id;
    
    const { data: pedido, error } = await supabase
      .from('pedidos')
      .insert([{ usuario_id, endereco_entrega, total, subtotal: total }])
      .select()
      .single();
    
    if (error) throw error;
    
    for (const item of items) {
      await supabase.from('itens_pedido').insert([{
        pedido_id: pedido.id,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco,
        subtotal: item.preco * item.quantidade
      }]);
    }
    
    res.status(201).json({ success: true, pedido });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function listarPedidos(req, res) {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*, itens_pedido(*, produtos(*))')
      .eq('usuario_id', req.user.id);
    
    if (error) throw error;
    res.json({ success: true, pedidos: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// ============================================
// ROTAS
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Auth routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Produtos routes (públicas)
app.get('/api/produtos', listarProdutos);
app.get('/api/produtos/:id', buscarProduto);

// Rotas protegidas
app.post('/api/produtos', authMiddleware, criarProduto);
app.put('/api/produtos/:id', authMiddleware, atualizarProduto);
app.delete('/api/produtos/:id', authMiddleware, deletarProduto);

// Pedidos routes
app.post('/api/pedidos', authMiddleware, criarPedido);
app.get('/api/pedidos', authMiddleware, listarPedidos);

// Rota catch-all para 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Rota não encontrada' });
});

// Export para Vercel
module.exports = app;