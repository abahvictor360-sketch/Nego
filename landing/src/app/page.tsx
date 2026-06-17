import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Demo from '@/components/Demo';
import Pricing from '@/components/Pricing';
import Signup from '@/components/Signup';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Demo />
        <Pricing />
        <Signup />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
