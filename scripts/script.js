// 1. CONFIGURAÇÕES E URLS (Sempre no topo)
const SCAN_URL = 'http://127.0.0.1:5000/product/scan';
const SEARCH_URL = 'http://127.0.0.1:5000/product/';
const LIST_URL = 'http://127.0.0.1:5000/products-list';
const DELETE_URL = 'http://127.0.0.1:5000/product/delete';

// 2. INICIALIZAÇÃO (Configura eventos ao carregar a página)
document.addEventListener('DOMContentLoaded', () => {
    const actionBtn = document.getElementById('btnAction'); 
    if (actionBtn) {
        actionBtn.addEventListener('click', handleAction);
        console.log("Listener do botão configurado.");
    }

    // Carrega o histórico inicial
    loadHistory();
});

// 3. LÓGICA DE AÇÃO PRINCIPAL
async function handleAction() {
    const inputField = document.getElementById('userInput');
    const query = inputField.value.trim();

    if (!query) {
        if (confirm("Do you accept to open the camera and scan?")) {
            startScanner();
        }
    } else if (/^\d+$/.test(query)) {
        // Envio de Barcode via POST
        fetchData(SCAN_URL, 'POST', { barcode: query });
    } else {
        // Busca por nome via GET
        fetchData(`${SEARCH_URL}?name=${encodeURIComponent(query)}`, 'GET');
    }
}

// 4. COMUNICAÇÃO COM A API (Fetch Unificado)
async function fetchData(url, method, body = null) {
    try {
        const options = {
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };
        
        // Correção: GET não pode ter corpo (body)
        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Erro ${response.status}`);
        }

        // Renderiza no Truth Label
        const productToDisplay = data.product ? data.product : data;
        displayProduct(productToDisplay);

        // Atualiza a tabela de histórico
        loadHistory();

    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Ops! " + error.message);
    }
}
async function loadHistory() {
    console.log("Tentando carregar histórico...");
    const tableBody = document.querySelector('#historyTable tbody');
    if (!tableBody) {
        console.error("Erro: Tabela 'historyTable' não encontrada no HTML.");
        return;
    }

    try {
        const response = await fetch(LIST_URL);
        const data = await response.json();
        console.log("Data received from Flask:", data);
        
        tableBody.innerHTML = ''; 

        // Tenta encontrar a lista de produtos (ajustado para ser mais flexível)
        const products = Array.isArray(data) ? data : data.products;

        if (products && products.length > 0) {
            products.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><img src="${p.image_url || 'assets/default.png'}" style="width:40px"></td>
                    <td>${p.name || 'Sem nome'}</td>
                    <td class="${p.score < 50 ? 'low-score' : 'score'}">${p.score}%</td>
                    <td><button onclick="deleteProduct('${p.barcode}')">❌</button></td>
                `;
                tableBody.appendChild(tr);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="4">No product in history.</td></tr>';
        }
    } catch (e) { 
        console.error("Error in history query request:", e); 
    }
}

async function deleteProduct(barcode) {
    if (!confirm("Are you sure you want to delete the product?")) return;

    try {
        const response = await fetch(DELETE_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ barcode: barcode })
        });

        if (response.ok) {
            loadHistory(); 
        } else {
            alert("Error deleting the product.");
        }
    } catch (error) {
        console.error("Error on DELETE:", error);
    }
}

