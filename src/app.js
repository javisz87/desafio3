import express from 'express';
import ProductManager from './ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);


const productManager = new ProductManager(path.join(dirname, 'productos.json'));

app.use(express.urlencoded({ extended: true }));


app.get('/products', async (req, res) => {
  const products = await productManager.getProducts();

  const { limit } = req.query; 
  if (limit) {
    const productsFiltered = products.slice(0, limit); 
    res.send(productsFiltered);
    return;
  }
  res.send(products);
});



app.get('/products/:pid', async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);
  res.send(product);
});

app.listen(8080, () => console.log('Listening on 8080'));
