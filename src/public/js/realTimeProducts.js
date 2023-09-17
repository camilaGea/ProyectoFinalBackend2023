
const socket = io();

//agregar producto

const formAdd = document.getElementById("addProduct");
const title = document.getElementById("title");
const price = document.getElementById("price");
const code = document.getElementById("code");
const stock = document.getElementById("stock");
const category = document.getElementById("category");
const description = document.getElementById("description");
const statuss = document.getElementById("status");
const thumbnail = document.getElementById("thumbnail");
const owner = document.getElementById("owner");

formAdd.addEventListener("submit", (e) => {
    e.preventDefault();

    socket.emit("newProduct", { //envio el id producto a eliminar desde el Cliente al Servidor
        title: title.value,
        price: price.value,
        code: code.value,
        stock: stock.value,
        category: category.value,
        description: description.value,
        status: statuss.value,
        thumbnail: thumbnail.value,
        owner: owner.value
    });
});

socket.on("productAdd", (response) => {
    if (response.status === "success") {
        let list = "";
        response.data.forEach(({ _id, title, price, code, stock, category, description, status, owner  }) => {
            list += `<tr>
            <td>${_id}</td>
            <td>${title}</td>
            <td>${price}</td>
            <td>${code}</td>
            <td>${stock}</td>
            <td>${category}</td>a
            <td>${description}</td>
            <td>${status}</td>
            <td>${owner}</td>
            </tr>`;
        });

        const listaAct =
            `
        <tr>
        <th scope="col">ID</th>
        <th scope="col">Name</th>
        <th scope="col">Price</th>
        <th scope="col">code</th>
        <th scope="col">stock</th>
        <th scope="col">category</th>
        <th scope="col">description</th>
        <th scope="col">status</th>
        <th scope="col">owner</th>
        </tr>` + list;
        document.getElementById("tableProduct").innerHTML = listaAct;
    } else if (response.status === "error") {
        mostrarMensajeDeError(response.message);
    }
});

function mostrarMensajeDeError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: mensaje,
    })
}

//eliminar producto
const formDelete = document.getElementById("formDelete");

const id = document.getElementById("deleteProd");

formDelete.addEventListener("submit", (evt) => {
    evt.preventDefault();
    socket.emit("productDelete", { _id: id.value }); //envio el id producto a eliminar desde el Cliente al Servidor
});

socket.on("newList", (response) => { //escucho lo que me envia el servidor 
    if (response.status === "success") {
        let list = "";

        response.data.forEach(({ _id, title, price, code, stock, category, description, status, owner}) => {
            list += `
                        <tr>
                        <td>${_id}</td>
                        <td>${title}</td>
                        <td>${price}</td>
                        <td>${code}</td>
                        <td>${stock}</td>
                        <td>${category}</td>
                        <td>${description}</td>
                        <td>${status}</td>
                        <td>${owner}</td>
                        </tr>`;
        });

        const listaAct =
            `
        <tr>
        <th scope="col">ID</th>
        <th scope="col">Name</th>
        <th scope="col">Price</th>
        <th scope="col">code</th>
        <th scope="col">stock</th>
        <th scope="col">category</th>
        <th scope="col">description</th>
        <th scope="col">status</th>
        <th scope="col">owner</th>
        </tr>` + list;
        document.getElementById("tableProduct").innerHTML = listaAct;
        
    }
    else if (response.status === "error") {
        mostrarMensajeDeError(response.message);
    }    
});
