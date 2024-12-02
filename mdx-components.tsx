"use client";

import type { MDXComponents } from 'mdx/types';
import { Link } from '@nextui-org/react';

// 自定义 MDX 组件
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 使用默认组件
    ...components,
    // 自定义标题样式
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mb-6 text-foreground">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold mb-4 mt-8 text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mb-3 mt-6 text-foreground">{children}</h3>
    ),
    // 自定义段落样式
    p: ({ children }) => (
      <p className="text-base leading-relaxed mb-4 text-foreground-600">{children}</p>
    ),
    // 自定义列表样式
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-foreground-600">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground-600">{children}</ol>
    ),
    // 自定义链接样式
    a: ({ href, children }) => (
      <Link href={href} className="text-primary hover:underline">
        {children}
      </Link>
    ),
    // 自定义代码块样式
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 rounded-md bg-default-100 text-code font-mono text-sm">
        {children}
      </code>
    ),
    // 自定义引用样式
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4">
        {children}
      </blockquote>
    ),
    // 自定义表格样式
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full divide-y divide-default-300">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground-700 bg-default-100">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-sm text-foreground-600 border-t border-default-200">
        {children}
      </td>
    ),
    // 自定义分割线样式
    hr: () => <hr className="my-8 border-t border-default-300" />,
  };
}