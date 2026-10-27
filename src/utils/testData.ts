import rawData from '../../test-data/products.json';

export interface CartProduct {
  id: string;
  searchTerm: string; // čo sa zadá do vyhľadávania (nemusí byť zhodné s názvom)
  productName: string;
  price: string;
  quantity: number;
}

export interface InvalidSearch {
  id: string;
  searchTerm: string;
}

interface TestData {
  cartProducts: CartProduct[];
  invalidSearches: InvalidSearch[];
}

// kontrola JSON-u hneď pri načítaní, aby chyba v dátach nespadla až ako timeout v teste
function validate(data: TestData): TestData {
  const errors: string[] = [];

  if (!Array.isArray(data.cartProducts) || data.cartProducts.length === 0) {
    errors.push('"cartProducts" must be a non-empty array');
  }
  data.cartProducts?.forEach((p, i) => {
    for (const key of ['id', 'searchTerm', 'productName', 'price'] as const) {
      if (typeof p[key] !== 'string' || p[key].trim() === '') {
        errors.push(`cartProducts[${i}].${key} must be a non-empty string`);
      }
    }
    if (!Number.isInteger(p.quantity) || p.quantity < 1) {
      errors.push(`cartProducts[${i}].quantity must be a positive integer`);
    }
  });
  data.invalidSearches?.forEach((s, i) => {
    if (typeof s.searchTerm !== 'string' || s.searchTerm.trim() === '') {
      errors.push(`invalidSearches[${i}].searchTerm must be a non-empty string`);
    }
  });

  if (errors.length > 0) {
    throw new Error(`Invalid test data in test-data/products.json:\n - ${errors.join('\n - ')}`);
  }
  return data;
}

export const testData: TestData = validate(rawData as TestData);
