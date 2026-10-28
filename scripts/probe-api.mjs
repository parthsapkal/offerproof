import http from 'http';

const SAMPLE_SUSPICIOUS = {
  companyName: 'Apex Global Tech Solutions',
  companyWebsite: 'https://apex-techsolutions-india.online',
  recruiterName: 'Rohit Verma (HR Talent Acquisition)',
  recruiterEmail: 'rohit.hr.apexcareers@gmail.com',
  jobTitle: 'Data Processing & Operations Intern',
  jobListingUrl: 'https://bit.ly/apex-intern-slot',
  offerSource: 'telegram',
  feeRequested: true,
  feeAmount: 2500,
  feeReason: 'Mandatory internship registration fee & training kit security deposit',
  pastedText: 'Pay refundable registration fee ₹2,500 via UPI within 4 hours to claim slot.',
};

const SAMPLE_LOWER_RISK = {
  companyName: 'Razorpay Software Private Limited',
  companyWebsite: 'https://razorpay.com',
  recruiterName: 'Priya Nair (University Relations)',
  recruiterEmail: 'priya.nair@razorpay.com',
  jobTitle: 'Software Engineering Intern',
  jobListingUrl: 'https://razorpay.com/careers/jobs/frontend-intern-2025',
  offerSource: 'campus',
  feeRequested: false,
  feeAmount: 0,
  feeReason: '',
  pastedText: 'Completed 3 interview rounds. Razorpay does not charge any registration fee.',
};

const SAMPLE_INCONCLUSIVE = {
  companyName: 'Swiggy (Bundl Technologies)',
  companyWebsite: 'https://www.swiggy.com',
  recruiterName: 'Kunal Sharma',
  recruiterEmail: 'kunal.talent.swiggy@outlook.com',
  jobTitle: 'Product Operations & Growth Intern',
  jobListingUrl: '',
  offerSource: 'telegram',
  feeRequested: false,
  pastedText: 'Hi, I am Kunal from Swiggy Talent Acquisition. Reach out on Telegram.',
};

function postVerify(payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const req = http.request(
      'http://127.0.0.1:3000/api/verify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ statusCode: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runProbes() {
  console.log('Testing /api/verify with all 3 judge sample cases...\n');

  // 1. Probe Suspicious
  console.log('--- Probing Case 1: Suspicious (\u20B92,500 Fee) ---');
  const res1 = await postVerify(SAMPLE_SUSPICIOUS);
  console.log('HTTP Status:', res1.statusCode);
  console.log('Assessment Status:', res1.data?.report?.overallAssessment?.status);
  console.log('Badge Label:', res1.data?.report?.overallAssessment?.badgeLabel);
  console.log('Critical Count:', res1.data?.report?.metrics?.criticalCount);
  console.log('Findings Count:', res1.data?.report?.findings?.length);
  if (res1.data?.report?.overallAssessment?.status !== 'HIGH_WARNING') {
    throw new Error('Case 1 failed: Expected HIGH_WARNING');
  }
  console.log('✓ Case 1 Verified Successfully!\n');

  // 2. Probe Lower Risk
  console.log('--- Probing Case 2: Lower Risk (Razorpay Campus) ---');
  const res2 = await postVerify(SAMPLE_LOWER_RISK);
  console.log('HTTP Status:', res2.statusCode);
  console.log('Assessment Status:', res2.data?.report?.overallAssessment?.status);
  console.log('Badge Label:', res2.data?.report?.overallAssessment?.badgeLabel);
  console.log('Verified Signals Count:', res2.data?.report?.metrics?.verifiedCount);
  console.log('Critical Count:', res2.data?.report?.metrics?.criticalCount);
  if (res2.data?.report?.overallAssessment?.status !== 'LOWER_RISK') {
    throw new Error('Case 2 failed: Expected LOWER_RISK');
  }
  console.log('✓ Case 2 Verified Successfully!\n');

  // 3. Probe Inconclusive
  console.log('--- Probing Case 3: Inconclusive (Swiggy / Personal Email) ---');
  const res3 = await postVerify(SAMPLE_INCONCLUSIVE);
  console.log('HTTP Status:', res3.statusCode);
  console.log('Assessment Status:', res3.data?.report?.overallAssessment?.status);
  console.log('Badge Label:', res3.data?.report?.overallAssessment?.badgeLabel);
  console.log('Caution Count:', res3.data?.report?.metrics?.cautionCount);
  if (res3.data?.report?.overallAssessment?.status !== 'INCONCLUSIVE') {
    throw new Error('Case 3 failed: Expected INCONCLUSIVE');
  }
  console.log('✓ Case 3 Verified Successfully!\n');

  console.log('========================================================');
  console.log(' ALL 3 SAMPLE CASES PASS SERVERLESS VERIFICATION API! ');
  console.log('========================================================');
}

runProbes().catch((err) => {
  console.error('Probe failed:', err);
  process.exit(1);
});
