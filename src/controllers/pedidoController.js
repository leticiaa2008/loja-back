const supabase = require('../config/supabase');

exports.criarPedido = async (req, res) => {

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
};