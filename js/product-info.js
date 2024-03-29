document.addEventListener("DOMContentLoaded", function () {

    //Cargar información del producto y comentarios
    const productInfoUrl = PRODUCT_INFO_URL + localStorage.getItem("productId") + EXT_TYPE;
    const commentsUrl = PRODUCT_INFO_COMMENTS_URL + localStorage.getItem("productId") + EXT_TYPE;

    async function getJson() {
      try{
        const responseProducto = await fetch(productInfoUrl);
        const jsonProducto = await responseProducto.json();
        showData(jsonProducto);
        const responseComentario = await fetch(commentsUrl);
        const jsonComentario = await responseComentario.json();
        comJson(jsonComentario);
      }
      catch (error){
        //Mensaje de error
        console.error('Error al solicitar la información \n', error);
        divProductInfo.innerHTML = `
          <div class="bg-danger text-white text-center rounded p-4 m-4">
            <h5>Lo sentimos, ha ocurrido un error.</h5>
          </div>`
      }
    }
    getJson();

    //Mostrar la información del producto
    const divProductInfo = document.getElementById('divProductInfo');
    const productImgs = document.getElementById('productImgs');

    function showData(data){
        divProductInfo.innerHTML = `
        <div class="text-center p-4"">
            <h2>${data.name}</h2></div>
        <div class="list-group">
            <div class="p-3 list-group-item">
                <h6><span class="h5">Descripción: </span>${data.description}</h6></div>
            <div class="p-3 list-group-item">
                <h6><span class="h5">Precio: </span>${data.cost} ${data.currency}</h6></div>
            <div class="p-3 list-group-item">
                <h6><span class="h5">Cantidad vendidos: </span>${data.soldCount}</h6></div>
            <div class="p-3 list-group-item">
                <h6><span class="h5">Categoría: </span>${data.category}</h6></div>
        <div>`
        data.images.forEach(imagen => {
            productImgs.innerHTML += `
                <div class="col">
                <img class="img-fluid border m-2" src="${imagen}" alt="${data.name}">
                </div>`
        })
    }

    //Función que muestra las estrellas
    function estrellas(score) {
        let stars = '';
        const maxStars = 5;
        const yellowStar = '<span class="fa fa-star checked"></span>';
        const blackStar = '<span class="fa fa-star"></span>';

        for (let i = 0; i < maxStars; i++) {
            if (i < score) {
                stars += yellowStar;
            } else {
                stars += blackStar;
            }
        }
        return stars;
    }

    //Función que muestra los comentarios del JSON
    const comentarios = document.getElementById("comments");

    function comJson(comments){
        for(let comment of comments){
            comentarios.innerHTML += `
            <div class="commentsHechos">
                <ul class='list-group'>
                    <li class="list-group-item">
                        <div>
                            <strong>${comment.user}</strong>
                            <small class='text-muted'> &nbsp; - ${comment.dateTime} - &nbsp; </small>
                            ${estrellas(comment.score)}
                            <br>
                            ${comment.description}
                        </div>
                    </li>
                </ul>
            </div>
        ` 
        }
    }

    //Función que agrega el comentario y lo guarda en el localstorage
    function agregarComentario(opinion, fechaFormateada, actualUser, puntuacion) {
        const comentarioHTML = `
        <li class="list-group-item">
            <div>
                <strong>${actualUser}</strong>
                <small class='text-muted'> &nbsp; - ${fechaFormateada} - &nbsp; </small>
                ${estrellas(puntuacion)}
                <br>
                ${opinion}
            </div>
        </li>`;
        
        const productId = localStorage.getItem('productId')
        localStorage.setItem(`comentario ${productId}`, comentarioHTML);

        comentarios.innerHTML += comentarioHTML;
    }

    //Se obtiene el comentario del localstorage y se muestra en pantalla
    const productId = localStorage.getItem('productId')
    const comentarioCargado = localStorage.getItem(`comentario ${productId}`);
    comentarios.innerHTML += comentarioCargado

    //Obtención de datos del formulario
    const commentForm = document.getElementById('commentForm');
    
    commentForm.addEventListener('submit', e => {
        e.preventDefault();

        const puntuacion = document.getElementById('puntuacion').value;
        const opinion = document.getElementById('opinion').value;
        const actualUser = localStorage.getItem('usuario');
        const fechaHora = new Date();
        const opciones = { timeZone: 'America/Argentina/Buenos_Aires' };
        const fechaFormateada = fechaHora.toLocaleString('es-AR', opciones);

        agregarComentario(opinion, fechaFormateada, actualUser, puntuacion);

        commentForm.reset();
    });

    
});

