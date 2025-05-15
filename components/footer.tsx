import Link from "next/link"
import { COMPANY, FEATURES, NAV_ITEMS } from "@/lib/constants"
import { Twitter, Github, MessageCircle, Mail, Bitcoin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-300">
                {COMPANY.logo.text}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">{COMPANY.description}</p>
            <div className="flex space-x-4">
              <Link href={COMPANY.social.twitter} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
              <Link href={COMPANY.social.telegram} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MessageCircle className="h-4 w-4" />
                  <span className="sr-only">Telegram</span>
                </Button>
              </Link>
              <Link href={COMPANY.social.github} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-medium mb-4">快速导航</h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-medium mb-4">主要功能</h3>
            <ul className="space-y-2">
              {FEATURES.slice(0, 4).map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {feature.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-medium mb-4">联系我们</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{COMPANY.contact.email}</span>
              </div>
              <p className="text-sm text-muted-foreground">{COMPANY.contact.phone}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">{COMPANY.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