function displayProduct(product) {
    console.log("Renderizando complete Truth Label:", product);

    const nameElement = document.getElementById('nomeProduto');
    const scoreElement = document.getElementById('scoreProduto');
    const summaryElement = document.getElementById('resumoProduto');
    const imageElement = document.getElementById('productImage');

    // Imagem e Nome com Fallbacks
    if (imageElement) imageElement.src = product.image_url || 'assets/default.png';
    if (nameElement) nameElement.innerText = product.name || "Product couldn't be found";
    
    // 1. Score com cor dinâmica
    if (scoreElement) {
        scoreElement.innerText = `${product.score}% sustainable`;
        scoreElement.className = product.score < 50 ? 'low-score' : 'high-score';
    }

    if (summaryElement) {
        // 2. Mapping emogis for allergens
        const allergenEmojis = {
            'en:milk': '🥛 Milk',
            'en:eggs': '🥚 Eggs',
            'en:soybeans': '🫘 Soybeans',
            'en:nuts': '🥜 Nuts/Coconuts',
            'en:gluten': '🌾 Gluten',
            'en:fish': '🐟 Fish',
            'en:mustard': '🌭 Mustard',
            'en:sesame-seeds': '🥯 Sesame seeds'
        };

        // 3. Tratamento de Labels (Certificações como Selos)
        const labels = product.labels_tags ? product.labels_tags.split(',') : [];
        const labelsHTML = labels.length > 0 
            ? labels.map(l => `<span class="badge-label">${l.replace('en:', '').replace(/-/g, ' ')}</span>`).join('')
            : '<span class="badge-none">No environmental labels</span>';

        // 4. Tratamento dos Alérgenos com Destaque
        const allergensRaw = product.allergens_tags || "";
        const allergensList = allergensRaw.length > 0 
            ? allergensRaw.split(',').map(tag => {
                return allergenEmojis[tag] || `⚠️ ${tag.replace('en:', '').trim()}`;
              }).join(' • ')
            : "✅ No allergens declared";

        // 5. Informações Nutricionais e Críticas
        const nutrition = product.nutriscore_grade ? product.nutriscore_grade.toUpperCase() : 'N/A';
        const isVegan = product.ingredients_analysis_tags?.includes('en:vegan') ? '🌱 Vegan' : '🥩 Not Vegan';
        const palmOil = product.ingredients_analysis_tags?.includes('en:palm-oil') ? '⚠️ Contains Palm Oil' : '✅ No Palm Oil';
        const descricao = product.description || product.generic_name || "Detailed description not available.";

        // 6. Montagem do HTML Final
        summaryElement.innerHTML = `
            <div class="labels-container">
                ${labelsHTML}
            </div>

            <div class="allergen-highlight">
                <strong>ALLERGENS:</strong>
                <p>${allergensList}</p>
            </div>
            
            <div class="details-grid">
                <div class="info-box">
                    <strong>Analysis</strong>
                    <p>${isVegan}</p>
                    <p>${palmOil}</p>
                </div>
                <div class="info-box">
                    <strong>Nutrição</strong>
                    <p>Nutri-Score: <span class="nutri-grade grade-${nutrition.toLowerCase()}">${nutrition}</span></p>
                    <p>Nova Group: ${product.nova_group || 'N/A'}</p>
                </div>
            </div>

            <div class="additives-section">
                <strong>Additives:</strong> ${product.additives_tags || 'None detected'}
                <hr>
                <small>${descricao}</small>
            </div>
        `;
    }
}

// 7. SCANNER (QuaggaJS)
function startScanner() {
    const container = document.getElementById('scanner-container');
    if (!container) return;
    container.style.display = 'block';

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: container,
            constraints: { width: 640, height: 480, facingMode: "environment" },
            willReadFrequently: true // Remove avisos de performance
        },
        decoder: { readers: ["ean_reader"] }, // Foco no padrão 789 do Brasil
        locate: true
    }, (err) => {
        if (err) { alert("Erro: " + err); return; }
        Quagga.start();
    });

    // ESTA PARTE FAZ AS LINHAS VERDES APARECEREM
    Quagga.onProcessed((result) => {
        const drawingCtx = Quagga.canvas.ctx.overlay;
        const drawingCanvas = Quagga.canvas.dom.overlay;
        if (result) {
            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
            if (result.boxes) {
                result.boxes.filter(b => b !== result.box).forEach(box => {
                    Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                });
            }
            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F119", lineWidth: 2 });
            }
        }
    });

    Quagga.onDetected((data) => {
        if (data && data.codeResult) {
            const code = data.codeResult.code; // Resolve o ReferenceError
            Quagga.stop();
            container.style.display = 'none';
            document.getElementById('userInput').value = code;
            fetchData(SCAN_URL, 'POST', { barcode: code }); // Envia para o Flask
        }
    });
}

    // Error treatment for QuaggaJS loading
    if (typeof Quagga === 'undefined') {
        console.error("Erro: QuaggaJS não foi carregado. Verifique o link do CDN ou a inclusão do script.");
        alert("Erro: O módulo de scanner não está disponível no momento.");
    }