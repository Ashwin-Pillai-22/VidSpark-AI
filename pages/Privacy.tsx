
import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 animate-fadeIn">
      <div className="bg-gray-800/50 p-12 rounded-[48px] border border-white/5 shadow-2xl">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-8">Privacy Policy</h1>
        <p className="text-gray-400 mb-10 font-medium italic">Last Updated: October 2023</p>
        
        <div className="prose prose-invert max-w-none space-y-8 text-gray-300 font-medium leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider text-brand-500">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account, such as your email address. We also collect usage data through Google Firebase and basic interaction logs to improve our AI generation quality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider text-brand-500">2. How We Use Your Data</h2>
            <p>
              Your data is primarily used to provide and maintain our service, authenticate your sessions via Firebase Auth, and store your saved scripts in Firestore. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider text-brand-500">3. AI Data Processing</h2>
            <p>
              The topics and prompts you enter are processed by Google's Gemini API. This data is subject to Google's privacy policies. We do not use your private generated scripts to train public models without explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider text-brand-500">4. Cookies and Tracking</h2>
            <p>
              We use essential cookies for authentication and performance. Third-party services like Firebase may use cookies to ensure the security and stability of the application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider text-brand-500">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@vidspark.ai.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
