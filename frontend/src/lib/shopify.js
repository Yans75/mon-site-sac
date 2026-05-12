// Shopify Storefront API GraphQL client
// Docs: https://shopify.dev/docs/api/storefront

const DOMAIN = process.env.REACT_APP_SHOPIFY_DOMAIN;
const TOKEN = process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = process.env.REACT_APP_SHOPIFY_API_VERSION || "2025-07";
const COUNTRY = process.env.REACT_APP_SHOPIFY_COUNTRY || "FR";
const LANGUAGE = process.env.REACT_APP_SHOPIFY_LANGUAGE || "FR";

const ENDPOINT = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;

/**
 * Low-level GraphQL fetcher.
 * Automatically prepends @inContext(country: FR, language: FR) parameters via query variables.
 */
export async function shopifyFetch({ query, variables = {} }) {
  if (!DOMAIN || !TOKEN) {
    throw new Error(
      "Shopify config missing. Check REACT_APP_SHOPIFY_DOMAIN and REACT_APP_SHOPIFY_STOREFRONT_TOKEN in .env"
    );
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { country: COUNTRY, language: LANGUAGE, ...variables },
      }),
    });

    const json = await res.json();
    if (json.errors) {
      console.error("Shopify GraphQL errors:", json.errors);
      throw new Error(json.errors[0]?.message || "Shopify GraphQL error");
    }
    return json.data;
  } catch (err) {
    console.error("Shopify fetch failed:", err);
    throw err;
  }
}

// ======================= QUERIES =======================

// Reusable product fragment
const PRODUCT_FRAGMENT = `
  fragment ProductCard on Product {
    id
    handle
    title
    description
    descriptionHtml
    tags
    productType
    vendor
    availableForSale
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
    }
    featuredImage { url altText width height }
    images(first: 8) {
      edges { node { url altText width height } }
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          availableForSale
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
        }
      }
    }
  }
`;

const PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query Products($country: CountryCode, $language: LanguageCode, $first: Int!, $after: String, $query: String)
    @inContext(country: $country, language: $language) {
    products(first: $first, after: $after, query: $query, sortKey: CREATED_AT, reverse: true) {
      edges {
        cursor
        node { ...ProductCard }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  query ProductByHandle($country: CountryCode, $language: LanguageCode, $handle: String!)
    @inContext(country: $country, language: $language) {
    product(handle: $handle) { ...ProductCard }
  }
`;

export async function getProducts({ first = 24, after = null, query = null } = {}) {
  const data = await shopifyFetch({
    query: PRODUCTS_QUERY,
    variables: { first, after, query },
  });
  return {
    products: data.products.edges.map((e) => e.node),
    pageInfo: data.products.pageInfo,
  };
}

export async function getFeaturedProducts({ first = 6 } = {}) {
  // Featured = products tagged "featured" in Shopify. Fallback to latest if none.
  const tagged = await getProducts({ first, query: "tag:featured" });
  if (tagged.products.length > 0) return tagged.products;
  const all = await getProducts({ first });
  return all.products;
}

export async function getProductByHandle(handle) {
  const data = await shopifyFetch({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });
  return data.product;
}

// ======================= PAGES (Shopify CMS pages) =======================

const PAGES_LIST_QUERY = `
  query Pages($country: CountryCode, $language: LanguageCode, $first: Int!)
    @inContext(country: $country, language: $language) {
    pages(first: $first, sortKey: TITLE) {
      edges {
        node {
          id
          handle
          title
          updatedAt
        }
      }
    }
  }
`;

const PAGE_BY_HANDLE_QUERY = `
  query PageByHandle($country: CountryCode, $language: LanguageCode, $handle: String!)
    @inContext(country: $country, language: $language) {
    page(handle: $handle) {
      id
      handle
      title
      body
      bodySummary
      createdAt
      updatedAt
      seo { title description }
    }
  }
`;

export async function getPages({ first = 50 } = {}) {
  const data = await shopifyFetch({
    query: PAGES_LIST_QUERY,
    variables: { first },
  });
  return data.pages.edges.map((e) => e.node);
}

export async function getPageByHandle(handle) {
  const data = await shopifyFetch({
    query: PAGE_BY_HANDLE_QUERY,
    variables: { handle },
  });
  return data.page;
}

// ======================= CART =======================

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
      totalTaxAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount { amount currencyCode }
            amountPerQuantity { amount currencyCode }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              availableForSale
              price { amount currencyCode }
              image { url altText width height }
              product {
                id
                handle
                title
                featuredImage { url altText }
              }
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartCreate($country: CountryCode, $language: LanguageCode, $input: CartInput!)
    @inContext(country: $country, language: $language) {
    cartCreate(input: $input) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

const CART_QUERY = `
  ${CART_FRAGMENT}
  query Cart($country: CountryCode, $language: LanguageCode, $cartId: ID!)
    @inContext(country: $country, language: $language) {
    cart(id: $cartId) { ...CartFields }
  }
`;

const CART_LINES_ADD_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($country: CountryCode, $language: LanguageCode, $cartId: ID!, $lines: [CartLineInput!]!)
    @inContext(country: $country, language: $language) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($country: CountryCode, $language: LanguageCode, $cartId: ID!, $lines: [CartLineUpdateInput!]!)
    @inContext(country: $country, language: $language) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($country: CountryCode, $language: LanguageCode, $cartId: ID!, $lineIds: [ID!]!)
    @inContext(country: $country, language: $language) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

function handleCartResult(result, mutationKey) {
  const payload = result[mutationKey];
  if (payload.userErrors && payload.userErrors.length > 0) {
    throw new Error(payload.userErrors[0].message);
  }
  return payload.cart;
}

export async function createCart(lines = []) {
  const data = await shopifyFetch({
    query: CART_CREATE_MUTATION,
    variables: { input: { lines } },
  });
  return handleCartResult(data, "cartCreate");
}

export async function getCart(cartId) {
  const data = await shopifyFetch({
    query: CART_QUERY,
    variables: { cartId },
  });
  return data.cart;
}

export async function addCartLines(cartId, lines) {
  const data = await shopifyFetch({
    query: CART_LINES_ADD_MUTATION,
    variables: { cartId, lines },
  });
  return handleCartResult(data, "cartLinesAdd");
}

export async function updateCartLines(cartId, lines) {
  const data = await shopifyFetch({
    query: CART_LINES_UPDATE_MUTATION,
    variables: { cartId, lines },
  });
  return handleCartResult(data, "cartLinesUpdate");
}

export async function removeCartLines(cartId, lineIds) {
  const data = await shopifyFetch({
    query: CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds },
  });
  return handleCartResult(data, "cartLinesRemove");
}

// ======================= HELPERS =======================

export function formatMoney(money) {
  if (!money) return "";
  const { amount, currencyCode } = money;
  const num = parseFloat(amount);
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currencyCode || "EUR",
      minimumFractionDigits: num % 1 === 0 ? 0 : 2,
    }).format(num);
  } catch {
    return `${num.toFixed(2)} ${currencyCode}`;
  }
}

export function getFirstAvailableVariantId(product) {
  if (!product?.variants?.edges) return null;
  const available = product.variants.edges.find((e) => e.node.availableForSale);
  return (available || product.variants.edges[0])?.node?.id || null;
}

export function getProductImages(product) {
  if (!product) return [];
  const imgs = product.images?.edges?.map((e) => e.node) || [];
  if (imgs.length === 0 && product.featuredImage) return [product.featuredImage];
  return imgs;
}
