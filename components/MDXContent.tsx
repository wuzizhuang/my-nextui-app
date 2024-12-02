import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { MDXRemote } from 'next-mdx-remote';

const components = {
  h1: (props: any) => (
    <h1 className="text-3xl font-bold tracking-tight mb-6" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4" {...props} />
  ),
  p: (props: any) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
  ),
  ul: (props: any) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
  ),
  code: (props: any) => (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm" {...props} />
  ),
};

interface MDXContentProps {
  title?: string;
  source: any;
}

const MDXContent = ({ title, source }: MDXContentProps) => {
  return (
    <Card className="w-full">
      {title && (
        <>
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">{title}</p>
            </div>
          </CardHeader>
          <Divider/>
        </>
      )}
      <CardBody className="prose prose-slate dark:prose-invert max-w-none">
        <MDXRemote {...source} components={components} />
      </CardBody>
    </Card>
  );
};

export default MDXContent;