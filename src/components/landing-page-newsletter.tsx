import { CalendarDaysIcon, HandshakeIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FadeInWhenVisible } from "./fade-in-when-visible";
import { NewsLetterButton } from "./news-letter-btn";
import { useState } from "react";

export default function LandingPageNewsLetter() {
  const [email, setEmail] = useState("");
  return (
    <div className="relative rounded-lg isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <FadeInWhenVisible>
            <div className="max-w-xl lg:max-w-lg">
              <h2 className="text-4xl font-semibold tracking-tight text-white">
                Subscribe to our newsletter
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                Nostrud amet eu ullamco nisi aute in ad minim nostrud
                adipisicing velit quis. Duis tempor incididunt dolore.
              </p>
              <div className="mt-6 flex max-w-md gap-x-2">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="text-white placeholder:text-white h-10 w-[100%]"
                />
                <NewsLetterButton email={email}>
                  <Button
                    size="sm"
                    type="submit"
                    variant="gooeyRight"
                    className="h-10"
                  >
                    Subscribe
                  </Button>
                </NewsLetterButton>
              </div>
            </div>
          </FadeInWhenVisible>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <FadeInWhenVisible delay={0.2}>
              <div className="flex flex-col items-start">
                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                  <CalendarDaysIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-white"
                  />
                </div>
                <dt className="mt-4 text-base font-semibold text-white">
                  Business Tips
                </dt>
                <dd className="mt-2 text-base/7 text-gray-400">
                  Get curated tips on ecommerce, business, and tech to grow your
                  online store.
                </dd>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.4}>
              <div className="flex flex-col items-start">
                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                  <HandshakeIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-white"
                  />
                </div>
                <dt className="mt-4 text-base font-semibold text-white">
                  No Spam, Only Value
                </dt>
                <dd className="mt-2 text-base/7 text-gray-400">
                  We respect your inbox—only quality insights, no spam, to
                  support your business success.
                </dd>
              </div>
            </FadeInWhenVisible>
          </dl>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-primary opacity-30"
        />
      </div>
    </div>
  );
}
