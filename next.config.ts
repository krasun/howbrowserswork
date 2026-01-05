import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
    // Note: 'output: export' is commented during development to allow middleware
    // Uncomment for production build: output: "export",
    ...(process.env.NODE_ENV === 'production' && { output: "export" }),
    trailingSlash: true,
    turbopack: {
        root: path.join(__dirname),
    },
};

export default withNextIntl(nextConfig);
