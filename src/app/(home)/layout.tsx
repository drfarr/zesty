import { Leaf } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex flex-col items-center justify-between">
          <div className="flex items-center space-x-2 w-full    max-w-7xl mx-auto py-4 px-6">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-yellow-300 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">zesty.ai</span>
          </div>

          {children}
        </div>
      </header>
    </div>
  );
};

export default Layout;
