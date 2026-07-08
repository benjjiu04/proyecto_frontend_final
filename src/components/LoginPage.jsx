import React, { useState } from "react";

import { mod11_rut } from "../validaciones/rut/mod11_rut.js";
import { es_contraseña_valida } from "../validaciones/es_contraseña_valida.js";
import { encriptar_contraseña } from "../validaciones/hash/encriptar_contraseña.js";
import { es_un_match } from "../validaciones/hash/es_un_match.js";

import { verificarSiUsuarioExiste, 
        obtenerUsuariosRegistrados,
        registrarEnLocalStorage }  from "./retrieve_data.jsx";

import "bulma/css/bulma.min.css";

export { LoginPage };

function LoginPage({ onLoginSuccess }){
    
    const [nombre, set_nombre] = useState("");
    const [rut, set_rut] = useState("");
    const [errores, set_errores] = useState({ nombre: "", rut: "" , contraseña: ""});
    const [contraseña, set_contraseña] = useState("");


    const formulario_es_valido = () => {

        const nuevos_errores = { nombre: "", rut: "", contraseña: ""};
        let es_valido = true;

        if (nombre.trim() === "") { 

            nuevos_errores.nombre = "El campo de nombre no puede estar vacío.";
            es_valido = false;
        }

        if (!mod11_rut(rut)) {

            nuevos_errores.rut = "El RUT ingresado no es válido.";
            es_valido = false;
        }

        if (!es_contraseña_valida(contraseña)){

            nuevos_errores.contraseña = "La contraseña ingresada no es segura. asegurese de que contenga un minimo de 12 caracteres,\
            sea alfanumerico y contenga al menos 1 caracter especial.";

            es_valido = false;

        }

        set_errores(nuevos_errores);
        return es_valido;
    };


    const manejar_registro = async() => {

        if (!formulario_es_valido()) return;

        const usuarioExistente = verificarSiUsuarioExiste(rut);

        if (usuarioExistente) {

            set_errores(prev => ({ ...prev, rut: "Este RUT ya se encuentra registrado." }));
            return;
        }
                                                                    //encriptamos la contraseña para luego guardarla en el objeto.
        const nuevoUsuario = { nombre: nombre, rut: rut, contraseña: await encriptar_contraseña(contraseña)}; //guardamos los datos del usuario en un objeto.
        registrarEnLocalStorage(nuevoUsuario);
        
        alert("¡Usuario registrado con éxito!");

        set_nombre(""); //vacia los inputs luego de registrarse.
        set_rut("");
        set_contraseña("");
    };


    const manejar_login = async() => {

        if (!formulario_es_valido()) return;

        const usuarioEncontrado = verificarSiUsuarioExiste(rut);

        if (!usuarioEncontrado) {
            set_errores(prev => ({ 
                ...prev, 
                rut: "El usuario no existe. Por favor, regístrese primero." 
            }));
            return;
        }

        if (usuarioEncontrado.nombre.toLowerCase() !== nombre.toLowerCase()) {
            
            set_errores(prev => ({ 
                ...prev, 
                nombre: "El nombre no coincide con el RUT registrado." 
            }));
            
            return;
        }

        if (!es_un_match(contraseña, usuarioEncontrado.contraseña)){

            set_errores(prev => ({
                ...prev,
                contraseña: "la contraseña no coincide con el rut registrado."
            }));
            
            return;
        }


        localStorage.setItem("sesion_activa", JSON.stringify(usuarioEncontrado));
        alert(`¡Bienvenido de vuelta, ${usuarioEncontrado.nombre}!`);

        // ejecuta la función que le pasó GestionProducto para cambiar el estado y cargar la app
        if (onLoginSuccess) {
            onLoginSuccess();
        }
    };

    return (

        <div className = "form_background_image">
            <form onSubmit={(evento) => evento.preventDefault()}> {/*le decimos al navegaor que nosotros 
                                                                  nos encargamos de las validaciones.*/}

                <div className = "login-screen-container">
                    <div className = "tarjeta_login">

                        <h2 className = "titulo_login">Bienvenido!</h2>

                        <label htmlFor = "nombre" className = "form-loggin">Ingrese su nombre</label>
                        <input 
                            type="text" 
                            className="input form-loggin"
                            value={nombre}
                            onChange={(e) => set_nombre(e.target.value)}
                        />
                        {errores.nombre && <p style={{ color: "#ff7675", fontSize: "14px", marginTop: "5px" }}>{errores.nombre}</p>}
                        
                        {/*input de rut */}
                        <label htmlFor = "rut" className="form-loggin">Ingrese su RUT</label>
                        
                        <input 
                        type = "text" 
                        className = "input form-loggin"
                        value = {rut}
                        onChange = {(e) => set_rut(e.target.value)}/>

                        {errores.rut && <p style={{ color: "#ff7675", fontSize: "14px", marginTop: "5px" }}>{errores.rut}</p>}
                        
                        {/*input de contraseña */}
                        <label htmlFor = "contraseña" className = "form-loggin"> Ingrese su contraseña </label>

                        <input 
                        type = "password" 
                        className = "input form-loggin" 
                        value = {contraseña}
                        onChange = {(e) => {set_contraseña((e.target.value))}}/>

                        {errores.contraseña && <p style = { {color: "red", fontSize: "14px", marginTop: "5px" } }>{errores.contraseña}</p>}
                        <div className="container_botones_form">
                            
                            <button type="button" className="button boton_loggin boton_secundario" onClick={manejar_registro}>
                            Registrarme
                            </button>
                            
                            <button type="button" className="button boton_loggin boton_primario" onClick={manejar_login}>
                            Iniciar Sesión
                            </button>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    );
}