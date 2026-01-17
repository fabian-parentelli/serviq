
const postProduct = async (data) => {

    // Supongamos que buscamos en db el producto.

    // console.log('product');

    const product = {
        name: 'termo',
        price: 100,
        qauntity: 1
    };

    return { status: 'success', result: product };
};

export { postProduct };