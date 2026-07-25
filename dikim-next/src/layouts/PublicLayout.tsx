import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RouteLoader from '@/components/RouteLoader';
import ScrollToHash from '@/components/ScrollToHash';

export default function PublicLayout() {
  return (
    <>
      <ScrollToHash />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <RouteLoader />
    </>
  );
}
