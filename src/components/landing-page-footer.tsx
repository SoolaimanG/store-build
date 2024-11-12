import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { NewsLetterButton } from "./news-letter-btn";
import { appConfig } from "@/lib/utils";

export default function LandingPageFooter() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[#0a0f1a] text-gray-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              Subscribe to our newsletter
            </h2>
            <p className="text-lg text-gray-400">
              The latest news, articles, and resources, sent to your inbox
              weekly.
            </p>
          </div>
          <form className="flex gap-3 w-full">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
              required
            />
            <NewsLetterButton email={email} className="w-fit">
              <Button
                type="button"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6"
              >
                Subscribe
              </Button>
            </NewsLetterButton>
          </form>
        </div>

        <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400">
            © 2024 {appConfig.name}, Inc. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link
              to="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </Link>
            <Link
              to="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </Link>
            <Link
              to="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="X (formerly Twitter)"
            >
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
