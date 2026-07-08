export { ManualUsuario };

function ManualUsuario(){

    return (
        
        <>
        
        <div className = "contenido_manual">

            <h1 className = "titulo_manual">Esta página explica cómo utilizar el sistema. 
                Aquí encontrarás una guía rápida sobre el registro de usuarios,
                el uso del panel de productos y las funciones disponibles para administrar tu inventario.</h1>
            
            <ol style = {{listStyleType: "none"}}>
                <li> 
                    <h2 className = "titulo_manual">1. Registro e inicio de sesión </h2>
                    <p>Para acceder al sistema, primero debes registrarte ingresando tu nombre y tu RUT (con dígito verificador incluido).
                    Si ya tienes una cuenta, usa los mismos datos para iniciar sesión. El sistema valida automáticamente
                    que el RUT ingresado sea correcto antes de continuar.</p>
                </li>

                <li>
                    <h3 className = "titulo_manual">2. Añadir productos</h3>
                    <p> Desde el panel principal, despliega la sección "Añadir Producto" e ingresa el nombre,
                        precio y cantidad disponible. Al guardar, el producto aparecerá automáticamente en la tabla.</p>
                </li>

                <li>
                    <h4 className = "titulo_manual">3. Filtrar productos</h4>
                    <p>Puedes buscar productos por nombre, establecer una cantidad mínima,
                        o filtrar según su disponibilidad (Disponible / Agotado),
                        usando el panel de filtros ubicado junto al formulario.</p>
                </li>

                <li>
                    <h5 className = "titulo_manual">4. Modificar cantidad y estado de los productos</h5>
                    <p>En la tabla de productos, usa los botones "+" y "-" para ajustar la cantidad disponible,
                        o el botón "Alternar Estado" para cambiar manualmente entre Disponible y Agotado.</p>
                </li>
            </ol>
        </div>
        </>
    );
}