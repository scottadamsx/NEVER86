/**
 * LANDING PAGE
 * 
 * Modern, sleek landing page with unique design language.
 * Combines shadcn/ui aesthetics with a distinctive, modern software company feel.
 */

import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Package, 
  Calendar,
  MessageSquare,
  TrendingUp,
  Clock,
  Shield,
  Smartphone,
  Zap,
  CheckCircle,
  ArrowRight,
  LayoutDashboard,
  ClipboardList,
  PieChart,
  DollarSign,
  Trophy,
  Map,
  Settings,
  Sparkles,
  Rocket,
  Target,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const Landing = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const elementRefs = useRef([]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observers = elementRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleElements((prev) => new Set([...prev, index]));
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
  const features = [
    {
      icon: LayoutDashboard,
      title: 'Real-Time Dashboard',
      description: 'Get instant insights into your restaurant operations with live data and key performance indicators.'
    },
    {
      icon: ClipboardList,
      title: 'Order Management',
      description: 'Streamline order taking, kitchen communication, and table management all in one place.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive reporting with revenue trends, server performance, and menu profitability analysis.'
    },
    {
      icon: Users,
      title: 'Staff Management',
      description: 'Schedule shifts, track performance, and manage your team with ease.'
    },
    {
      icon: Package,
      title: 'Inventory Control',
      description: 'Track stock levels, get low-stock alerts, and predict inventory needs automatically.'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Create optimal schedules based on availability, preferences, and business needs.'
    },
    {
      icon: MessageSquare,
      title: 'Team Communication',
      description: 'Built-in chat system for seamless communication between managers, servers, and kitchen staff.'
    },
    {
      icon: PieChart,
      title: 'Profitability Analysis',
      description: 'Identify your most profitable menu items and optimize your pricing strategy.'
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Increase Revenue',
      description: 'Optimize operations and boost profitability with data-driven insights.'
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Automate routine tasks and streamline workflows to focus on what matters.'
    },
    {
      icon: Shield,
      title: 'Reduce Errors',
      description: 'Minimize mistakes with automated calculations and real-time validation.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description: 'Access your restaurant management system from any device, anywhere.'
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Lightning-fast performance with reliable data persistence and backup.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Improve coordination between front-of-house, back-of-house, and management.'
    }
  ];

  const roleFeatures = [
    {
      role: 'Manager',
      color: 'from-blue-600 via-indigo-600 to-purple-600',
      icon: LayoutDashboard,
      features: [
        'Complete operational overview',
        'Advanced analytics & reporting',
        'Staff scheduling & management',
        'Inventory tracking & alerts',
        'Menu management & pricing',
        'Revenue & profitability analysis'
      ]
    },
    {
      role: 'Server',
      color: 'from-emerald-500 via-teal-500 to-cyan-500',
      icon: ClipboardList,
      features: [
        'Quick table management',
        'Easy order taking',
        'Personal performance stats',
        'Server competitions & leaderboards',
        'Real-time kitchen communication',
        'Efficient bill processing'
      ]
    },
    {
      role: 'Kitchen',
      color: 'from-orange-500 via-red-500 to-pink-500',
      icon: Package,
      features: [
        'Order queue management',
        'Kitchen ticket system',
        'Inventory visibility',
        'Team communication',
        'Order status tracking',
        'Preparation time optimization'
      ]
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
              <Link to="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link to="/benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Benefits
              </Link>
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
      <section className="pt-32 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-foreground">
            Run Your Restaurant
            <br />
            Like Never Before
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            The all-in-one restaurant management system that streamlines operations, 
            boosts efficiency, and drives profitability.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-20">
            <Link to="/login">
              <Button size="lg" className="h-11 px-6">
                Start Free Trial
              </Button>
            </Link>
            <Link to="#features">
              <Button variant="outline" size="lg" className="h-11 px-6">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-border">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-foreground mb-1">50%</div>
              <div className="text-sm text-muted-foreground">Faster Order Processing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-foreground mb-1">30%</div>
              <div className="text-sm text-muted-foreground">Revenue Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-foreground mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">System Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you manage every aspect of your restaurant operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isVisible = visibleElements.has(index);
              const delay = Math.min(index * 0.05, 0.4);
              return (
                <div
                  key={index}
                  ref={(el) => (elementRefs.current[index] = el)}
                  className={`border border-border rounded-lg p-6 hover:border-foreground/20 transition-colors ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${delay}s` }}
                >
                  <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Role-Based Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
              Customized for Your Team
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-8">
              Customized interfaces designed specifically for managers, servers, and kitchen staff.
            </p>
            <Link to="/features">
              <Button variant="outline" size="lg" className="h-11 px-6">
                Explore All Features
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roleFeatures.map((role, index) => {
              const Icon = role.icon;
              const cardIndex = features.length + index;
              const isVisible = visibleElements.has(cardIndex);
              const delay = Math.min((features.length + index) * 0.05, 0.4);
              return (
                <div
                  key={index}
                  ref={(el) => (elementRefs.current[cardIndex] = el)}
                  className={`border border-border rounded-lg p-8 hover:border-foreground/20 transition-colors ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${delay}s` }}
                >
                  <div className="w-12 h-12 rounded-lg border border-border flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {role.role}
                  </h3>
                  <ul className="space-y-3 mb-6">
                    {role.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/features">
                    <Button variant="ghost" size="sm" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
              Why Choose NEVER86?
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Experience the benefits that help restaurants thrive in today's competitive market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const benefitIndex = features.length + roleFeatures.length + index;
              const isVisible = visibleElements.has(benefitIndex);
              const delay = Math.min((features.length + roleFeatures.length + index) * 0.05, 0.4);
              return (
                <div 
                  key={index}
                  ref={(el) => (elementRefs.current[benefitIndex] = el)}
                  className={`flex gap-4 p-6 border border-border rounded-lg hover:border-foreground/20 transition-colors ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${delay}s` }}
                >
                  <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
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
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-base text-muted-foreground mb-8">
            Join restaurants that are already using NEVER86 to streamline operations and increase profitability.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login">
              <Button size="lg" className="h-11 px-6">
                Start Free Trial
              </Button>
            </Link>
            <Link to="#features">
              <Button variant="outline" size="lg" className="h-11 px-6">
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-0 mb-4">
                <span className="text-2xl font-black text-foreground">
                  NEVER
                </span>
                <span className="text-2xl font-black" style={{ color: '#4169E1' }}>
                  86
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                The complete restaurant management solution for modern establishments.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link to="/benefits" className="text-muted-foreground hover:text-foreground">Benefits</Link></li>
                <li><Link to="/manager" className="text-muted-foreground hover:text-foreground">For Managers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">API</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 NEVER86. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
