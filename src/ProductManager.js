import fs from 'fs';

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.count = 0;
  }
  async getProducts() {
    if (this.fileExists(this.path)) {
      try {
        let products = await fs.promises.readFile(this.path, 'utf-8');
        return products.length > 0 ? JSON.parse(products) : [];
      } catch (error) {
        console.log(error);
        return [];
      }
    } else {
      console.log('El archivo que estas buscando no existe.');
    }
  }

  async addProduct(prod) {
    if (this.fileExists(this.path)) {
      try {
        for (const property in prod) {
          if (prod[property] === '') {
            throw Error(`Campo ${property} vacio`);
          }
        }

        let products = await this.getProducts();

        const codeExists = products.some(
          (product) => prod.code === product.code
        );

        if (codeExists) {
          throw Error('El code de ese producto ya existe');
        }
        if (products.length > 0) {
          let newId = (await products[products.length - 1].id) + 1;
          prod.id = newId;
        } else {
          prod.id = 1;
        }

        products.push(prod);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, 2)
        );
        return prod.id;
      } catch (error) {
        console.log(error);
        console.log('Error al guardar el producto');
      }
    } else {
      try {
        let products = [];
        prod.id = 1;
        products.push(prod);
        fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return prod.id;
      } catch (error) {
        console.log('Error al crear el archivo y guardar el producto');
      }
    }
  }

  async getProductById(id) {
    try {
      if (this.fileExists(this.path)) {
        let products = await this.getProducts();
        let prod = products.find((item) => item.id == id);
        if (prod !== undefined) {
          return prod;
        }
        throw Error('Not Found');
      } else {
        throw Error('Not Found');
        return id;
      }
    } catch (error) {
      console.log(`Error al obtener el producto con el id: ${id} `);

      console.error(error);
      return { msg: 'El producto que buscas no existe.' };
    }
  }

  async deleteById(id) {
    if (this.fileExists(this.path)) {
      try {
        let products = await this.getProducts();

        const productExists = products.some((item) => item.id === id);
        if (productExists) {
          let newProducts = products.filter((item) => item.id !== id);
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(newProducts, null, 2)
          );
          console.log(`Producto ${id} eliminado.`);
          return id;
        }
        console.log(productExists);
        throw Error(`El producto con el id ${id} no existe.`);
      } catch (error) {
        console.log('Error al borrar el producto');
        console.error(error);
        return id;
      }
    }
    console.log('No existe un archivo donde buscar.');
    return id;
  }

  async updateProduct(id, data) {
    if (this.fileExists(this.path)) {
      try {
        let products = await this.getProducts();
        let prodIndex = products.findIndex((item) => item.id === id);

        if (prodIndex !== -1) {
          products[prodIndex] = {
            title: data.title,
            description: data.description,
            price: data.price,
            thumbnail: data.thumbnail,
            code: data.code,
            stock: data.stock,
            id: id,
          };

          let update = products[prodIndex];
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(products, null, 2)
          );
          return update;
        }
        throw Error('Not Found');
      } catch (error) {
        console.log(`Error al actualizar el producto con el id: ${id}`);
        console.error(error);
        return id;
      }
    }
    console.log('No existe un archivo donde buscar.');
    return id;
  }


  fileExists(path) {
    try {
      return fs.statSync(path).isFile();
    } catch (err) {
      return false;
    }
  }
}

export default ProductManager;

// const instance = new ProductManager('products.txt');

// (async () => {
//   let products = await instance.getProducts();
//   console.log('products :>> ', products);
//   let product = await instance.addProduct({
//     title: 'producto prueba',
//     description: 'Este es un producto prueba',
//     price: 200,
//     thumbnail: 'Sin imagen',
//     code: 'ac12',
//     stock: 25,
//   });
//   console.log('product', product);

//   let deleted = await instance.deleteById(3);
//   console.log(deleted);
//   console.log('products :>> ', products);

//   console.log('getProductById(1)', await instance.getProductById(4));
//   let update = await instance.updateProduct(3, {
//     title: 'producto prueba',
//     description: 'Este es un producto prueba',
//     price: 200,
//     thumbnail: 'Sin imagen',
//     code: 'ac12',
//     stock: 25,
//   });

//   console.log(update);
// })();
