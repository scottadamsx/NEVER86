/**
 * LOGIN PAGE
 * 
 * Modern, professional login page inspired by the marketing design.
 * This page is seen by managers, clients, and during demos, so it needs to be
 * polished and professional while maintaining the NEVER86 brand identity.
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { User, ChefHat, ClipboardList, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

function Login() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { staff } = useData();
  const navigate = useNavigate();

  const roles = [
    { 
      id: 'manager', 
      label: 'Manager', 
      icon: User, 
      gradient: 'from-blue-600 via-indigo-600 to-purple-600',
      description: 'Full system access'
    },
    { 
      id: 'server', 
      label: 'Server', 
      icon: ClipboardList, 
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      description: 'Table & order management'
    },
    { 
      id: 'kitchen', 
      label: 'Kitchen', 
      icon: ChefHat, 
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      description: 'Order processing'
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    // Validate username exists in staff and matches the selected role
    const trimmedUsername = username.trim();
    const staffMember = staff.find(s => s.username.toLowerCase() === trimmedUsername.toLowerCase());
    
    if (!staffMember) {
      setError('Username not found in system');
      return;
    }

    // Check if the staff member's role matches the selected role
    if (staffMember.role !== selectedRole) {
      setError(`This username is not associated with the ${selectedRole} role`);
      return;
    }

    // Login with the staff member's actual data
    const user = {
      id: staffMember.id,
      username: staffMember.username,
      role: staffMember.role,
      displayName: staffMember.displayName,
    };
    login(user.username, user.role, user);
    
    // Kitchen routes to orders by default, others to dashboard
    if (selectedRole === 'kitchen') {
      navigate(`/${selectedRole}/orders`);
    } else {
      navigate(`/${selectedRole}/dashboard`);
    }
  };

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
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="sm" className="h-9">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-12 pt-32">
        <div className="w-full max-w-md">
          {/* Welcome */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-3">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to access your restaurant management system
            </p>
          </div>

          {/* Login Card */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Sign In</CardTitle>
              <CardDescription>
                Select your role and enter your username to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      const isSelected = selectedRole === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setSelectedRole(role.id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                            isSelected
                              ? 'border-foreground bg-muted'
                              : 'border-border hover:border-foreground/50'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center">
                            <Icon className="w-5 h-5 text-foreground" />
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {role.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Username Input */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    autoComplete="username"
                  />
                  {selectedRole && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {selectedRole === 'manager' && 'Example: manager949'}
                      {selectedRole === 'server' && 'Example: mrodriguez2847'}
                      {selectedRole === 'kitchen' && 'Example: chef949'}
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                    <p className="text-sm text-destructive text-center">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={!selectedRole || !username.trim()}
                >
                  Sign In
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need help? <a href="#" className="text-foreground hover:underline">Contact support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
