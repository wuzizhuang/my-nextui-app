"use client";
import { title } from "@/components/primitives";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import Link from "next/link";

// 定义主要文档分类
import docs from "./docs";

const documentSections = docs.docs;

export default function DocsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className={title()}>文档中心</h1>
        <p className="text-lg text-default-600">
          欢迎使用文档中心，在这里你可以找到所有需要的资源和指南。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documentSections.map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
              <h2 className="text-xl font-bold">{section.title}</h2>
              <p className="text-sm text-default-500 mt-1">
                {section.description}
              </p>
            </CardHeader>
            <CardBody>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-primary hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* 快速入口 */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">快速入口</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardBody>
              <h3 className="text-lg font-semibold mb-2">新手必读</h3>
              <p className="text-default-500 mb-4">
                从这里开始了解项目的基本概念和使用方法。
              </p>
              <Link
                href="/docs/introduction"
                className="text-primary hover:underline"
              >
                查看新手指南 →
              </Link>
            </CardBody>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardBody>
              <h3 className="text-lg font-semibold mb-2">API文档</h3>
              <p className="text-default-500 mb-4">
                详细的API参考文档，帮助你更好地使用项目。
              </p>
              <Link href="/docs/api" className="text-primary hover:underline">
                浏览API文档 →
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}