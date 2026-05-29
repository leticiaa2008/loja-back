const supabase = require('../config/supabase');

// Criar Pedido Completo (Tabela Pedidos + Tabela Itens_Pedido)
exports.criarPedido = async (req, res) => {
    const { cliente_id, total, itens } = req.body; // 'itens' esperado como array: [{ produto_id, quantidade, preco_unitario }]

    if (!cliente_id || !total || !itens || itens.length === 0) {
        return res.status(400).json({ error: "Dados do pedido inválidos." });
    }

    try {
        // 1. Cria a cabeceira do pedido
        const { data: pedido, error: erroPedido } = await supabase
            .from('pedidos')
            .insert([{ cliente_id, total: parseFloat(total), status: 'Pendente' }])
            .select().single();

        if (erroPedido) return res.status(400).json({ error: erroPedido.message });

        // 2. Mapeia os produtos vinculando-os ao ID do pedido gerado
        const itensFormatados = itens.map(item => ({
            pedido_id: pedido.id,
            produto_id: item.produto_id,
            quantidade: item.quantidade,
            preco_unitario: parseFloat(item.preco_unitario)
        }));

        // 3. Insere todos os itens na tabela relacional
        const { error: erroItens } = await supabase.from('itens_pedido').insert(itensFormatados);
        if (erroItens) return res.status(400).json({ error: erroItens.message });

        return res.status(201).json({ message: "Pedido registado com sucesso!", pedido_id: pedido.id });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Histórico de pedidos do cliente
exports.listarPedidosCliente = async (req, res) => {
    const { clienteId } = req.params;

    try {
        const { data, error } = await supabase
            .from('pedidos')
            .select(`
                id, total, status, created_at,
                itens_pedido ( id, quantidade, preco_unitario, produtos ( nome, imagem_url ) )
            `)
            .eq('cliente_id', clienteId);

        if (error) return res.status(400).json({ error: error.message });
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};