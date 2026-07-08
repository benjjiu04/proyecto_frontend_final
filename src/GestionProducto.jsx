//importacion de componentes.
import { BaseDatosMongo } from "../src/components/mongoDB/BaseDatosMongo.jsx";
import { Filtro } from "../src/components/Filtro.jsx";
import { ColumnaProducto } from "../src/components/ColumnaProducto.jsx";
import { BotonReact } from "./components/BotonReact.jsx";
import { TerminosYCondiciones } from "./components/TerminosYCondiciones.jsx";
import { LoginPage } from "./components/LoginPage.jsx";
import { ManualUsuario } from "./components/ManualUsuario.jsx";

//importacion de librerias NECESARIAS.
import React, { useState, useEffect } from 'react';
import { Link, BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";

import diagramaClasesFrontEnd from "./assets/diagrama de clases front end.drawio.png";

export { GestionProducto };

/* Creación de una instancia de la clase BaseDatosMongo. 
Simula una conexion hacia una base de datos.*/
const mongoDB = new BaseDatosMongo("mongodb://localhost:27017/empresa_ficticia");

function GestionProducto(){
  
  // Estado para controlar si el usuario pasó por el Login
  const [sesionActiva, setSesionActiva] = useState(false);

  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados de los filtros individuales
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCantidad, setFiltroCantidad] = useState("");
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState("Todos");

  // Formulario para añadir nuevos productos (Método Create)
  const [nuevoProd, setNuevoProd] = useState({ nombre_producto: "", precio: "", cantidad: "", estado: "Disponible" });

  // Estado para controlar qué producto se está editando (Método Update completo)
  const [productoEnEdicion, setProductoEnEdicion] = useState(null);

  const [terminos_aceptados, set_terminos_aceptados] = useState(() => localStorage.getItem("terminos_aceptados"));

  // Verificar si ya había una sesión guardada al abrir la página
  useEffect(() => {
    const usuario = localStorage.getItem("sesion_activa");
    if (usuario) {
      setSesionActiva(true);
    }
  }, []);

  // Iniciar BD solo CUANDO la sesión esté activa
  useEffect(() => {
    if (!sesionActiva) return; 
    
    const conectar = async () => {
      await mongoDB.iniciar_bd();
      refrescarLista();
    };
    conectar();
  }, [sesionActiva]); 

  // Aplicar filtros combinados cada vez que cambia la lista o los inputs
  useEffect(() => {
    let resultado = [...productos];

    if (filtroNombre) {
      resultado = resultado.filter(p => p.nombre_producto.toLowerCase().includes(filtroNombre.toLowerCase()));
    }
    if (filtroCantidad) {
      resultado = resultado.filter(p => p.cantidad >= parseInt(filtroCantidad, 10));
    }
    if (filtroDisponibilidad !== "Todos") {
      resultado = resultado.filter(p => p.estado === filtroDisponibilidad);
    }

    setProductosFiltrados(resultado);
  }, [productos, filtroNombre, filtroCantidad, filtroDisponibilidad]);

  if (!terminos_aceptados){
    /* si detecta que los terminos no han sido aceptados, lo lleva a la pagina. 
     y si han sido aceptados el estado cambia a true.*/
    return <TerminosYCondiciones on_aceptar = {() => {set_terminos_aceptados(true)}} />;
  }

  const refrescarLista = () => {
    const dataString = mongoDB.read();
    const data = JSON.parse(dataString);

    setProductos(data);
    setCargando(false);
  };

  // Métodos del modelo Producto reflejados en el Handler de la página
  const handleActualizarCantidad = (id, nuevaCantidad) => {
    const prod = productos.find(p => p._id === id);
    const nuevoEstado = nuevaCantidad > 0 ? prod.estado : "Agotado";
    mongoDB.update(id, { cantidad: nuevaCantidad, estado: nuevoEstado });
    refrescarLista();
  };

  const handleCambiarEstado = (id, nuevoEstado) => {
    mongoDB.update(id, { estado: nuevoEstado });
    refrescarLista();
  };

  const handleBorrarProducto = (id) => {
    // Si borramos el producto que se estaba editando, limpiamos el formulario
    if (productoEnEdicion && productoEnEdicion._id === id) {
      setProductoEnEdicion(null);
      setNuevoProd({ nombre_producto: "", precio: "", cantidad: "", estado: "Disponible" });
    }
    mongoDB.delete(id);
    refrescarLista();
  };

  // Carga los datos de la fila de la tabla en el formulario lateral
  const handleIniciarEdicion = (producto) => {
    setProductoEnEdicion(producto);
    setNuevoProd({
      nombre_producto: producto.nombre_producto,
      precio: producto.precio,
      cantidad: producto.cantidad,
      estado: producto.estado
    });
  };

  // Maneja de forma unificada el envío (tanto para Crear como para Modificar por completo)
  const handleCrearProducto = (e) => {
    e.preventDefault();
    if (!nuevoProd.nombre_producto || !nuevoProd.precio) return;

    if (productoEnEdicion) {
      // === MODO EDICIÓN (UPDATE) ===
      const productoActualizado = {
        nombre_producto: nuevoProd.nombre_producto,
        precio: Number(nuevoProd.precio),
        cantidad: Number(nuevoProd.cantidad || 0),
        estado: Number(nuevoProd.cantidad) > 0 ? nuevoProd.estado : "Agotado"
      };

      mongoDB.update(productoEnEdicion._id, productoActualizado);
      setProductoEnEdicion(null); // Desactivar modo edición
    } else {
      // === MODO CREACIÓN (CREATE) ===
      const productoFinal = {
        _id: Date.now(), 
        nombre_producto: nuevoProd.nombre_producto,
        precio: Number(nuevoProd.precio),
        cantidad: Number(nuevoProd.cantidad || 0), // Corregido 'text' por 'cantidad' 🛠️
        estado: Number(nuevoProd.cantidad) > 0 ? nuevoProd.estado : "Agotado"
      };

      mongoDB.create(productoFinal);
    }

    // Resetear formulario lateral y refrescar la vista
    setNuevoProd({ nombre_producto: "", precio: "", cantidad: "", estado: "Disponible" });
    refrescarLista();
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("sesion_activa");
    setSesionActiva(false);
  };

  // 1. SI NO HAY SESIÓN: Bloqueamos la pantalla con el Login
  if (!sesionActiva) {
    return <LoginPage onLoginSuccess={() => setSesionActiva(true)} />;
  }

  // 2. SI HAY SESIÓN PERO LA BD ESTÁ CARGANDO: muestra el loading
  if (cargando) {
    return <div className="loading">Conectandose a la Base de Datos...</div>;
  }

  // 3. SI PASÓ AMBAS: renderizado general
  return (
    <BrowserRouter>
      <PanelConRutas
        endpoint = {mongoDB.conection_string}
        productosFiltrados = {productosFiltrados}
        nuevoProd = {nuevoProd}
        setNuevoProd = {setNuevoProd}
        productoEnEdicion = {productoEnEdicion}
        setProductoEnEdicion = {setProductoEnEdicion}
        handleCrearProducto = {handleCrearProducto}
        handleIniciarEdicion = {handleIniciarEdicion}
        handleLogout ={handleLogout}
        filtroNombre = {filtroNombre}
        filtroCantidad = {filtroCantidad}
        filtroDisponibilidad = {filtroDisponibilidad}
        setFiltroNombre = {setFiltroNombre}
        setFiltroCantidad = {setFiltroCantidad}
        setFiltroDisponibilidad = {setFiltroDisponibilidad}
        handleActualizarCantidad = {handleActualizarCantidad}
        handleCambiarEstado = {handleCambiarEstado}
        handleBorrarProducto = {handleBorrarProducto}
      />
    </BrowserRouter>
  );
}


