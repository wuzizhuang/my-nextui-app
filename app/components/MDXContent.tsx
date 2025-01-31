'use client';

import { useMDXComponent } from 'next-contentlayer/hooks';

interface MDXContentProps {
  code: string;
}

export default function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code);

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Component />
    </article>
  );
}