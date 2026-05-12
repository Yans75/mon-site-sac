// Shopify Storefront API GraphQL client
// Docs: https://shopify.dev/docs/api/storefront

const DOMAIN = process.env.REACT_APP_SHOPIFY_DOMAIN;
const TOKEN = process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = process.env.REACT_APP_SHOPIFY_API_VERSION || "2025-07";
const COUNTRY = process.env.REACT_APP_SHOPIFY_COUNTRY || "FR";
const LANGUAGE = process.env.REACT_APP_SHOPIFY_LANGUAGE || "FR";

const ENDPOINT = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;
// Used only for fields not yet available in stable API (e.g., legalNotice for France/EU compliance).
const ENDPOINT_UNSTABLE = `https://${DOMAIN}/api/unstable/graphql.json`;

/**
 * Low-level GraphQL fetcher.
 * Automatically prepends @inContext(country: FR, language: FR) parameters via query variables.
 */
export async function shopifyFetch({ query, variables = {}, endpoint = ENDPOINT }) {
  if (!DOMAIN || !TOKEN) {
    throw new Error(
      "Shopify config missing. Check REACT_APP_SHOPIFY_DOMAIN and REACT_APP_SHOPIFY_STOREFRONT_TOKEN in .env"
    );
  }

  try {
    const res = await fetch(endpoint, {
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

function shopifyFetchUnstable(args) {
  return shopifyFetch({ ...args, endpoint: ENDPOINT_UNSTABLE });
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

// ======================= SHOP POLICIES (auto-generated legal pages) =======================
// Shopify creates these from Settings -> Policies. They live outside `pages`.

const SHOP_POLICIES_QUERY = `
  query ShopPolicies($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy { id handle title body url }
      refundPolicy { id handle title body url }
      shippingPolicy { id handle title body url }
      termsOfService { id handle title body url }
      subscriptionPolicy { id handle title body url }
    }
  }
`;

// French translation of Shopify's English default policy titles
const POLICY_TITLES_FR = {
  'privacy-policy': 'Politique de Confidentialité',
  'refund-policy': 'Politique de Remboursement',
  'shipping-policy': 'Politique de Livraison',
  'terms-of-service': 'Conditions Générales de Vente',
  'subscription-policy': 'Politique d\u0027Abonnement',
  'legal-notice': 'Mentions Légales',
};

function normalizePolicy(policy) {
  if (!policy) return null;
  return {
    id: policy.id,
    handle: policy.handle,
    title: POLICY_TITLES_FR[policy.handle] || policy.title,
    body: policy.body,
    bodySummary: null,
    updatedAt: null,
    seo: null,
    isPolicy: true,
    externalUrl: policy.url,
  };
}

export async function getShopPolicies() {
  const data = await shopifyFetch({ query: SHOP_POLICIES_QUERY });
  const s = data.shop || {};
  return [
    normalizePolicy(s.termsOfService),
    normalizePolicy(s.refundPolicy),
    normalizePolicy(s.shippingPolicy),
    normalizePolicy(s.privacyPolicy),
    normalizePolicy(s.subscriptionPolicy),
  ].filter(Boolean);
}

// Legal Notice (French/EU "Mentions légales") is only exposed on the `unstable` Storefront API for now.
// Wrapped in try/catch so it fails gracefully if Shopify removes/renames the field.
const LEGAL_NOTICE_QUERY = `
  query LegalNotice($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      legalNotice { id handle title body url }
    }
  }
`;

export async function getLegalNotice() {
  try {
    const data = await shopifyFetchUnstable({ query: LEGAL_NOTICE_QUERY });
    return normalizePolicy(data?.shop?.legalNotice);
  } catch (err) {
    console.warn("Legal notice fetch failed (unstable API):", err?.message);
    return null;
  }
}

/**
 * Returns ALL information pages (custom pages + shop policies + legal notice) merged.
 * Used by the footer and as a single source of truth for legal content.
 */
export async function getAllInformationPages() {
  const [pages, policies, legalNotice] = await Promise.all([
    getPages({ first: 50 }).catch(() => []),
    getShopPolicies().catch(() => []),
    getLegalNotice().catch(() => null),
  ]);
  // Custom pages first, then policies (with legal notice prepended). Filter out "contact" route.
  const visiblePages = pages
    .filter((p) => p.handle !== 'contact' && !/^contact$/i.test(p.title))
    .map((p) => ({ ...p, isPolicy: false }));
  const allPolicies = legalNotice ? [legalNotice, ...policies] : policies;
  return [...visiblePages, ...allPolicies];
}

/**
 * Resolve a handle to either a custom page, a shop policy, or the legal notice.
 */
export async function getInformationPageByHandle(handle) {
  // Try custom page first
  try {
    const page = await getPageByHandle(handle);
    if (page) return { ...page, isPolicy: false };
  } catch {
    /* ignore, fall through to policies */
  }
  // Try legal notice (unstable API)
  if (handle === 'legal-notice' || handle === 'mentions-legales') {
    const ln = await getLegalNotice();
    if (ln) return ln;
  }
  // Fall back to standard policies
  const policies = await getShopPolicies();
  return policies.find((p) => p.handle === handle) || null;
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
