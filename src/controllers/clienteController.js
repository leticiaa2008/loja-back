const supabase = require('../config/supabase');

// Cadastro de novos Clientes
exports.cadastrarCliente = async (req, res) => {
    const { nome, email, password, telefone } = req.body;
    if (!nome || !email || !password) return res.status(400).json({ error: "Campos obrigatórios em falta." });

    try {
        const { data, error } = await supabase
            .from('clientes')
            .insert([{ nome, email, senha: password, telefone }])
            .select();

        if (error) return res.status(400).json({ error: "E-mail já cadastrado ou erro no banco: " + error.message });
        return res.status(201).json({ message: "Cadastro realizado!", cliente: data[0] });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Login de Clientes
exports.loginCliente = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .eq('email', email)
            .eq('senha', password)
            .single();

        if (error || !data) return res.status(401).json({ error: "E-mail ou senha incorretos." });

        return res.json({ 
            message: "Login efetuado!", 
            user: { id: data.id, nome: data.nome, email: data.email } 
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};