import Nav from './Nav';
import Footer from './Footer';

export default function StaticPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="hero-gradient py-16 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-3">{title}</h1>
            {subtitle && <p className="text-lg text-gray-500 max-w-xl mx-auto">{subtitle}</p>}
          </div>
        </section>
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">{children}</div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Styled prose wrapper for legal/long-form content (no typography plugin needed).
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-gray-600 leading-relaxed space-y-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-1 [&_p]:text-[15px] [&_a]:text-green-600 [&_a]:font-medium hover:[&_a]:text-green-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-[15px]">
      {children}
    </div>
  );
}
