const formAdd = document.getElementById("addProduct");

formAdd.addEventListener('submit', e =>{
    e.preventDefault();
    const data = new FormData(formAdd);
    const objagregar = {};
    data.forEach((value, key) => {
        if (key === "price" || key === "code" || key === "stock") {
            objagregar[key] = parseInt(value);
        } else {
            objagregar[key] = value;
        }
    });
    fetch('/api/products',{
        method: 'POST',
        body: JSON.stringify(objagregar),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result=>{
        window.location.replace('/prueba')
    })
})

