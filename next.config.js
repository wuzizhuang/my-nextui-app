const withMDX = require('@next/mdx')({
    options: {
      remarkPlugins: [],
      rehypePlugins: [],
      // 如果你需要使用 frontmatter，添加以下配置
      providerImportSource: "@mdx-js/react",
    },
  })
  
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  };
  
  module.exports = withMDX(nextConfig)