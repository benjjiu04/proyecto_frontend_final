export { ModalInfo };

import "bulma/css/bulma.min.css";
import "../styles/modal_bulma.css";
import { useState } from "react";

function ModalInfo({esta_abierto, on_cerrar, on_confirmar}){

    const [saliendo_animacion, set_saliendo_animacion] = useState(false);
    const [accion_pendiente, set_accion_pendiente] = useState(null);
 
  const iniciar_cierre = (accion) => {

        set_accion_pendiente(() => accion);
        set_saliendo_animacion(true);
  };
 
  // se dispara automaticamente cuando termina la animacion de CSS.
  // recien ahi avisamos al padre, que es quien realmente oculta el modal.
  const al_terminar_animacion = () => {
    
    if (saliendo_animacion) {
      
      set_saliendo_animacion(false);
      accion_pendiente?.();
    }
  };


    return (
        <>

        <div className = "bulma-scoped mi_modal"> {/* contenedor para estilizar solamente lo que está dentro del div con bulma */}
            <div className =  {`modal ${esta_abierto ? "is-active" : ""}`}> {/*si presionamos aceptar en los terminos y condiciones, se activa el modal. */}

                <div className = "modal-background" onClick = {() => {iniciar_cierre(on_cerrar)} }></div>
                <div className = {`modal-content ${saliendo_animacion ? "modal_saliendo" : ""}`} 
                 onAnimationEnd = {al_terminar_animacion}>      

                    <p> Está seguro de que leyó con detenimiento los terminos y condiciones? </p>
                    
                    <div className = "container_botones">
                        <button className = "boton_modal" onClick = {() => iniciar_cierre(on_confirmar)}> Sí </button> {/*le agregamos las variables para luego manipular el modal al pulsar los botones. */}
                        <button className = "boton_modal" onClick = {() => iniciar_cierre(on_cerrar)}> No </button>
                    </div>
                </div>

            </div>
        </div>
        </>
    );
}