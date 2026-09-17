import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Sanity's asset pipeline already resizes, crops and format-negotiates, so
    // Next hands off URL generation instead of optimizing a second time.
    loader: 'custom',
    loaderFile: './sanity/lib/image-loader.ts',
    qualities: [70, 75, 80, 85, 88],
  },
}

export default nextConfig
