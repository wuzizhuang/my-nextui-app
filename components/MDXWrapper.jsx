'use client';

import { MDXProvider } from '@mdx-js/react';

const components = {
  h1: props => (
    <h1 
      className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl"
      {...props}
    />
  ),
  h2: props => (
    <h2 
      className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
      {...props}
    />
  ),
  h3: props => (
    <h3 
      className="scroll-m-20 text-2xl font-semibold tracking-tight"
      {...props}
    />
  ),
  p: props => (
    <p 
      className="leading-7 [&:not(:first-child)]:mt-6" 
      {...props}
    />
  ),
  ul: props => (
    <ul 
      className="my-6 ml-6 list-disc [&>li]:mt-2" 
      {...props}
    />
  ),
  ol: props => (
    <ol 
      className="my-6 ml-6 list-decimal [&>li]:mt-2" 
      {...props}
    />
  ),
  li: props => (
    <li 
      className="mt-2" 
      {...props}
    />
  ),
  blockquote: props => (
    <blockquote 
      className="mt-6 border-l-2 border-slate-300 pl-6 italic text-slate-800 dark:border-slate-600 dark:text-slate-200" 
      {...props}
    />
  ),
  code: props => (
    <code 
      className="relative rounded bg-slate-100 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-100" 
      {...props}
    />
  ),
  pre: props => (
    <pre 
      className="mb-4 mt-6 overflow-x-auto rounded-lg bg-slate-900 p-4" 
      {...props}
    />
  ),
  a: props => (
    <a 
      className="font-medium text-slate-900 underline underline-offset-4 dark:text-slate-100" 
      {...props}
    />
  ),
};

export function MDXWrapper({ children }) {
  return (
    <MDXProvider components={components}>
      {children}
    </MDXProvider>
  );
}