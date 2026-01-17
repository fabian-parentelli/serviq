// import { client } from "./app.js";

const postUser = async (data) => {

    // Supongamos que buscamos en db el usuario.
    

    const user = {
        name: 'Juan',
        age: 30,
        email: 'juan@mail.com'
    };

    return { status: 'success', result: user };    
};

export { postUser };