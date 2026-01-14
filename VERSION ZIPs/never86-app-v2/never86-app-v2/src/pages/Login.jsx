import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { User, ChefHat, ClipboardList } from 'lucide-react';

function Login() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { staff } = useData();
  const navigate = useNavigate();

  const roles = [
    { id: 'manager', label: 'Manager', icon: User, color: 'bg-brand-navy hover:bg-brand-navy/90' },
    { id: 'server', label: 'Server', icon: ClipboardList, color: 'bg-server-primary hover:bg-server-primary/90' },
    { id: 'kitchen', label: 'Kitchen', icon: ChefHat, color: 'bg-kitchen-primary hover:bg-kitchen-primary/90' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-gray-900 dark:text-white">Never</span>
            <span className="text-brand-navy dark:text-blue-400">86</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Restaurant Management System</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-3">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    selectedRole === role.id
                      ? `${role.color} text-white border-transparent`
                      : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'
                  }`}
                >
                  <role.icon size={24} />
                  <span className="text-sm font-medium">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Username Input */}
          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white font-medium py-3 px-4 rounded-xl transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;