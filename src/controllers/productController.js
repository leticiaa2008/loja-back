import supabase from '../config/supabase.js'

export async function getProducts(req, res) {

  const { data, error } = await supabase
    .from('produtos')
    .select('*')

  if (error) {
    return res.status(500).json(error)
  }

  res.json(data)
}

export async function createProduct(req, res) {

  const {
    nome,
    descricao,
    preco,
    estoque,
    imagem,
    categoria
  } = req.body

  const { data, error } = await supabase
    .from('produtos')
    .insert([
      {
        nome,
        descricao,
        preco,
        estoque,
        imagem,
        categoria
      }
    ])
    .select()

  if (error) {
    return res.status(500).json(error)
  }

  res.json(data)
}