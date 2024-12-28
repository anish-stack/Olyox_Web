import React, { useEffect } from 'react';

function Term() {
    React.useEffect(()=>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    },[])
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms and Conditions</h1>
        <p className="text-gray-600 mb-4">
          Welcome to Olyox platform designed and operated by Olyox Private Limited. Before you proceed to use our website and services, please carefully read and understand the following terms and conditions. By accessing or using our website, you agree to be bound by these terms. If you do not agree with any part of these terms, you may not use our services.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">1. Age and Legal Capacity:</h2>
        <p className="text-gray-600 mb-4">
          I affirm that I have attained the age of majority, which is 18 years as per the Indian Contract Act, 1872. I possess a sound mind and am legally competent to enter into contracts as per the provisions of the Act.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">2. Understanding of Business Model:</h2>
        <p className="text-gray-600 mb-4">
          I confirm that I have thoroughly reviewed and comprehended the business model of Olyox Pvt. Ltd. I have been provided with adequate information, and I understand the nature of the services offered by the company.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">3. Clarity and Satisfaction:</h2>
        <p className="text-gray-600 mb-4">
          I declare that all my queries regarding the business operations and services of Olyox Pvt. Ltd. have been addressed to my satisfaction by the company's representatives and working team.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">4. Awareness of Risks:</h2>
        <p className="text-gray-600 mb-4">
          I acknowledge that every business venture carries inherent risks, including potential losses or profits. I am fully aware of these risks and understand the factors that may impact the financial outcomes of my engagement with Olyox Pvt. Ltd.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">5. Transparency of Company Policies:</h2>
        <p className="text-gray-600 mb-4">
          I confirm that I have been made aware of and understand all policies of Olyox Pvt. Ltd., including but not limited to its refund policy, terms of service, and privacy policy. I assert that no information relevant to these policies has been withheld from me.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">6. Voluntary Consent:</h2>
        <p className="text-gray-600 mb-4">
          I affirm that my decision to enter into a contractual agreement with Olyox Pvt. Ltd. is made voluntarily and without any coercion, undue influence, fraud, misrepresentation, or mistake. I am entering into this agreement with full understanding and awareness of its implications.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Refund Policy</h2>
        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">1. Refund Eligibility and Timeline:</h3>
        <p className="text-gray-600 mb-4">
          Olyox operates with a strict seven (7) days refund policy from the date of payment receipt. Customers have seven calendar days to request a refund for eligible services.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">2. Refund Application Process:</h3>
        <p className="text-gray-600 mb-4">
          Refund requests must be submitted through the customer's registered email ID or via registered post, accompanied by a completed refund request form.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">3. Deductions and Charges:</h3>
        <p className="text-gray-600 mb-4">
          Taxes and a 5% handling charge will be deducted from the refund amount as per regulations.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">4. Refund Approval and Timeline:</h3>
        <p className="text-gray-600 mb-4">
          Refund approvals will be processed within a reasonable timeframe after review and deduction of applicable charges.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">5. Non-Refundable Services:</h3>
        <p className="text-gray-600 mb-4">
          Services already rendered or explicitly labeled as non-refundable at purchase are not eligible for refunds.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">6. Communication and Support:</h3>
        <p className="text-gray-600 mb-4">
          Customers are encouraged to contact our support team for inquiries about the refund policy.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">7. Policy Updates:</h3>
        <p className="text-gray-600 mb-4">
          Olyox reserves the right to modify this policy without notice. Changes will be effective immediately upon posting.
        </p>

        <p className="text-gray-600 mt-6">
          By agreeing to utilize Olyox's services, customers acknowledge and comply with these terms.
        </p>
      </div>
    </div>
  );
}

export default Term;
