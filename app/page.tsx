import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";

import { GithubIcon } from "@/components/icons";
//首页
export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>书山有路&nbsp;</span>
        <span className={title({ color: "violet" })}>勤&nbsp;</span>
        <span className={title()}>为径&nbsp;</span>
        <br />
        <br />
        <span className={title()}>
        &nbsp;&nbsp;&nbsp;&nbsp;学海无涯&nbsp;
        </span>
        <span className={title({ color: "blue" })}>苦&nbsp;</span>
        <span className={title()}>
          作舟
        </span>
        <div className={subtitle({ class: "mt-4" })}>
        “Success is not final, failure is not fatal: It is the courage to continue that counts.”
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={siteConfig.links.docs}
        >
          Documentation
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </div>
    </section>
  );
}
