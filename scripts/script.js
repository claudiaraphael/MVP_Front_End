const SCAN_URL = 'http://127.0.0.1:5000/product/scan';  // Flask porta 5000 (backend)
const SEARCH_URL = 'http://127.0.0.1:5000/product';

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
            constraints: { facingMode: "environment" }
        },
        decoder: { readers: ["ean_reader"] }
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
        Quagga.stop();
        container.style.display = 'none';
        document.getElementById('userInput').value = code;
        // CORREÇÃO AQUI - USA SCAN_URL
        fetchData(SCAN_URL, 'POST', { barcode: code });
    });
}

// Vincula o evento ao botão (Certifique-se que o ID bate com o HTML)
document.addEventListener('DOMContentLoaded', () => {
    const actionBtn = document.getElementById('btnAction'); 
    if (actionBtn) {
        actionBtn.addEventListener('click', handleAction);
        console.log("Listener do botão configurado com sucesso.");
    } else {
        console.error("ERRO: O botão com ID 'btnAction' não foi encontrado no HTML.");
    }
});