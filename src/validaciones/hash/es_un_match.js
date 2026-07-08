import bcrypt from "bcryptjs"; //tiene que ser bcryptjs porque el bcrypt normal solo se puede usar en backend!
export { es_un_match };
/**
 * 
 * @param {string} contraseña
 * @returns {boolean} 
 */
async function es_un_match(contraseña, hash_contraseña){

    const es_match = await bcrypt.compare(contraseña, hash_contraseña);
    return es_match;
}