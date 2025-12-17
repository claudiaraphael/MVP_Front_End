// Fetch product by barcode OR name
async function fetchProduct(query, type = 'barcode') {
  try {
    let url;
    
    if (type === 'barcode') {
      url = `http://localhost:5000/api/openfoodfacts/product/${query}`;
    } else if (type === 'name') {
      url = `http://localhost:5000/api/openfoodfacts/search?name=${query}`;
    } else {
      throw new Error('Invalid type. Use "barcode" or "name"');
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
    
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Display single product
function displayProduct(product) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
    <div class="product-card">
      <img src="${product.image_url || 'placeholder.jpg'}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p><strong>Barcode:</strong> ${product.barcode}</p>
      <p><strong>Brands:</strong> ${product.brands || 'N/A'}</p>
      <p><strong>Ecoscore:</strong> ${product.ecoscore_grade || 'N/A'}</p>
      <p><strong>Categories:</strong> ${product.categories || 'N/A'}</p>
    </div>
  `;
}

// Display multiple products (search results)
function displayResults(products) {
  const resultDiv = document.getElementById('result');
  
  if (products.length === 0) {
    resultDiv.innerHTML = '<p>No products found</p>';
    return;
  }
  
  resultDiv.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.image_url || 'placeholder.jpg'}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p><strong>Barcode:</strong> ${product.barcode}</p>
      <p><strong>Brands:</strong> ${product.brands || 'N/A'}</p>
      <p><strong>Ecoscore:</strong> ${product.ecoscore_grade || 'N/A'}</p>
    </div>
  `).join('');
}

// Usage examples
document.getElementById('btnScanBarcode').addEventListener('click', async () => {
  const barcode = document.getElementById('inputBarcode').value;
  
  if (!barcode) {
    alert('Enter a barcode');
    return;
  }
  
  try {
    const data = await fetchProduct(barcode, 'barcode');
    displayProduct(data);
  } catch (error) {
    alert('Error fetching product: ' + error.message);
  }
});

document.getElementById('btnSearchName').addEventListener('click', async () => {
  const name = document.getElementById('inputName').value;
  
  if (!name) {
    alert('Enter a product name');
    return;
  }
  try {
    const data = await fetchProduct(name, 'name');
    displayResults(data.products);
  } catch (error) {
    alert('Error searching products: ' + error.message);
  }
});
