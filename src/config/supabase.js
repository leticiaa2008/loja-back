const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("ERRO: Configura as variáveis SUPABASE_URL e SUPABASE_KEY no .env.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;