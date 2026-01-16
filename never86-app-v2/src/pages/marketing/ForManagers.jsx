/**
 * FOR MANAGERS PAGE
 * 
 * Modern, sleek page showcasing features specifically for restaurant managers.
 */

import { Link } from 'react-router-dom';
import { 
  LayoutDashboard,
  BarChart3,
  Users,
  Package,
  Calendar,
  PieChart,
  DollarSign,
  Map,
  MessageSquare,
  Settings,
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  Rocket,
  Target
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const ForManagers = () => {
  const features = [
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

  const benefits = [
    'Make data-driven decisions with comprehensive analytics',
    'Reduce operational costs through better inventory management',
    'Improve staff productivity with efficient scheduling',
    'Increase revenue with profitability insights',
    'Streamline operations with automated workflows',
    'Stay informed with real-time notifications and alerts'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
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
            <div className="hidden md:flex items-center gap-6">
              <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link to="/benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Benefits</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 mb-6">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">For Managers</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground mb-6">
            Built for
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Restaurant Managers
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Everything you need to run your restaurant efficiently, make data-driven decisions, and drive profitability.
          </p>
          <Link to="/login">
            <Button size="lg" className="text-base px-8 py-6 h-auto bg-blue-600 hover:bg-blue-700">
              Try Manager Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
              Powerful Management Tools
            </h2>
            <p className="text-xl text-muted-foreground">
              All the features you need to manage your restaurant effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-blue-600/50">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 group-hover:bg-blue-600/20 flex items-center justify-center mb-4 transition-colors">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                    <CardDescription className="mt-2 text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black tracking-tight text-foreground mb-4">
              Why Managers Love NEVER86
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-6 rounded-xl bg-card border border-border/50 hover:border-blue-600/50 transition-all">
                <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-foreground font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Transform Your Management?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Start your free trial and experience the power of NEVER86's management tools.
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary" className="text-base px-8 py-6 h-auto bg-white text-blue-600 hover:bg-white/90">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ForManagers;
