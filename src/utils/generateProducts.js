import { faker } from "@faker-js/faker";

// utils/generateProducts.js
let cachedProducts = null;

export const generateProducts = (num) => {
  if (cachedProducts) return cachedProducts;

  const categories = ["Electronics", "Clothing", "Home", "Books", "Sports", "Beauty"];
  const products = [];
  for (let i = 1; i <= num; i++) {
    products.push({
      id: i,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      image: `https://picsum.photos/seed/${i}/400/300`,
      category: categories[Math.floor(Math.random() * categories.length)],
      rating: Math.floor(Math.random() * 5) + 1,
      stock: Math.floor(Math.random() * 100) + 1,
    });
  }
  cachedProducts = products;
  return products;
};
