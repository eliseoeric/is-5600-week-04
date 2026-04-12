// data.js
let products = [
  { id: 1, name: 'Canvas Print - 8x10', price: 29.99, description: 'High-quality canvas print', category: 'canvas' },
  { id: 2, name: 'Framed Poster - 12x18', price: 45.99, description: 'Poster with a sleek black frame', category: 'framed' },
  { id: 3, name: 'Mug with Custom Print', price: 12.99, description: 'Ceramic mug, dishwasher safe', category: 'mugs' },
];

const getNextId = () => {
  if (products.length === 0) return 1;
  const maxId = Math.max(...products.map(p => p.id));
  return maxId + 1;
};

module.exports = { products, getNextId };