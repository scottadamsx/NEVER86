/**
 * FOR SERVERS PAGE
 * 
 * Modern, sleek page showcasing features specifically for restaurant servers.
 */

import { Link } from 'react-router-dom';
import { 
  ClipboardList,
  Map,
  TrendingUp,
  Trophy,
  MessageSquare,
  Settings,
  ArrowLeft,
  CheckCircle,
  Clock,
  DollarSign,
  Rocket,
  Target
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const ForServers = () => {
  const features = [
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

  const benefits = [
    'Increase your tips with better service efficiency',
    'Track your performance and set personal goals',
    'Compete with teammates on the leaderboard',
    'Process orders faster with an intuitive interface',
    'Stay connected with real-time communication',
    'Access your stats and tables from any device'
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
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-emerald-600/10 via-teal-600/10 to-cyan-600/10">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600/10 border border-emerald-600/20 mb-6">
            <Target className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-600">For Servers</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground mb-6">
            Built for
            <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Restaurant Servers
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Tools designed to help you serve more tables, increase your tips, and track your performance.
          </p>
          <Link to="/login">
            <Button size="lg" className="text-base px-8 py-6 h-auto bg-emerald-600 hover:bg-emerald-700">
              Try Server Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground">
              Features built specifically for servers to maximize efficiency and earnings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-emerald-600/50">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-emerald-600/10 group-hover:bg-emerald-600/20 flex items-center justify-center mb-4 transition-colors">
                      <Icon className="w-6 h-6 text-emerald-600" />
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
                          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
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
              Why Servers Love NEVER86
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-6 rounded-xl bg-card border border-border/50 hover:border-emerald-600/50 transition-all">
                <DollarSign className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <p className="text-foreground font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Boost Your Performance?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Start using NEVER86 and see how it helps you serve better and earn more.
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary" className="text-base px-8 py-6 h-auto bg-white text-emerald-600 hover:bg-white/90">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ForServers;
