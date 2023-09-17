function agregarACarrito(productID, cartID, stock) {
	if (stock>0){
	let options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		//body: JSON.stringify(user)
	};
	let fetchRes = fetch(
		`/api/carts/${cartID}/product/${productID}`,
		options
	);
	fetchRes
		.then((res) => res.json())
		.then((d) => {

			Swal.fire({
				icon: "info",
				title: "Producto agregado al carrito exitosamente",
				text: "",
				toast: true,
				color: "#716add",
			});
		});
	}else{
		Swal.fire({
			icon: "info",
			title: "El producto no se puede agregar al carrito porque no hay stock",
			text: "",
			toast: true,
			color: "#716add",
		});
	}
}