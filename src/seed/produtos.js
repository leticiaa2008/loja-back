const supabase = require('../config/supabase');

const produtos = [
  {
    nome: "Camisa CSS - Azul",
    preco: 59.90,
    preco_original: 89.90,
    descricao: "Camisa estampada com logo CSS, tecido 100% algodão",
    imagem_url: "assets/images/products/camiseta-css.png",
    categoria: "Camisetas",
    slug: "camisa-css-azul",
    tags: ["camiseta", "css", "programacao"],
    destaque: true
  },
  {
    nome: "Camisa Node JS - Preta",
    preco: 59.99,
    preco_original: 89.99,
    descricao: "Camisa estampada com logo Node.js, tecido premium",
    imagem_url: "assets/images/products/camiseta-html.png",
    categoria: "Camisetas",
    slug: "camisa-node-js-preta",
    tags: ["camiseta", "node", "javascript"],
    destaque: true
  },
  {
    nome: "Boné B7Web - Preto",
    preco: 49.99,
    preco_original: 79.99,
    descricao: "Boné exclusivo B7Web, ajustável, qualidade premium",
    imagem_url: "assets/images/products/bone-b7-azul.png",
    categoria: "Acessórios",
    slug: "bone-b7web-preto",
    tags: ["bone", "acessorio", "b7web"],
    destaque: true
  },
  {
    nome: "Camisa React JS - Vermelha",
    preco: 69.90,
    preco_original: 99.90,
    descricao: "Camisa estampada React JS, estilo moderno",
    imagem_url: "assets/images/products/camiseta-css.png",
    categoria: "Camisetas",
    slug: "camisa-react-js-vermelha",
    tags: ["camiseta", "react", "javascript"],
    destaque: false
  },
  {
    nome: "Kit B7Web Completo",
    preco: 199.90,
    preco_original: 299.90,
    descricao: "Kit completo: Camiseta + Boné + Caneca B7Web",
    imagem_url: "assets/images/products/camiseta-css.png",
    categoria: "Kits B7Web",
    slug: "kit-b7web-completo",
    tags: ["kit", "b7web", "promocao"],
    destaque: true
  },
  {
    nome: "Mouse Gamer RGB",
    preco: 89.90,
    preco_original: 149.90,
    descricao: "Mouse gamer com 7 botões, RGB, 6400 DPI",
    imagem_url: "assets/images/products/camiseta-css.png",
    categoria: "Eletrônicos",
    slug: "mouse-gamer-rgb",
    tags: ["mouse", "gamer", "eletronicos"],
    destaque: false
  }
];

async function seedProdutos() {
  console.log('🌱 Inserindo produtos...');
  
  for (const produto of produtos) {
    const { data, error } = await supabase
      .from('produtos')
      .upsert(produto, { onConflict: 'slug' })
      .select();
    
    if (error) {
      console.error(`Erro ao inserir ${produto.nome}:`, error.message);
    } else {
      console.log(`✅ Inserido: ${produto.nome}`);
    }
  }
  
  console.log('🎉 Seed concluído!');
}

// Executar se rodar direto
if (require.main === module) {
  require('dotenv').config();
  seedProdutos();
}

module.exports = seedProdutos;