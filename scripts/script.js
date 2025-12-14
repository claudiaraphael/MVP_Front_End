/* transfer environment variables and then export them to app.py */

// Open Food Facts API endpoints
const OFF_BASE = 'https://world.openfoodfacts.net'

// fetch product by name
const OFF_PRODUCT_NAME = OFF_BASE + '/cgi/search.pl?search_terms={name}&search_simple=1&action=process&json=1'

// fetch product by barcode:
const OFF_BARCODE = OFF_BASE + '/api/v2/product/{barcode}'

get_product(name, barcode) {
  // name comes from the frontend input
  const name = name.trim();
  const barcode = barcode.trim();

  let url = OFF_BASE;

  if (name) {
    url = OFF_PRODUCT_NAME.replace('{name}', name)
  } else if (barcode) {
    url = OFF_BARCODE.replace('{barcode}', barcode)
  }

  return fetch(url)
}