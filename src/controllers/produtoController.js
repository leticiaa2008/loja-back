const { supabase } = require('../config/supabase');

// Listar todos os produtos
async function listarProdutos(req, res) {
  try {
    let query = supabase.from('produtos').select('*');
    
    // Filtros
    if (req.query.categoria) {
      query = query.eq('categoria', req.query.categoria);
    }
    
    if (req.query.destaque === 'true') {
      query = query.eq('destaque', true);
    }
    
    if (req.query.busca) {
      query = query.ilike('nome', `%${req.query.busca}%`);
    }
    
    // Ordenação
    if (req.query.ordenar) {
      switch (req.query.ordenar) {
        case 'preco_menor':
          query = query.order('preco', { ascending: true });
          break;
        case 'preco_maior':
          query = query.order('preco', { ascending: false });
          break;
        case 'nome':
          query = query.order('nome', { ascending: true });
          break;
        default:
          query = query.order('id', { ascending: false });
      }
    } else {
      query = query.order('id', { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json({ success: true, produtos: data, total: data.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Buscar produto por ID ou slug
async function buscarProduto(req, res) {
  try {
    const { id } = req.params;
    let query = supabase.from('produtos').select('*');
    
    if (isNaN(id)) {
      query = query.eq('slug', id);
    } else {
      query = query.eq('id', parseInt(id));
    }
    
    const { data, error } = await query.single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Produto não encontrado' });
    
    res.json({ success: true, produto: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Criar produto (admin)
async function criarProduto(req, res) {
  try {
    const { nome, preco, preco_original, descricao, imagem_url, categoria, slug, tags, estoque, destaque } = req.body;
    
    const { data, error } = await supabase
      .from('produtos')
      .insert([{
        nome,
        preco,
        preco_original,
        descricao,
        imagem_url,
        categoria,
        slug,
        tags,
        estoque,
        destaque
      }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json({ success: true, produto: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Atualizar produto
async function atualizarProduto(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updated_at = new Date();
    
    const { data, error } = await supabase
      .from('produtos')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    res.json({ success: true, produto: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Deletar produto
async function deletarProduto(req, res) {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ success: true, message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Buscar produtos em destaque
async function produtosDestaque(req, res) {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('destaque', true)
      .limit(8);
    
    if (error) throw error;
    
    res.json({ success: true, produtos: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  listarProdutos,
  buscarProduto,
  criarProduto,
  atualizarProduto,
  deletarProduto,
  produtosDestaque
};