//gestiona transiciones y el ruteo interno entre las paginas

function PanelConRutas(props){

  const navigate = useNavigate();
  const location = useLocation();

  const [saliendo, setSaliendo] = useState(false);
  const [destino, setDestino] = useState(null);

  const irA = (ruta) => (evento) => {
    evento.preventDefault(); 
    if (ruta === location.pathname) return; 
    setDestino(ruta);
    setSaliendo(true);
  };

  const alTerminarSalida = () => {
    setSaliendo(false);
    navigate(destino);
  };

  return (
    <>
      <nav>
        <Link to="/" className="nav_links" onClick={irA("/")}>Panel de gestión</Link>
        {" | "}
        <Link to="/manual" className="nav_links" onClick={irA("/manual")}>Manual de usuario</Link>
      </nav>

      <Routes>
        <Route path="/" element={
          <div
            className={`gestion-container ${saliendo ? "pagina-saliendo" : ""}`}
            onAnimationEnd={saliendo ? alTerminarSalida : undefined}
          >
            {/* encabezado */}
            <header className = "gestion-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1> Sistema de Gestión de Productos</h1>
                <p> Endpoint: <code>{props.endpoint}</code></p>
              </div>

              <BotonReact
                texto = "Cerrar Sesión"
                color = "#e74c3c"
                classname = "btn-logout"
                onclick = {props.handleLogout}
              />
            </header>

            <div className="gestion-content">

              <aside className="panel-lateral">
                <form onSubmit={props.handleCrearProducto} className="form-producto">
                  <h3>{props.productoEnEdicion ? "Modificar Producto" : "Añadir Producto"}</h3>
                  <div className="form-group">
                    <label> Nombre: </label>
                    <input
                      type = "text"
                      value = {props.nuevoProd.nombre_producto}
                      onChange = {e => props.setNuevoProd({ ...props.nuevoProd, nombre_producto: e.target.value })}
                      required
                    />
                  </div>
                  <div className = "form-group">
                    <label> Precio:</label>
                    <input
                      type = "number"
                      value = {props.nuevoProd.precio}
                      onChange = {e => props.setNuevoProd({ ...props.nuevoProd, precio: e.target.value })}
                      required
                    />
                  </div>
                  <div className = "form-group">
                    <label> Cantidad:</label>
                    <input
                      type = "number"
                      value = {props.nuevoProd.cantidad}
                      onChange = {e => props.setNuevoProd({ ...props.nuevoProd, cantidad: e.target.value })}
                    />
                  </div>
                  
                  <BotonReact
                    texto = {props.productoEnEdicion ? "Guardar Cambios" : "Guardar en Base de Datos"}
                    color = {props.productoEnEdicion ? "#27ae60" : "#2c3e50"}
                    classname = "btn-block"
                  />

                  {props.productoEnEdicion && (
                    <button 
                      type = "button" 
                      className = "button is-small is-light" 
                      style = {{ marginTop: "10px", width: "100%", padding: "5px", cursor: "pointer" }}
                      onClick = {() => {
                        props.setProductoEnEdicion(null);
                        props.setNuevoProd({ nombre_producto: "", precio: "", cantidad: "", estado: "Disponible" });
                      }}
                    >
                      Cancelar Edición
                    </button>
                  )}
                </form>

                {/* filtrado de los resultados */}
                <Filtro
                  onFiltrarNombre = {props.setFiltroNombre}
                  onFiltrarCantidad = {props.setFiltroCantidad}
                  onFiltrarDisponibilidad = {props.setFiltroDisponibilidad}
                  enFiltroActivo = {props.filtroNombre || props.filtroCantidad || props.filtroDisponibilidad !== "Todos"}
                />
              </aside>

              <main className = "panel-principal">
                <ColumnaProducto
                  productos = {props.productosFiltrados}
                  onActualizarCantidad={props.handleActualizarCantidad}
                  onCambiarEstado={props.handleCambiarEstado}
                  onBorrar={props.handleBorrarProducto}
                  onEditar={props.handleIniciarEdicion} // Inyección de la prop de edición 🛠️
                />
              </main>
            </div>

            {/* SECCIÓN DEL DIAGRAMA USADO */}
            <section className="seccion-diagramas" style={{ marginTop: '30px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ marginTop: 0, marginBottom: '15px', fontFamily: 'Segoe UI, sans-serif' }}>Diagramas</h2>

              <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '6px', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)' }}>
                <img
                  src={diagramaClasesFrontEnd}
                  alt="Diagrama de clases Front End"
                  style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </section>

          </div>
        } />

        <Route path="/manual" element={
          <div
            className={saliendo ? "pagina-saliendo" : ""}
            onAnimationEnd={saliendo ? alTerminarSalida : undefined}
          >
            <ManualUsuario />
          </div>
        } />
      </Routes>
    </>
  );
}