import supabase from '../config/supabase.js'

export async function createOrder(req, res) {

  const {
    cliente_id,
    itens
  } = req.body

  let total = 0

  for (const item of itens) {

    const { data: produto } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', item.produto_id)
      .single()

    total += produto.preco * item.quantidade
  }

  const { data: pedido, error } = await supabase
    .from('pedidos')
    .insert([
      {
        cliente_id,
        total,
        status: 'pendente'
      }
    ])
    .select()
    .single()

  if (error) {
    return res.status(500).json(error)
  }

  for (const item of itens) {

    const { data: produto } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', item.produto_id)
      .single()

    await supabase
      .from('pedido_itens')
      .insert([
        {
          pedido_id: pedido.id,
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          preco_unitario: produto.preco
        }
      ])
  }

  res.json({
    message: 'Pedido criado',
    pedido
  })
}