import Link from "next/link";
import { GraduationCap, BookOpen, Mail, MapPin, Phone } from "lucide-react";
import Logo from "../frontend/Logo";

export default function Footer() {
  return (
    <footer className="bg-[#163360] text-white pt-16 pb-8">
      <div className="container px-4 md:px-12 lg:px-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-16">
          <div className="space-y-6">
            <Logo labelShown={true} href="/" />

            <ul className="space-y-2">
              {[
                { name: "Resources", href: "/resources" },
                { name: "Q&A Forum", href: "/qa" },
                { name: "Quizzes", href: "/quizzes" },
                { name: "Dashboard", href: "/dashboard" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-200 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h3
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: "#F4A800" }}
            >
              Information
            </h3>
            <ul className="space-y-2">
              {[
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Privacy Policy", href: "/privacy" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-200 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-blue-800 text-center">
          <p className="text-sm text-blue-300">
            © {new Date().getFullYear()} BusiLearn: Academic Hub. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
