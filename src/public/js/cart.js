
function deleteProduct(productId, id) {
    fetch(`/api/carts/${id}/products/${productId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Manejar la respuesta exitosa aquí (por ejemplo, actualizar la interfaz de usuario).
        } else {
            // Manejar errores si es necesario.
        }
    })
    .catch(error => {
        console.error('Error al realizar la solicitud DELETE:', error);
    });
}


function eliminarProducto(productID, id){
    console.log("llegue onclick")
    //const queryString = window.location.search;
    //const urlParams = new URLSearchParams(queryString);
    //const cartID=urlParams.get('cid');
    console.log(id);
    console.log(productID)
    
    let options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 
                'application/json;charset=utf-8'
        },
        //body: JSON.stringify(user)
    }
    let fetchRes = fetch(`/api/carts/${id}/products/${productID}`, 
                                    options);
    fetchRes.then(res =>
        res.json()).then(d => {
            console.log(d);
            window.location.reload();
        })
}
