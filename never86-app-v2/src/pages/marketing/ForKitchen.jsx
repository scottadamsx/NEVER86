/**
 * FOR KITCHEN PAGE
 * 
 * Modern, sleek page showcasing features specifically for kitchen staff.
 */

import { Link } from 'react-router-dom';
import { 
  UtensilsCrossed,
  ClipboardList,
  Package,
  MessageSquare,
  Clock,
  Settings,
  ArrowLeft,
  CheckCircle,
  Zap,
  Bell,
  Rocket,
  Target
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const ForKitchen = () => {
  const features = [
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

  const benefits = [
    'Process orders faster with an organized queue system',
    'Reduce errors with clear, detailed kitchen tickets',
    'Stay informed with real-time inventory updates',
    'Improve communication with servers and management',
    'Optimize preparation times and workflow efficiency',
    'Access everything you need from any device'
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
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-orange-600/10 via-red-600/10 to-pink-600/10">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/20 mb-6">
            <Target className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">For Kitchen</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground mb-6">
            Built for
            <span className="block bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Kitchen Staff
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Streamlined tools designed to help you prepare orders faster and more efficiently.
          </p>
          <Link to="/login">
            <Button size="lg" className="text-base px-8 py-6 h-auto bg-orange-600 hover:bg-orange-700">
              Try Kitchen Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
              Kitchen-Focused Features
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to manage orders and inventory efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-orange-600/50">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-orange-600/10 group-hover:bg-orange-600/20 flex items-center justify-center mb-4 transition-colors">
                      <Icon className="w-6 h-6 text-orange-600" />
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
                          <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
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
              Why Kitchen Staff Love NEVER86
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-6 rounded-xl bg-card border border-border/50 hover:border-orange-600/50 transition-all">
                <Zap className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                <p className="text-foreground font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Streamline Your Kitchen?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Start using NEVER86 and experience faster, more efficient order processing.
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary" className="text-base px-8 py-6 h-auto bg-white text-orange-600 hover:bg-white/90">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ForKitchen;
