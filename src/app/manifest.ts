import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Princess Wishlist',
        short_name: 'Wishlist',
        description: 'Danh sách quà tặng đáng yêu dành cho công chúa nhỏ.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#fbcfe8',
        icons: [
            {
                src: '/in-love.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/in-love.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
