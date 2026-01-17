/**
 * BENEFITS PAGE
 * 
 * Modern, sleek benefits page with unique design language.
 */

import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Shield, 
  Smartphone, 
  Zap, 
  Users,
  DollarSign,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Rocket
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const Benefits = () => {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => new Set([...prev, index]));
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Increase Revenue',
      description: 'Optimize operations and boost profitability with data-driven insights.',
      details: [
        'Identify top-performing menu items',
        'Optimize pricing strategies',
        'Reduce waste and inefficiencies',
        'Improve table turnover rates',
        'Maximize upselling opportunities'
      ],
      stat: '30% average revenue increase'
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Automate routine tasks and streamline workflows to focus on what matters.',
      details: [
        'Automated inventory tracking',
        'Streamlined order processing',
        'Quick staff scheduling',
        'Instant reporting and analytics',
        'Reduced manual data entry'
      ],
      stat: '50% faster order processing'
    },
    {
      icon: Shield,
      title: 'Reduce Errors',
      description: 'Minimize mistakes with automated calculations and real-time validation.',
      details: [
        'Automated order calculations',
        'Real-time inventory updates',
        'Error prevention systems',
        'Consistent data accuracy',
        'Reduced human error'
      ],
      stat: '90% reduction in order errors'
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description: 'Access your restaurant management system from any device, anywhere.',
      details: [
        'Responsive design for all devices',
        'Mobile-optimized interfaces',
        'Cloud-based accessibility',
        'Real-time synchronization',
        'Offline capability support'
      ],
      stat: 'Access from anywhere, anytime'
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Lightning-fast performance with reliable data persistence and backup.',
      details: [
        'Instant page loads',
        'Real-time data updates',
        'Automatic data backup',
        '99.9% uptime guarantee',
        'Scalable infrastructure'
      ],
      stat: '99.9% uptime guarantee'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Improve coordination between front-of-house, back-of-house, and management.',
      details: [
        'Real-time communication',
        'Shared visibility into operations',
        'Coordinated workflows',
        'Team performance tracking',
        'Unified platform for all roles'
      ],
      stat: 'Improved team efficiency'
    },
    {
      icon: DollarSign,
      title: 'Cost Savings',
      description: 'Reduce operational costs through better inventory management and efficiency.',
      details: [
        'Reduce food waste',
        'Optimize inventory levels',
        'Minimize over-ordering',
        'Lower labor costs',
        'Better resource allocation'
      ],
      stat: '20% reduction in operational costs'
    },
    {
      icon: TrendingUp,
      title: 'Data-Driven Decisions',
      description: 'Make informed decisions with comprehensive analytics and reporting.',
      details: [
        'Real-time business insights',
        'Historical trend analysis',
        'Performance benchmarking',
        'Predictive analytics',
        'Customizable reports'
      ],
      stat: 'Make smarter business decisions'
    },
    {
      icon: Shield,
      title: 'Achieve Goals',
      description: 'Set and track goals to drive continuous improvement and growth.',
      details: [
        'Revenue goal tracking',
        'Sales target monitoring',
        'Team performance goals',
        'Progress visualization',
        'Achievement celebrations'
      ],
      stat: 'Track progress toward goals'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-0">
              <span className="text-2xl font-black tracking-tight text-foreground">
                NEVER
              </span>
              <span className="text-2xl font-black tracking-tight" style={{ color: '#4169E1' }}>
                86
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link to="/benefits" className="text-sm text-foreground">Benefits</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="h-9">Sign In</Button>
              </Link>
              <Link to="/login">
                <Button size="sm" className="h-9">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-12">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground mb-6">
            Why Choose
            <br />
            NEVER86?
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the tangible benefits that help restaurants thrive in today's competitive market.
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const isVisible = visibleCards.has(index);
              const delay = Math.min(index * 0.05, 0.4);
              return (
                <div
                  key={index}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className={`border border-border rounded-lg p-6 hover:border-foreground/20 transition-colors ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${delay}s` }}
                >
                  <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {benefit.description}
                  </p>
                  <div className="mb-4 p-3 rounded-lg border border-border bg-muted/30">
                    <p className="text-sm font-medium text-foreground">
                      {benefit.stat}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {benefit.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Experience These Benefits Today
          </h2>
          <p className="text-base text-muted-foreground mb-8">
            Join restaurants that are already seeing results with NEVER86.
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

export default Benefits;
