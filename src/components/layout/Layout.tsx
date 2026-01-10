import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  showWatermark?: boolean;
}

const Layout = ({ children, showWatermark = false }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-1">
        {showWatermark && (
          <div className="watermark">
            <svg className="h-96 w-96" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" />
              <text x="50" y="55" textAnchor="middle" fontSize="12" fontWeight="bold">CU</text>
            </svg>
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
