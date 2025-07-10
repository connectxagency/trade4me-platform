import React, { useState } from 'react';
import { Copy, Eye, EyeOff, Info, AlertCircle } from 'lucide-react';

const DemoLoginInfo: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const demoCredentials = {
    email: 'demo.community@connectx.com',
    password: 'demo123456'
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-blue-400 font-semibold mb-2">Demo Account</h3>
          <p className="text-blue-300/80 text-sm mb-3">
            Use these credentials to test the partner dashboard:
          </p>
          
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-300 w-16">Email:</span>
              <code className="bg-blue-900/30 px-2 py-1 rounded text-blue-200 text-sm flex-1">
                {demoCredentials.email}
              </code>
              <button
                onClick={() => copyToClipboard(demoCredentials.email, 'email')}
                className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                title="Copy email"
              >
                <Copy className="w-4 h-4" />
              </button>
              {copied === 'email' && (
                <span className="text-green-400 text-xs">Copied!</span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-300 w-16">Password:</span>
              <code className="bg-blue-900/30 px-2 py-1 rounded text-blue-200 text-sm flex-1">
                {showPassword ? demoCredentials.password : '••••••••'}
              </code>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => copyToClipboard(demoCredentials.password, 'password')}
                className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                title="Copy password"
              >
                <Copy className="w-4 h-4" />
              </button>
              {copied === 'password' && (
                <span className="text-green-400 text-xs">Copied!</span>
              )}
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-yellow-300/90 text-xs">
                <strong>First time?</strong> If the demo account doesn't exist yet, please register with these credentials first, then return to login.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoLoginInfo;