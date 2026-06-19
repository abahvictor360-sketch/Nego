import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import { getSiteContent } from '@/lib/content';

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <>
      <Nav />
      <main>
        <Hero content={content.hero} />
        <Features content={content.features} />
        <HowItWorks content={content.how_it_works} />
        <Testimonials />
        <CTA content={content.cta} />
      </main>
      <Footer />
    </>
  );
}
