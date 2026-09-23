import { StubPage, stubMetadata } from "@/components/site/stub-page";

export const metadata = stubMetadata("about");

export default function Page() {
  return <StubPage page="about" />;
}
