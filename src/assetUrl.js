// Keep public assets working both locally and under a GitHub Pages project path.
export const assetUrl = path => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
