const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../app');

const routes = [
    // Auth
    { dir: 'login', component: '@/components/pages/auth/Login' },
    { dir: 'signup', component: '@/components/pages/auth/Signup' },

    // Merchant Dashboard and its Layout
    { dir: 'merchant', layout: '@/components/pages/merchant/MerchantLayout', component: '@/components/pages/merchant/Dashboard' },
    { dir: 'merchant/orders', component: '@/components/pages/merchant/Orders' },
    { dir: 'merchant/orders/[id]', component: '@/components/pages/merchant/OrderDetails' },
    { dir: 'merchant/products', component: '@/components/pages/merchant/Products' },
    { dir: 'merchant/products/new', component: '@/components/pages/merchant/ProductEditor' },
    { dir: 'merchant/products/[id]', component: '@/components/pages/merchant/ProductEditor' },
    { dir: 'merchant/customers', component: '@/components/pages/merchant/Customers' },
    { dir: 'merchant/customers/[id]', component: '@/components/pages/merchant/CustomerProfile' },
    { dir: 'merchant/analytics', component: '@/components/pages/merchant/Analytics' },
    { dir: 'merchant/marketing', component: '@/components/pages/merchant/Marketing' },
    { dir: 'merchant/marketing/coupons', component: '@/components/pages/merchant/Coupons' },
    { dir: 'merchant/marketing/abandoned-cart', component: '@/components/pages/merchant/AbandonedCart' },
    { dir: 'merchant/page-builder', component: '@/components/pages/merchant/PageBuilder' },
    { dir: 'merchant/themes', component: '@/components/pages/merchant/Themes' },
    { dir: 'merchant/apps', component: '@/components/pages/merchant/Apps' },
    { dir: 'merchant/settings', component: '@/components/pages/merchant/Settings' },
    { dir: 'merchant/team', component: '@/components/pages/merchant/Team' },
    { dir: 'merchant/billing', component: '@/components/pages/merchant/Billing' },
    { dir: 'merchant/support', component: '@/components/pages/merchant/Support' },

    // Super Admin
    { dir: 'superadmin', layout: '@/components/pages/superadmin/SuperAdminLayout', component: '@/components/pages/superadmin/Dashboard' },
    { dir: 'superadmin/stores', component: '@/components/pages/superadmin/StoresManagement' },
    { dir: 'superadmin/merchants', component: '@/components/pages/superadmin/MerchantsManagement' },
    { dir: 'superadmin/plans', component: '@/components/pages/superadmin/PlansManagement' },
    { dir: 'superadmin/themes', component: '@/components/pages/superadmin/ThemesMarketplace' },
    { dir: 'superadmin/apps', component: '@/components/pages/superadmin/AppsMarketplace' },
    { dir: 'superadmin/revenue', component: '@/components/pages/superadmin/PlatformRevenue' },
    { dir: 'superadmin/tickets', component: '@/components/pages/superadmin/SupportTickets' },
    { dir: 'superadmin/logs', component: '@/components/pages/superadmin/SystemLogs' },
    { dir: 'superadmin/settings', component: '@/components/pages/superadmin/PlatformSettings' },

    // Storefront
    { dir: 'store', layout: '@/components/pages/storefront/StorefrontLayout', component: '@/components/pages/storefront/Home' },
    { dir: 'store/collection/[slug]', component: '@/components/pages/storefront/Collection' },
    { dir: 'store/product/[slug]', component: '@/components/pages/storefront/Product' },
    { dir: 'store/cart', component: '@/components/pages/storefront/Cart' },
    { dir: 'store/checkout', component: '@/components/pages/storefront/Checkout' },
    { dir: 'store/account', component: '@/components/pages/storefront/Account' },
    { dir: 'store/blog', component: '@/components/pages/storefront/Blog' },
    { dir: 'store/contact', component: '@/components/pages/storefront/Contact' }
];

function generateRoute(route) {
    const routePath = path.join(appDir, route.dir);

    if (!fs.existsSync(routePath)) {
        fs.mkdirSync(routePath, { recursive: true });
    }

    // Create layout if specified
    if (route.layout) {
        const layoutContent = `"use client";\n\nimport Layout from "${route.layout}";\n\nexport default function RouteLayout({ children }: { children: React.ReactNode }) {\n  return <Layout>{children}</Layout>;\n}\n`;
        fs.writeFileSync(path.join(routePath, 'layout.tsx'), layoutContent);
    }

    // Create page
    if (route.component) {
        const isDynamic = route.dir.includes('[');
        let paramsProp = '';

        // In Next.js 15 App router, params is passed as a promise for dynamic routes (or object in Next 13/14). We'll assume standard page structure.
        // For simplicity, we just import the Vite component. Vite components might read from React Router hooks like useParams, so we'll need to handle that later.
        const pageContent = `"use client";\n\nimport Page from "${route.component}";\n\nexport default function RoutePage() {\n  return <Page />;\n}\n`;
        const dest = path.join(routePath, 'page.tsx');
        if (!fs.existsSync(dest) || route.dir !== '') { // Don't overwrite exact root page
            fs.writeFileSync(dest, pageContent);
        }
    }
}

routes.forEach(generateRoute);
console.log('Finished generating routes.');
