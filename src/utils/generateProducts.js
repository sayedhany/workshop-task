import { faker } from "@faker-js/faker";

// utils/generateProducts.js
export const generateProducts = () => {
  const categories = ["Electronics", "Clothing", "Home", "Books", "Sports", "Beauty"];
  const products = [];
  for (let i = 1; i <= 10000; i++) {
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
  return products;
};
