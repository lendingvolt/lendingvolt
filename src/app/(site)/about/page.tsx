import type { Metadata } from "next";
import { about } from "@/content/about";
import {
  AboutContact,
  AboutLenders,
  AboutPaid,
  AboutPrinciples,
  AboutStory,
} from "@/components/about/about-sections";
import { ToolHero } from "@/components/tools/tool-hero";

export const metadata: Metadata = about.metadata;

export default function AboutPage() {
  return (
    <>
      <ToolHero {...about.hero} scene="circuit" />
      <AboutStory />
      <AboutPaid />
      <AboutLenders />
      <AboutPrinciples />
      <AboutContact />
    </>
  );
}
