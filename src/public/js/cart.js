
function ticket(cartid){
    let options = {
        method: 'GET',
        headers: {
            'Content-Type': 
                'application/json;charset=utf-8'
        },
    }
    let fetchRes = fetch(`/api/carts/${cartid}/purchase`, 
                                    options);
    fetchRes.then(res =>
        res.json()).then(d => {
        window.location.replace(`/ticket?ticketData=${JSON.stringify(d.payload)}`);                                   
    })
                                    
}

function eliminarProducto(productID, id){
    let options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 
                'application/json;charset=utf-8'
        },
    }
    let fetchRes = fetch(`/api/carts/${id}/products/${productID}`, 
                                    options);
    fetchRes.then(res =>
        res.json()).then(d => {
            window.location.reload();
            Swal.fire({
				icon: "info",
				title: "Producto Elimnado del carrito exitosamente",
				text: "",
				toast: true,
				color: "#716add",
			});
            
        })
}
