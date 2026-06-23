
import React from 'react';
// Fix: Corrected named imports from react-router-dom to resolve module resolution errors
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex px-4 py-3 text-gray-500 max-w-7xl mx-auto" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3 font-bold text-xs uppercase tracking-widest">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center hover:text-white transition-colors">
            <i className="fa-solid fa-house mr-2"></i>
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          return (
            <li key={to}>
              <div className="flex items-center">
                <i className="fa-solid fa-chevron-right text-[10px] mx-2 opacity-30"></i>
                {last ? (
                  <span className="text-brand-500">{value}</span>
                ) : (
                  <Link to={to} className="hover:text-white transition-colors">
                    {value}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
