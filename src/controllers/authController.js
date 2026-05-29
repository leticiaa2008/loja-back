const bcrypt = require('bcryptjs');

const supabase = require('../config/supabase');
const gerarToken = require('../utils/gerarToken');

exports.registrar = async (req, res) => {

    try {

        const { nome, email, senha } = req.body;

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
            return res.status(400).json(error);
        }

        res.json(data);

    } catch (err) {

        res.status(500).json({
            erro: err.message
        });

    }

};

exports.login = async (req, res) => {

    try {

        const { email, senha } = req.body;

        const { data } = await supabase
            .from('clientes')
            .select('*')
            .eq('email', email)
            .single();

        if (!data) {
            return res.status(400).json({
                erro: 'Usuário não encontrado'
            });
        }

        const senhaOk = await bcrypt.compare(
            senha,
            data.senha
        );

        if (!senhaOk) {
            return res.status(400).json({
                erro: 'Senha inválida'
            });
        }

        const token = gerarToken(data.id);

        res.json({
            token,
            usuario: data
        });

    } catch (err) {

        res.status(500).json({
            erro: err.message
        });

    }

};