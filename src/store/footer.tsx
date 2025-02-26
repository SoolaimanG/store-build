import { Facebook, Github, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { useStoreBuildState } from ".";
import Logo from "@/components/logo";
import { menu } from "@/constants";

export default function StoreFooter() {
  const { currentStore } = useStoreBuildState();

  return (
    <footer className="dark:bg-white bg-slate-900 text-white dark:text-slate-900 py-16 flex flex-col items-center gap-12">
      {/* Navigation Links */}
      <nav className="flex gap-8 flex-wrap items-center justify-center">
        {menu(currentStore?.storeCode!).map((m, idx) => (
          <Link
            key={idx}
            to={m.path}
            className="hover:text-gray-300 transition-colors"
          >
            {m.name}
          </Link>
        ))}
      </nav>

      {/* Social Media Icons */}
      <div className="flex gap-6">
        <Link to="#" className="hover:text-gray-300 transition-colors">
          <Facebook className="h-6 w-6" />
          <span className="sr-only">Facebook</span>
        </Link>
        <Link to="#" className="hover:text-gray-300 transition-colors">
          <Instagram className="h-6 w-6" />
          <span className="sr-only">Instagram</span>
        </Link>
        <Link to="#" className="hover:text-gray-300 transition-colors">
          <svg
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="sr-only">Twitter</span>
        </Link>
        <Link to="#" className="hover:text-gray-300 transition-colors">
          <Github className="h-6 w-6" />
          <span className="sr-only">GitHub</span>
        </Link>
        <Link to="#" className="hover:text-gray-300 transition-colors">
          <Youtube className="h-6 w-6" />
          <span className="sr-only">YouTube</span>
        </Link>
      </div>

      {/* Copyright */}
      <div className="text-sm">
        © {new Date().getFullYear()} {currentStore?.storeName}, Inc. All rights
        reserved.
      </div>
      <div>
        <Link to={"/"} className="text-xs text-primary">
          Create By <Logo />
        </Link>
      </div>
    </footer>
  );
}
