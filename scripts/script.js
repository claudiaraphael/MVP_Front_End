// coração da aplicação
// conexão com endpoint da API

// entrada do usuario
const produto = document.getElementById("user-input");

// 1 - pega o produto
// 2 - pega os selos de sustentabilidaade da info da endpoint da api
// 3 - compara com os verdadeiros selos dos produtos
// 4 - da o score de sustentabilidade
// 5 - manda o score pro servidor do banco de dados

/* Function to create a new product */
const postItem = async (inputProduct, inputBarcode, InputComment) => {
    const formData = new FormData();
    formData.append('name', inputProduct);
    formData.append('barcode', inputProduct);
    formData.append('comment', inputProduct);




}