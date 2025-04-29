import { FeatureListSection } from "@/components/features/section";
import { Footer } from "@/components/footer";
import Logo from "@/components/logo";
import * as FadeIn from "@/components/motion/fade";

export default function Home() {
  return (
    <FadeIn.Container className="flex flex-col gap-6">
      <FadeIn.Item>
        <div className="flex flex-row items-center space-x-3">
          <Logo />
          <div className="flex flex-col font-medium">
            <span className="text-sm">Minimil</span>
            <span className="text-muted-foreground text-xs">
              A sleek and minimal Next.js starter template
            </span>
          </div>
        </div>
      </FadeIn.Item>

      <FadeIn.Item>
        <p className="text-sm leading-relaxed">
          <strong className="font-semibold">Minimil</strong> is a modern,
          lightweight, and high-performance Next.js starter template designed
          for developers who value simplicity and efficiency. With a clean
          architecture and optimized setup, Minimi empowers you to build and
          launch projects quickly while maintaining best practices in code
          quality, styling, and development workflow.
        </p>
      </FadeIn.Item>

      <FadeIn.Item>
        <FeatureListSection />
      </FadeIn.Item>

      <FadeIn.Item>
        <Footer />
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
