// BaseDatosMongo.js
export class BaseDatosMongo {
  constructor(conection_string) {
    this.conection_string = conection_string;
    this.dbName = "productos_db";
    this.url_api = "https://dummyjson.com/products?limit=10";
  }

  async iniciar_bd() {

    if (!localStorage.getItem(this.dbName)) {

      const productos_desde_api = await this.cargarDesdeApi();

      // si la API falla por cualquier motivo, usamos un set de respaldo
      // para no dejar la app sin productos
      const productosIniciales = productos_desde_api ?? [
        { _id: 1, nombre_producto: "Laptop Gamer", precio: 1200000, cantidad: 15, estado: "Disponible" },
        { _id: 2, nombre_producto: "Teclado Mecánico", precio: 85000, cantidad: 0, estado: "Agotado" },
        { _id: 3, nombre_producto: "Monitor 4K", precio: 350000, cantidad: 8, estado: "Disponible" }
      ];

      localStorage.setItem(this.dbName, JSON.stringify(productosIniciales));
    }

    console.log(`Conectado exitosamente a: ${this.conection_string}`);
    return true;
  }

  /**
   * @description trae productos reales desde una API pública y los adapta
   * a la forma que usa el proyecto (_id, nombre_producto, precio, cantidad, estado).
   * @returns {Promise<Array|null>} el arreglo de productos, o null si la API falló.
   */
  async cargarDesdeApi() {

    try {
      const respuesta = await fetch(this.url_api);

      if (!respuesta.ok) {
        throw new Error(`la API respondió con estado ${respuesta.status}`);
      }

      const data = await respuesta.json();

      return data.products.map((p) => ({
        _id: p.id,
        nombre_producto: p.title,
        precio: Math.round(p.price * 950), // conversión aproximada a CLP, solo estética
        cantidad: p.stock,
        estado: p.stock > 0 ? "Disponible" : "Agotado"
      }));

    } catch (error) {
      console.error("No se pudo cargar productos desde la API, se usará un set de respaldo:", error);
      return null;
    }
  }

  create(producto) {
    const db = JSON.parse(localStorage.getItem(this.dbName)) || [];
    db.push(producto);
    localStorage.setItem(this.dbName, JSON.stringify(db));
  }

  read() {

    return localStorage.getItem(this.dbName) || "[]";
  }

  update(id, productoActualizado) {
    let db = JSON.parse(localStorage.getItem(this.dbName)) || [];
    db = db.map(p => p._id === id ? { ...p, ...productoActualizado } : p);
    localStorage.setItem(this.dbName, JSON.stringify(db));
  }

  delete(id) {
    let db = JSON.parse(localStorage.getItem(this.dbName)) || [];
    db = db.filter(p => p._id !== id);
    localStorage.setItem(this.dbName, JSON.stringify(db));
  }
}