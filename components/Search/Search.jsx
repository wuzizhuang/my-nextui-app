"use client";
import { title } from "@/components/primitives";
import { useEffect, useState } from "react";
import { Card, CardBody, Divider } from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";

export default function DocsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 加载 Google 搜索脚本
    const script = document.createElement('script');
    script.src = `https://cse.google.com/cse.js?cx=d0753b9ad66c34097`;
    script.async = true;
    
    // 监听搜索结果加载完成
    const handleSearchLoaded = () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.target.classList.contains('gsc-results-wrapper-visible')) {
            setIsLoading(false);
          }
        });
      });

      // 开始观察搜索结果容器
      const resultsContainer = document.querySelector('.gcse-searchresults');
      if (resultsContainer) {
        observer.observe(resultsContainer, {
          attributes: true,
          childList: true,
          subtree: true
        });
      }
    };

    script.onload = handleSearchLoaded;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
      <h1 className={title({ color: "blue" })}>站内搜索</h1>
      
      <Card className="w-full max-w-4xl">
        <CardBody>
          <div className="search-container mb-4">
            <div className="gcse-searchbox" 
                 data-buttonText="搜索"
                 data-placeholder="输入关键词搜索..."
                 data-enableAutoComplete="true">
            </div>
          </div>
          
          <Divider className="my-4"/>
          
          <div className="search-results min-h-[400px] relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <Spinner label="加载中..." color="primary" labelColor="primary"/>
              </div>
            )}
            <div className="gcse-searchresults" 
                 data-refinementStyle="link"
                 data-queryParameterName="q">
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}