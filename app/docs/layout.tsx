"use client";

import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import docs from "./docs";

// 文档侧边栏配置
const sidebarItems = docs.sidebarItems;

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 生成面包屑数据
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join('/')}`;
      return { name: path.charAt(0).toUpperCase() + path.slice(1), href };
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 面包屑导航 */}
      <div className="w-full border-b px-6 py-4">
        <Breadcrumbs>
          <BreadcrumbItem>
            <Link href="/">首页</Link>
          </BreadcrumbItem>
          {getBreadcrumbs().map((item, index) => (
            <BreadcrumbItem key={index}>
              <Link href={item.href}>{item.name}</Link>
            </BreadcrumbItem>
          ))}
        </Breadcrumbs>
      </div>

      <div className="flex">
        {/* 侧边栏 */}
        <aside className="w-64 border-r min-h-screen p-4 hidden md:block">
          <nav className="space-y-8">
            {sidebarItems.map((section, index) => (
              <div key={index}>
                <h3 className="font-medium text-sm text-foreground-500 mb-2">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        href={item.href}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          pathname === item.href
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-default-100"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* 主要内容区域 */}
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8 max-w-4xl">
            {/* 移动端目录按钮 */}
            <button className="md:hidden mb-4 px-4 py-2 rounded-lg bg-default-100 text-sm">
              显示目录
            </button>

            {/* 文档内容 */}
            <article className="prose prose-gray max-w-none">
              {children}
            </article>

            {/* 上一页/下一页导航 */}
            <div className="mt-12 flex items-center justify-between pt-4 border-t">
              <Link
                href="#"
                className="text-sm text-default-600 hover:text-primary"
              >
                ← 上一页
              </Link>
              <Link
                href="#"
                className="text-sm text-default-600 hover:text-primary"
              >
                下一页 →
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}