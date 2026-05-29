const { supabase, supabaseAdmin } = require('../config/supabase');

// Registro de novo usuário
async function register(req, res) {
  try {
    const { email, password, nome, cpf, telefone } = req.body;
    
    // 1. Criar usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (authError) throw authError;
    
    // 2. Criar perfil do usuário
    const { error: profileError } = await supabaseAdmin
      .from('perfis')
      .insert([{
        id: authData.user.id,
        nome,
        cpf,
        telefone
      }]);
    
    if (profileError) throw profileError;
    
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      user: authData.user
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

// Login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Buscar perfil do usuário
    const { data: perfil } = await supabase
      .from('perfis')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    res.json({
      success: true,
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        ...perfil
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
}

// Logout
async function logout(req, res) {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    res.json({ success: true, message: 'Logout realizado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Buscar perfil do usuário logado
async function getMe(req, res) {
  try {
    const { data: perfil, error } = await supabase
      .from('perfis')
      .select('*')
      .eq('id', req.user.id)
      .single();
    
    if (error) throw error;
    
    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        ...perfil
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { register, login, logout, getMe };