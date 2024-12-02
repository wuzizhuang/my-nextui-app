const docs = [
    {
        title: "入门指南",
        description: "快速了解项目并开始使用",
        links: [
          { name: "介绍", href: "/docs/introduction" },
          { name: "快速开始", href: "/docs/introduction/getting-started" },
          { name: "安装指南", href: "/docs/guides/installation" },
        ],
      },
      {
        title: "核心概念",
        description: "了解项目的核心概念和功能",
        links: [
          { name: "基础功能", href: "/docs/features" },
          { name: "高级特性", href: "/docs/features/advanced" },
          { name: "API参考", href: "/docs/api" },
        ],
      },
      {
        title: "示例教程",
        description: "通过实例学习使用方法",
        links: [
          { name: "基础示例", href: "/docs/examples/basic" },
          { name: "进阶示例", href: "/docs/examples/advanced" },
        ],
      },
]

const sidebarItems = [
    {
        title: "开始",
        items: [
          { name: "介绍", href: "/docs/introduction" },
          { name: "快速开始", href: "/docs/getting-started" },
        ],
      },
      {
        title: "基础",
        items: [
          { name: "安装", href: "/docs/installation" },
          { name: "配置", href: "/docs/configuration" },
        ],
      },
]

export default {docs,sidebarItems};