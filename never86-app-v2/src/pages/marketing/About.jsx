import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const About = () => {
  const coreValues = [
    {
      title: 'Industry Expertise',
      description: 'Built by someone who has worked in every role, from dishwasher to manager, understanding the real challenges restaurants face.'
    },
    {
      title: 'Simplicity First',
      description: 'Complex problems deserve simple solutions. We eliminate unnecessary steps and focus on what actually matters.'
    },
    {
      title: 'Empowerment',
      description: 'Every team member deserves tools that make their job easier, not harder. We build for the people on the floor.'
    },
    {
      title: 'Innovation',
      description: 'We continuously evolve based on real feedback from real restaurants, staying ahead of industry needs.'
    },
    {
      title: 'Reliability',
      description: 'Restaurants run 24/7. Our system needs to work when you need it most, without excuses.'
    },
    {
      title: 'Community',
      description: 'We\'re not just software—we\'re partners in your success, committed to helping restaurants thrive.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-0">
              <span className="text-2xl font-black text-foreground">
                NEVER
              </span>
              <span className="text-2xl font-black" style={{ color: '#4169E1' }}>
                86
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link to="/benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Benefits</Link>
              <Link to="/about" className="text-sm text-foreground">About</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="hidden xs:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link to="/login">
                <Button className="h-9 px-4">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 sm:mb-12">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground mb-4 sm:mb-6">
            About NEVER86
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Built by restaurant people, for restaurant people. We understand the industry because we've lived it.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image */}
            <div className="order-2 md:order-1">
              <div className="aspect-square rounded-lg bg-muted border border-border overflow-hidden relative">
                <img 
                  src="/scott-adams.jpg" 
                  alt="Scott Adams, Founder of NEVER86" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.target.style.display = 'none';
                    const placeholder = e.target.nextElementSibling;
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                      placeholder.classList.remove('hidden');
                    }
                  }}
                />
                {/* Placeholder - only shows if image fails to load */}
                <div className="absolute inset-0 text-center p-8 items-center justify-center flex-col hidden" style={{ display: 'none', backgroundColor: 'hsl(var(--muted))' }}>
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-4xl font-black text-primary">SA</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Scott Adams</p>
                  <p className="text-xs text-muted-foreground mt-1">Founder & CEO</p>
                </div>
              </div>
            </div>

            {/* Story Content */}
            <div className="order-1 md:order-2 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-4">
                  Our Story
                </h2>
                <div className="space-y-4 text-base text-muted-foreground">
                  <p>
                    NEVER86 was born from real experience in the trenches. I'm Scott Adams, and I dropped out of engineering school to work in restaurants across Canada. From coast to coast, I worked every position—dishwasher, line cook, server, bartender, expo, and manager.
                  </p>
                  <p>
                    I saw what worked and what didn't. I watched great systems fail and terrible processes persist. I became an industry expert not through theory, but through thousands of shifts, countless rushes, and solving problems on the fly.
                  </p>
                  <p>
                    When I came back home to St. John's, I knew there had to be a better way. The restaurant industry deserved technology that actually understood the chaos, the pace, and the people who make it all happen.
                  </p>
                  <p>
                    So I built NEVER86—a system that solves the real problems I experienced. It's designed to make life easier for managers, servers, chefs, expos, and everyone who keeps a restaurant running. Because when you've lived it, you know exactly what needs to be fixed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we build and every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-6 hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
                  <h3 className="text-lg font-semibold text-foreground">
                    {value.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-6">
            Our Mission
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            To empower restaurants with technology that actually works. We're not building software for the boardroom—we're building tools for the people who make restaurants run, every single day.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Ready to Experience the Difference?
          </h2>
          <p className="text-base text-muted-foreground mb-8">
            Join restaurants across Canada who trust NEVER86 to run their operations.
          </p>
          <Link to="/login">
            <Button size="lg" className="h-11 px-6">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-0 mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl font-black text-foreground">
                  NEVER
                </span>
                <span className="text-xl sm:text-2xl font-black" style={{ color: '#4169E1' }}>
                  86
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                The complete restaurant management solution for modern establishments.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-xs sm:text-sm">Product</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/benefits" className="text-muted-foreground hover:text-foreground transition-colors">Benefits</Link></li>
                <li><Link to="/manager" className="text-muted-foreground hover:text-foreground transition-colors">For Managers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-xs sm:text-sm">Company</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Support</a></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-xs sm:text-sm">Resources</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">API</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
            <p>&copy; 2026 NEVER86. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
