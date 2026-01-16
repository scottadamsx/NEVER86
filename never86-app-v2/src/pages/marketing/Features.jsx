/**
 * FEATURES PAGE
 * 
 * Unified features page with tabs for Managers, Servers, and Kitchen.
 * Showcases why each role loves NEVER86.
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  BarChart3, 
  Users, 
  Package, 
  Calendar,
  MessageSquare,
  PieChart,
  TrendingUp,
  Clock,
  Shield,
  Smartphone,
  Zap,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Rocket,
  Target,
  User,
  ChefHat,
  UtensilsCrossed,
  Map,
  Settings,
  Bell,
  Trophy,
  DollarSign
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const Features = () => {
  const [activeTab, setActiveTab] = useState('managers');
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    // Reset visibility when tab changes
    setVisibleCards(new Set());
    cardRefs.current = [];
    
    // Small delay to allow DOM to update
    const timeoutId = setTimeout(() => {
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
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeTab]);

  const managerFeatures = [
    {
      icon: LayoutDashboard,
      title: 'Complete Operational Overview',
      description: 'Get a real-time view of your entire restaurant operation from one central dashboard.',
      benefits: [
        'Live operational metrics',
        'Key performance indicators',
        'Recent activity monitoring',
        'Quick action access',
        'Customizable widgets'
      ]
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics & Reporting',
      description: 'Comprehensive reporting with revenue trends, server performance, and menu profitability.',
      benefits: [
        'Revenue and sales analytics',
        'Server performance metrics',
        'Menu item profitability',
        'Period-over-period comparisons',
        'CSV export functionality'
      ]
    },
    {
      icon: Users,
      title: 'Staff Management',
      description: 'Manage your team with scheduling, performance tracking, and availability management.',
      benefits: [
        'Staff roster management',
        'Performance tracking',
        'Role assignment',
        'Availability management',
        'Time-off request handling'
      ]
    },
    {
      icon: Package,
      title: 'Inventory Control',
      description: 'Track stock levels, get alerts, and predict inventory needs automatically.',
      benefits: [
        'Real-time stock tracking',
        'Low stock alerts',
        'Reorder queue management',
        'Usage predictions',
        'Inventory history'
      ]
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Create optimal schedules based on availability, preferences, and business needs.',
      benefits: [
        'Shift scheduling',
        'Availability management',
        'Conflict detection',
        'Auto-scheduling options',
        'Schedule templates'
      ]
    },
    {
      icon: PieChart,
      title: 'Profitability Analysis',
      description: 'Identify your most profitable menu items and optimize your pricing strategy.',
      benefits: [
        'Menu item profitability',
        'Cost analysis',
        'Margin calculations',
        'Performance insights',
        'Pricing recommendations'
      ]
    },
    {
      icon: Map,
      title: 'Floor Plan Management',
      description: 'Visual table layout with section-based organization and status management.',
      benefits: [
        'Visual table layout',
        'Section organization',
        'Table status tracking',
        'Server assignment',
        'Reservation management'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Team Communication',
      description: 'Built-in chat system for seamless communication with your entire team.',
      benefits: [
        'Role-based messaging',
        'Real-time notifications',
        'Message history',
        'Group conversations',
        'Announcement system'
      ]
    }
  ];

  const serverFeatures = [
    {
      icon: ClipboardList,
      title: 'Quick Table Management',
      description: 'Efficiently manage your tables with an intuitive interface designed for speed.',
      benefits: [
        'Fast table seating',
        'Quick order creation',
        'Easy item modifications',
        'Special request handling',
        'Bill processing'
      ]
    },
    {
      icon: Map,
      title: 'Floor View',
      description: 'See your section at a glance with visual table status indicators.',
      benefits: [
        'Section-based view',
        'Table status indicators',
        'My tables filter',
        'Quick table access',
        'Visual organization'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Personal Performance Stats',
      description: 'Track your performance with detailed statistics and insights.',
      benefits: [
        'Daily sales tracking',
        'Table count metrics',
        'Average check size',
        'Tip percentage',
        'Performance trends'
      ]
    },
    {
      icon: Trophy,
      title: 'Server Competitions',
      description: 'Compete with your team and see where you rank on the leaderboard.',
      benefits: [
        'Server leaderboard',
        'Competition rankings',
        'Achievement badges',
        'Performance goals',
        'Team challenges'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Real-Time Communication',
      description: 'Communicate instantly with kitchen and management.',
      benefits: [
        'Kitchen messaging',
        'Management updates',
        'Team announcements',
        'Order status updates',
        'Quick notifications'
      ]
    },
    {
      icon: Clock,
      title: 'Efficient Workflow',
      description: 'Streamlined processes that help you serve more tables faster.',
      benefits: [
        'Quick order entry',
        'Fast item lookup',
        'Streamlined checkout',
        'Time-saving shortcuts',
        'Mobile-friendly design'
      ]
    }
  ];

  const kitchenFeatures = [
    {
      icon: ClipboardList,
      title: 'Order Queue Management',
      description: 'Efficiently manage incoming orders with a clear, organized queue system.',
      benefits: [
        'Real-time order queue',
        'Order priority management',
        'Status tracking',
        'Preparation time estimates',
        'Order completion tracking'
      ]
    },
    {
      icon: UtensilsCrossed,
      title: 'Kitchen Ticket System',
      description: 'Clear, organized tickets that make it easy to see what needs to be prepared.',
      benefits: [
        'Digital kitchen tickets',
        'Item-by-item breakdown',
        'Special instructions',
        'Table and server info',
        'Timestamp tracking'
      ]
    },
    {
      icon: Package,
      title: 'Inventory Visibility',
      description: 'See current stock levels and get alerts when items are running low.',
      benefits: [
        'Real-time stock levels',
        'Low stock alerts',
        'Ingredient tracking',
        'Usage monitoring',
        'Reorder notifications'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Team Communication',
      description: 'Communicate instantly with servers and management.',
      benefits: [
        'Server messaging',
        'Management updates',
        'Order status updates',
        'Team announcements',
        'Quick notifications'
      ]
    },
    {
      icon: Clock,
      title: 'Time Optimization',
      description: 'Track preparation times and optimize your workflow.',
      benefits: [
        'Preparation time tracking',
        'Efficiency metrics',
        'Workflow optimization',
        'Time-saving insights',
        'Performance monitoring'
      ]
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get notified about new orders, special requests, and important updates.',
      benefits: [
        'New order alerts',
        'Priority order notifications',
        'Special request alerts',
        'Low inventory warnings',
        'Customizable notifications'
      ]
    }
  ];

  const tabs = [
    { id: 'managers', label: 'Why Managers Love Us', icon: User, color: 'from-blue-600 via-indigo-600 to-purple-600' },
    { id: 'servers', label: 'Why Servers Love Us', icon: ClipboardList, color: 'from-emerald-500 via-teal-500 to-cyan-500' },
    { id: 'kitchen', label: 'Why Chefs Love Us', icon: ChefHat, color: 'from-orange-500 via-red-500 to-pink-500' }
  ];

  const getActiveFeatures = () => {
    switch (activeTab) {
      case 'managers':
        return managerFeatures;
      case 'servers':
        return serverFeatures;
      case 'kitchen':
        return kitchenFeatures;
      default:
        return managerFeatures;
    }
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

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
              <Link to="/features" className="text-sm text-foreground">Features</Link>
              <Link to="/benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Benefits</Link>
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
            Powerful Features for
            <br />
            Every Role
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover all the tools and capabilities that make NEVER86 the complete solution for restaurant management.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-1 border-b border-border overflow-x-auto">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-foreground text-foreground font-medium'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getActiveFeatures().map((feature, index) => {
              const Icon = feature.icon;
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
                  <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-foreground" />
                        <span className="text-muted-foreground">{benefit}</span>
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
            Ready to Experience These Features?
          </h2>
          <p className="text-base text-muted-foreground mb-8">
            Start your free trial today and see how NEVER86 can transform your restaurant operations.
          </p>
          <Link to="/login">
            <Button size="lg" className="h-11 px-6">
              Start Free Trial
            </Button>
          </Link>
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

export default Features;
