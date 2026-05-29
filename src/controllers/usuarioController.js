const { supabase, supabaseAdmin } = require('../config/supabase');

// Atualizar perfil do usuário
async function atualizarPerfil(req, res) {
  try {
    const { nome, cpf, telefone, endereco, cidade, estado, cep } = req.body;
    const usuario_id = req.user.id;
    
    const { data, error } = await supabase
      .from('perfis')
      .update({
        nome,
        cpf,
        telefone,
        endereco,
        cidade,
        estado,
        cep,
        updated_at: new Date()
      })
      .eq('id', usuario_id)
      .select();
    
    if (error) throw error;
    
    res.json({ success: true, perfil: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Listar favoritos do usuário
async function listarFavoritos(req, res) {
  try {
    const { data, error } = await supabase
      .from('favoritos')
      .select(`
        *,
        produtos (*)
      `)
      .eq('usuario_id', req.user.id);
    
    if (error) throw error;
    
    res.json({ success: true, favoritos: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Adicionar aos favoritos
async function adicionarFavorito(req, res) {
  try {
    const { produto_id } = req.body;
    
    const { data, error } = await supabase
      .from('favoritos')
      .insert([{
        usuario_id: req.user.id,
        produto_id
      }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json({ success: true, favorito: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Remover dos favoritos
async function removerFavorito(req, res) {
  try {
    const { produto_id } = req.params;
    
    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('usuario_id', req.user.id)
      .eq('produto_id', produto_id);
    
    if (error) throw error;
    
    res.json({ success: true, message: 'Removido dos favoritos' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  atualizarPerfil,
  listarFavoritos,
  adicionarFavorito,
  removerFavorito
};