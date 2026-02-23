import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist'],
  // Force-include pdfjs-dist worker in Vercel deployments.
  // Output file tracing follows static imports only — the worker is
  // loaded via a file:// URL string at runtime so the tracer misses it.
  outputFileTracingIncludes: {
    '/api/summarize': ['./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs'],
  },
};

export default nextConfig;
