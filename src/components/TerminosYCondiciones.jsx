import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import Carousel from "react-bootstrap/Carousel"
import { ModalInfo } from "./ModalInfo";

import "bootstrap/dist/css/bootstrap.min.css"; 
import "../styles/TerminosYCondiciones.css"; 


export { TerminosYCondiciones };

function TerminosYCondiciones({on_aceptar}) {
  const data_slides = [
    {
      id: 0,
      titulo: "1. Aceptación de los Términos",
      texto: "Al ingresar y utilizar este sitio web de gestión de productos, acepta de manera íntegra los presentes Términos y Condiciones. Este sitio ha sido desarrollado con fines estrictamente académicos y de evaluación para la asignatura de Programación Front End."
    },
    {
      id: 1,
      titulo: "2. Almacenamiento Local",
      texto: "Toda la información y persistencia de datos se procesa localmente mediante el uso exclusivo de Local Storage en tu navegador."
    },
    {
      id: 2,
      titulo: "3. Aceptación final",
      texto: "Al hacer clic en 'Aceptar términos', confirmas que has leído y comprendido todos los puntos anteriores."
    }
  ];

  const [index, set_index] = useState(0);
  const [mostrar_boton, set_mostrar_boton] = useState(false);
  const [mostrar_modal, set_mostrar_modal] = useState(false);
  
  const [terminos_leidos, set_terminos_leidos] = useState(
    () => localStorage.getItem("terminos_aceptados") === "true" //revisamos que los terminos hayan sidos aceptados para ir a la pagina principal.
  );

  const handleSelect = (index_seleccionado) => {
    
    set_index(index_seleccionado);
    set_mostrar_boton(index_seleccionado === data_slides.length - 1);
  };

  return (
    
    <>

    <ModalInfo 
    esta_abierto = {mostrar_modal}
    
    on_cerrar = {() => {
      set_mostrar_modal(false);
    }}

    on_confirmar = {() => {
      set_mostrar_modal(false);

      localStorage.setItem("terminos_aceptados", "true");
      set_terminos_leidos(true);
      on_aceptar?.();

    }}/>

    <div className = "terminos-container">
      <div className = "carrusel-fijo">
        
        <Carousel
          variant="light"
          activeIndex={index}
          onSelect={handleSelect}
          interval={null} 
          pause="hover"
          controls={true}
          indicators={true}
        >
          {data_slides.map((slide) => (
            
            <Carousel.Item key = {slide.id}>
              
              <div className = "slide-contenido">
                <h2>{slide.titulo}</h2>
                <p>{slide.texto}</p>
              </div>

            </Carousel.Item>
          ))}
        </Carousel> {/*fin del carrusel */}
      
      </div>

      <button
        className = "btn-aceptar"
        style = {{ display: mostrar_boton ? 'block' : 'none' }}
        onClick = {() => {
            set_mostrar_modal(true);
        }}>
        Aceptar términos
      </button>
    </div>

    </>
  );
}