"use client";
import ReactMarkdown from 'react-markdown';

export default function IntroductionPage() {
  const markdown = `
    # 标题
    这是一段**加粗**的文字。
    
    * 列表项1
    * 列表项2
  `;
  return (
    <ReactMarkdown>{markdown}</ReactMarkdown>
  );
}