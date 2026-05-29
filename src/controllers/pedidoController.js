const { supabase, supabaseAdmin } = require('../config/supabase');

// Criar novo pedido
async function criarPedido(req, res) {
  try {
    const { items, endereco_entrega, metodo_pagamento, frete } = req.body;
    const usuario_id = req.user.id;
    
    let subtotal = 0;
    
    // Calcular subtotal e verificar estoque
    for (const item of items) {
      const { data: produto } = await supabase
        .from('produtos')
        .select('preco, estoque')
        .eq('id', item.produto_id)
        .single();
      
      if (!produto) {
        return res.status(404).json({ success: false, error: `Produto ${item.produto_id} não encontrado` });
      }
      
      if (produto.estoque < item.quantidade) {
        return res.status(400).json({ success: false, error: `Estoque insuficiente para produto ${item.produto_id}` });
      }
      
      item.preco_unitario = produto.preco;
      item.subtotal = produto.preco * item.quantidade;
      subtotal += item.subtotal;
    }
    
    const total = subtotal + (frete || 0);
    
    // Criar pedido
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .insert([{
        usuario_id,
        subtotal,
        frete: frete || 0,
        total,
        endereco_entrega,
        metodo_pagamento: metodo_pagamento || 'PIX',
        status: 'pendente',
        status_pagamento: 'aguardando'
      }])
      .select()
      .single();
    
    if (pedidoError) throw pedidoError;
    
    // Criar itens do pedido e atualizar estoque
    for (const item of items) {
      const { error: itemError } = await supabase
        .from('itens_pedido')
        .insert([{
          pedido_id: pedido.id,
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          preco_unitario: item.preco_unitario,
          subtotal: item.subtotal
        }]);
      
      if (itemError) throw itemError;
      
      // Atualizar estoque
      await supabase
        .from('produtos')
        .update({ estoque: supabase.raw(`estoque - ${item.quantidade}`) })
        .eq('id', item.produto_id);
    }
    
    res.status(201).json({
      success: true,
      pedido: pedido,
      message: 'Pedido criado com sucesso'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Listar pedidos do usuário
async function listarPedidos(req, res) {
  try {
    const { data: pedidos, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        itens_pedido (
          *,
          produtos (nome, imagem_url)
        )
      `)
      .eq('usuario_id', req.user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({ success: true, pedidos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Buscar pedido específico
async function buscarPedido(req, res) {
  try {
    const { id } = req.params;
    
    const { data: pedido, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        itens_pedido (
          *,
          produtos (*)
        )
      `)
      .eq('id', id)
      .eq('usuario_id', req.user.id)
      .single();
    
    if (error) throw error;
    if (!pedido) return res.status(404).json({ success: false, error: 'Pedido não encontrado' });
    
    res.json({ success: true, pedido });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Atualizar status do pedido (admin)
async function atualizarStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, status_pagamento } = req.body;
    
    const updates = {};
    if (status) updates.status = status;
    if (status_pagamento) updates.status_pagamento = status_pagamento;
    
    const { data, error } = await supabase
      .from('pedidos')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    res.json({ success: true, pedido: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  criarPedido,
  listarPedidos,
  buscarPedido,
  atualizarStatus
};