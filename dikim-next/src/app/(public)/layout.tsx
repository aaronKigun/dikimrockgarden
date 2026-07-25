import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RouteLoader from '@/components/RouteLoader';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <RouteLoader />
    </>
  );
}
