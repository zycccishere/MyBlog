interface SiteConfig {
	site: string
	author: string
	title: string
	description: string
	lang: string
	ogLocale: string
	shareMessage: string
	paginationSize: number
}

export const siteConfig: SiteConfig = {
	site: 'https://zyccc-blog.vercel.app/', // Write here your website url
	author: 'Zhang Yicheng', // Site author
	title: "Zyccc's Blog", // Site title.
	description: 'Welcome to my blog! I write about my experiences and thoughts.', // Description to display in the meta tags
	lang: 'en-GB',
	ogLocale: 'en_GB',
	shareMessage: 'Share this post', // Message to share a post on social media
	paginationSize: 6 // Number of posts per page
}
