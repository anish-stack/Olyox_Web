import React from 'react';

function Privacy() {
    React.useEffect(()=>{
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        },[])
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-4">Effective Date: 20th August 2024</p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">1. Introduction</h2>
        <p className="text-gray-600 mb-4">
          Olyox Private Limited ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our services, including cab booking, hotel booking, transportation, Guru Gyan, and more ("Services").
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">2. Information We Collect</h2>
        <p className="text-gray-600 mb-4">
          We collect the following types of information from you:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li><strong>Personal Information:</strong> Includes your name, mobile number, email address, and other contact details.</li>
          <li><strong>Location Information:</strong> We collect your current location to provide accurate and timely cab booking and other location-based services.</li>
          <li><strong>Usage Information:</strong> We may collect information about how you interact with our Services, including the features you use and the time and duration of your activities.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">3. How We Use Your Information</h2>
        <p className="text-gray-600 mb-4">
          We use your information to:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Provide, operate, and improve our Services.</li>
          <li>Personalize your experience by showing you content and ads relevant to your preferences.</li>
          <li>Communicate with you regarding your bookings, inquiries, and any other requests.</li>
          <li>Comply with legal obligations and enforce our terms and conditions.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">4. Data Sharing</h2>
        <p className="text-gray-600 mb-4">
          We do not share your personal information with third parties except in the following cases:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>With service providers who help us operate our Services (e.g., payment processors, IT service providers).</li>
          <li>When required by law or to protect our legal rights.</li>
          <li>With your consent or at your direction.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">5. Account Deletion</h2>
        <p className="text-gray-600 mb-4">
          You have the right to request the deletion of your account if you no longer wish to be associated with Olyox Private Limited. To delete your account, please contact our customer support team at <a href="mailto:helpcenter@olyox.com" className="text-blue-500 underline">helpcenter@olyox.com</a>. We will process your request and delete your account within 7 Working Days.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">6. Data Security</h2>
        <p className="text-gray-600 mb-4">
          We take appropriate security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">7. Changes to This Privacy Policy</h2>
        <p className="text-gray-600 mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website and updating the effective date.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">8. Contact Us</h2>
        <p className="text-gray-600 mb-4">
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
        </p>
        <p className="text-gray-600 mb-4">
          Olyox Private Limited<br />
          <a href="mailto:helpcenter@olyox.com" className="text-blue-500 underline">helpcenter@olyox.com</a>
        </p>
      </div>
    </div>
  );
}

export default Privacy;
