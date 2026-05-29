const supabase = require('../config/supabase');

// Listar todos os produtos (Vitrine)
exports.listarProdutos = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) return res.status(400).json({ error: error.message });
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Cadastrar novo produto
exports.cadastrarProduto = async (req, res) => {
    const { nome, preco, descricao, imagem_url } = req.body;
    if (!nome || !preco) return res.status(400).json({ error: "Nome e preço são obrigatórios." });

    try {
        const { data, error } = await supabase
            .from('produtos')
            .insert([{ nome, preco: parseFloat(preco), descricao, imagem_url }])
            .select();

        if (error) return res.status(400).json({ error: error.message });
        return res.status(201).json({ message: "Produto cadastrado!", produto: data[0] });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};