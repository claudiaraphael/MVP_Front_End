const SCAN_URL = 'http://127.0.0.1:5000/product/scan';  // Flask porta 5000 (backend)
const SEARCH_URL = 'http://127.0.0.1:5000/product/';

// Função principal disparada pelo botão
async function handleAction() {
    const inputField = document.getElementById('userInput');
    const query = inputField.value.trim();

    console.log("Botão clicado! Valor do input:", query);

    if (!query) {
        // Se vazio: Pergunta se quer abrir a câmera (Privacidade)
        if (confirm("Deseja abrir a câmera para escanear?")) {
            startScanner();
        }
    } else if (/^\d+$/.test(query)) {
        // Se for só números: POST (Barcode) - USA SCAN_URL
        fetchData(SCAN_URL, 'POST', { barcode: query });
    } else {
        // Se tiver letras: GET (Search by Name) - USA SEARCH_URL
        fetchData(`${SEARCH_URL}?name=${encodeURIComponent(query)}`, 'GET');
    }
}

// Função de comunicação unificada
async function fetchData(url, method, body = null) {
    console.log(`Chamando API: ${method} ${url}`);
    try {
        const options = {
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(url, options);
        const data = await response.json();

        console.log(data)

        if (!response.ok) throw new Error(data.error || 'Erro na requisição');

        // Ajuste: O POST retorna {product: {...}}, o GET retorna o objeto direto
        const productData = data.product || data;
        console.log("Product to display: ", productData);
        displayProduct(productData);

    } catch (err) {
        console.error("Erro no Fetch:", err);
        alert("Erro: " + err.message);
    }
}

// Scanner (Corrigido para não piscar)
function startScanner() {
    const container = document.getElementById('scanner-container');
    container.style.display = 'block';

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: container,
            constraints: { 
                width: { min: 640 },
                height: { min: 400 },
                facingMode: "environment" // uses back camera on phones
            }
        },
        decoder: { 
            readers: ["ean_reader", "ean_8_reader", "upc_reader"] 
        },
        locate: true // find the barcode in the image
    }, (err) => {
        if (err) {
            alert("Erro na câmera: " + err);
            container.style.display = 'none';
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected((data) => {
        const code = data.codeResult.code;
        console.log("Código detectado: ", code)

        Quagga.stop();
        container.style.display = 'none';
        
        document.getElementById('userInput').value = code;
        
        fetchData(SCAN_URL, 'POST', { barcode: code });
    });
}

// Vincula o evento ao botão
document.addEventListener('DOMContentLoaded', () => {
    const actionBtn = document.getElementById('btnAction'); 
    if (actionBtn) {
        actionBtn.addEventListener('click', handleAction);
        console.log("Listener do botão configurado com sucesso.");
    } else {
        console.error("ERRO: O botão com ID 'btnAction' não foi encontrado no HTML.");
    }
});

function displayProduct(product) {
    console.log("Renderizando produto:", product);

    // Seleciona os elementos do HTML (certifique-se que os IDs existem no seu index.html)
    const nameElement = document.getElementById('nomeProduto'); // ou o ID que você usa para o nome
    const scoreElement = document.getElementById('scoreProduto');
    const summaryElement = document.getElementById('resumoProduto');
    const imageElement = document.getElementById('productImage'); 

    if (imageElement) {
        imageElement.src = product.image_url || 'S:\PUC\MVP\MVP_1\front_end\assets\sabao_eco_green.png';
        imageElement.alt = product.name;
    }
    if (nameElement) nameElement.innerText = product.name || "Produto sem nome";
    
    if (scoreElement) {
        scoreElement.innerText = `${product.score}% sustentável`;
        
        // Aplica a classe de cor baseada no score definido no seu CSS
        if (product.score < 50) {
            scoreElement.classList.add('low-score');
        } else {
            scoreElement.classList.remove('low-score');
        }
    }

    if (summaryElement) {
        // Cria um resumo baseado nas tags que recebemos do backend
        const additivesCount = product.additives_tags ? product.additives_tags.split(',').length : 0;
        summaryElement.innerText = `Resumo: Nova Group ${product.nova_group}, ${product.additives_tags ? product.additives_tags.split(',').length : 0} aditivos.`;    
    }
}