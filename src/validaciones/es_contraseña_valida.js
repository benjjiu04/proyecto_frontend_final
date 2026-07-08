export { es_contraseña_valida };

/**
 * @description función que regresa true o false si una contraseña es segura.
 * @param {string} contraseña 
 * @returns {boolean}
 */

function es_contraseña_valida(contraseña){

    //revisa que el texto si o si empieze con mayusculas, que tenga numeros y caracteres especiales.
    const patron_regex = /^[A-ZÑ](?=.*[0-9])(?=.*[&%\$#\?¿,!\(\)\*\[\]=\|\\-_]).*/g;
    const ocurrio_match = patron_regex.test(contraseña);

    if (ocurrio_match && contraseña.length >= 12){
        return true;
    }

    return false;

}