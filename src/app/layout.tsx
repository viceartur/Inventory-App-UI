import { NavLinks } from "./components/nav-links";
import "./globals.css";

export const metadata = {
  title: "Inventory Management App",
  description: "Manage inventory in the warehouse properly!",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavLinks />
        {children}
      </body>
    </html>
  );
}
