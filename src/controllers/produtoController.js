const supabase = require('../config/supabase');

exports.listarProdutos = async (req, res) => {

    const { data, error } = await supabase
        .from('produtos')
        .select('*');

    if (error) {
        return res.status(400).json(error);
    }

    res.json(data);
};

exports.criarProduto = async (req, res) => {

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
};