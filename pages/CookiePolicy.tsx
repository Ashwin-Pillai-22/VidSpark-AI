
import React from 'react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 animate-fadeIn">
      <div className="bg-gray-800/50 p-12 rounded-[48px] border border-white/5 shadow-2xl">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-8">Cookie Policy</h1>
        <p className="text-gray-400 mb-10 font-medium italic">Effective Date: October 2023</p>
        
        <div className="prose prose-invert max-w-none space-y-8 text-gray-300 font-medium leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider text-brand-500">1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider text-brand-500">2. How We Use Cookies</h2>
            <p>
              VidSpark AI uses cookies for several reasons:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> These are necessary for the website to function, primarily used for Firebase Authentication to keep you logged in.</li>
              <li><strong>Performance Cookies:</strong> We use these to understand how visitors interact with our platform, allowing us to fix bugs and improve the UI.</li>
              <li><strong>Functionality Cookies:</strong> These remember your preferences, such as your chosen platform or mood settings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider text-brand-500">3. Third-Party Cookies</h2>
            <p>
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service. This includes Google Firebase for backend infrastructure and authentication.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider text-brand-500">4. Your Choices</h2>
            <p>
              Most web browsers allow some control of most cookies through the browser settings. However, if you use your browser settings to block all cookies (including essential cookies) you may not be able to access all or parts of our site.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
