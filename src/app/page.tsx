import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users, 
  Shield, 
  BarChart3,
  ArrowRight,
  Mail,
  Github,
  Twitter,
  LogIn
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <Link href="/" className="flex items-center shrink-0">
          <span className="text-2xl font-bold">HR</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide flex-1 justify-center mx-4">
          <div className="flex gap-4 sm:gap-6 min-w-max">
            <Link
              href="/features"
              className="text-sm font-medium hover:underline underline-offset-4 whitespace-nowrap"
            >
              Features
            </Link>
            <Link
              href="/tutorial"
              className="text-sm font-medium hover:underline underline-offset-4 whitespace-nowrap"
            >
              How it works
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium hover:underline underline-offset-4 whitespace-nowrap"
            >
              Pricing
            </Link>
          </div>
        </nav>
        <div className="flex gap-2 sm:gap-4 shrink-0 items-center">
          <ThemeToggle />
          <SignedOut>
            <SignInButton mode="modal">
              <Button 
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 font-semibold group"
                size="default"
              >
                <LogIn className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <main>
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl  font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Effortless Time Off Management
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Streamline your company&apos;s time off requests, approvals,
                    and tracking all in one place.
                  </p>
                </div>
                <div className="flex flex-col  md:justify-center  gap-2 min-[400px]:flex-row">
                  <Button asChild>
                    <Link href="/sign-up">Get Started</Link>
                  </Button>
                  <Button variant={"outline"} asChild>
                    <Link href="/features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full  overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src="/dashboard-screenshot.svg"
                    alt="Dashboard screenshot"
                    width={600}
                    height={400}
                    priority
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/20 to-transparent h-8">
                    <div className="flex items-center gap-2 px-4 py-2">
                      <div className="bg-red-500 w-2 h-2 rounded-full" />
                      <div className="bg-yellow-500 w-2 h-2 rounded-full" />
                      <div className="bg-green-500 w-2 h-2 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Key Features
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Everything you need to manage your time off requests,
                  approvals, and tracking all in one place.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col justify-center space-y-4">
                    <Calendar className="w-10 h-10 text-primary" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">
                        Easy Request Submission
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Employees can submit time off requests directly through
                        the platform with just a few clicks.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col justify-center space-y-4">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">
                        Quick Approvals
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Managers can review and approve requests instantly with
                        real-time notifications.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col justify-center space-y-4">
                    <BarChart3 className="w-10 h-10 text-primary" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">
                        Analytics & Insights
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Track time off trends, balance remaining, and generate
                        comprehensive reports.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center text-center space-y-2">
                <Users className="w-12 h-12 text-primary mb-4" />
                <div className="text-4xl font-bold">100+</div>
                <p className="text-gray-500 dark:text-gray-400">
                  Companies Trust Us
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <Clock className="w-12 h-12 text-primary mb-4" />
                <div className="text-4xl font-bold">50K+</div>
                <p className="text-gray-500 dark:text-gray-400">
                  Requests Processed
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <div className="text-4xl font-bold">99.9%</div>
                <p className="text-gray-500 dark:text-gray-400">
                  Uptime Guarantee
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Get Started?
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join thousands of companies managing their time off efficiently.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/sign-up">
                    Get Started Free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-4 lg:gap-12">
            <div className="space-y-4">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold">HR</span>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Effortless time off management for modern companies.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/features"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tutorial"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    How it works
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 HR App. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://twitter.com"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://github.com"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:support@hr-app.com"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
