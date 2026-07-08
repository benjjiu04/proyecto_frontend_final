import bcrypt from "bcryptjs";
import { use } from "react";
export { encriptar_contraseña };

/**
 * 
 * @param {string} contraseña 
 * @returns {string}
 */
async function encriptar_contraseña(contraseña){

    const salt = await bcrypt.genSalt(11);
    const contraseña_encriptada = await bcrypt.hash(contraseña, salt);

    return contraseña_encriptada;

}