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
  jobTitle: 'Software Engineering Intern (Frontend)',
  jobListingUrl: 'https://razorpay.com/careers/jobs/frontend-intern-2025',
  jobId: 'RZP-ENG-2025-042',
  compensation: '₹35,000 / month',
  duration: '6 Months',
  location: 'Bangalore, Karnataka (Hybrid)',
  demoScenarioId: 'matching_role',
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

// 5 Specific Official Listing Match Benchmark Scenarios (as required by prompt)
const SCENARIO_1_STRONG_MATCH = {
  companyName: 'Razorpay Software Private Limited',
  companyWebsite: 'https://razorpay.com',
  jobListingUrl: 'https://razorpay.com/careers/jobs/frontend-intern-2025',
  jobTitle: 'Software Engineering Intern (Frontend)',
  jobId: 'RZP-ENG-2025-042',
  location: 'Bangalore, Karnataka (Hybrid)',
  compensation: '₹35,000 / month',
  duration: '6 Months',
  demoScenarioId: 'matching_role',
  recruiterName: 'Priya Nair',
  recruiterEmail: 'priya.nair@razorpay.com',
  offerSource: 'campus',
  feeRequested: false,
};

const SCENARIO_2_COPIED_WITH_FEE = {
  companyName: 'Thoughtworks Technologies India',
  companyWebsite: 'https://www.thoughtworks.com',
  jobListingUrl: 'https://www.thoughtworks.com/careers/jobs/grad-dev-9102',
  jobTitle: 'Graduate Developer Intern',
  jobId: 'TW-IN-GRAD-9102',
  compensation: '₹30,000 / month',
  demoScenarioId: 'copied_with_fee',
  recruiterName: 'Anil HR',
  recruiterEmail: 'anil.thoughtworks.recruitment@gmail.com',
  offerSource: 'telegram',
  feeRequested: true,
  feeAmount: 2500,
  feeReason: 'Workstation laptop courier fee',
  pastedText: 'Must transfer ₹2,500 via UPI within 4 hours to confirm joining.',
};

const SCENARIO_3_CONTACT_MISMATCH = {
  companyName: 'Swiggy (Bundl Technologies Pvt Ltd)',
  companyWebsite: 'https://www.swiggy.com',
  jobListingUrl: 'https://careers.swiggy.com/jobs/product-growth-ops-331',
  jobTitle: 'Product Operations & Growth Intern',
  jobId: 'SWIG-OPS-331',
  demoScenarioId: 'mismatched_contact',
  recruiterName: 'Kunal Sharma',
  recruiterEmail: 'kunal.talent.swiggy@outlook.com',
  offerSource: 'telegram',
  feeRequested: false,
};

const SCENARIO_4_EXPIRED_LISTING = {
  companyName: 'Zerodha Broking Limited',
  companyWebsite: 'https://zerodha.com',
  jobListingUrl: 'https://zerodha.com/careers/jobs/inactive-archive-role-404',
  jobTitle: 'Backend Engineering Intern (Go / Python)',
  demoScenarioId: 'expired_listing',
  recruiterName: 'Campus Team',
  recruiterEmail: 'jobs@zerodha.com',
  offerSource: 'cold_email',
  feeRequested: false,
};

const SCENARIO_5_UNVERIFIED_DOMAIN = {
  companyName: 'Tata Consultancy Services',
  companyWebsite: 'https://www.tcs.com',
  jobListingUrl: 'https://tcs-careers-portal-india.site/jobs/tcs-national-internship-2025',
  jobTitle: 'Associate Software Trainee Intern',
  demoScenarioId: 'unverified_domain',
  recruiterName: 'TCS Hiring Cell',
  recruiterEmail: 'tcs.recruitment.cell@gmail.com',
  offerSource: 'social_media',
  feeRequested: true,
  feeAmount: 1800,
  feeReason: 'National Qualifier Verification fee',
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
  console.log('========================================================');
  console.log('   OFFERPROOF & OFFICIAL LISTING MATCH API TEST PROBE    ');
  console.log('========================================================\n');

  // 1. Probe Suspicious
  console.log('--- Probing Case 1: Suspicious (\u20B92,500 Fee) ---');
  const res1 = await postVerify(SAMPLE_SUSPICIOUS);
  console.log('HTTP Status:', res1.statusCode);
  console.log('Assessment Status:', res1.data?.report?.overallAssessment?.status);
  console.log('Badge Label:', res1.data?.report?.overallAssessment?.badgeLabel);
  if (res1.data?.report?.overallAssessment?.status !== 'HIGH_WARNING') {
    throw new Error('Case 1 failed: Expected HIGH_WARNING');
  }
  console.log('✓ Case 1 Verified Successfully!\n');

  // 2. Probe Lower Risk with Official Listing Match
  console.log('--- Probing Case 2: Lower Risk (Razorpay Campus) ---');
  const res2 = await postVerify(SAMPLE_LOWER_RISK);
  console.log('HTTP Status:', res2.statusCode);
  console.log('Assessment Status:', res2.data?.report?.overallAssessment?.status);
  console.log('Listing Match Status:', res2.data?.report?.officialListingMatch?.status);
  console.log('Matched Fields Count:', res2.data?.report?.officialListingMatch?.matchedCount);
  if (res2.data?.report?.overallAssessment?.status !== 'LOWER_RISK') {
    throw new Error('Case 2 failed: Expected LOWER_RISK');
  }
  if (res2.data?.report?.officialListingMatch?.status !== 'STRONG_MATCH') {
    throw new Error('Case 2 failed: Expected Listing Match STRONG_MATCH');
  }
  console.log('✓ Case 2 Verified Successfully with Strong Listing Match!\n');

  // 3. Probe Inconclusive
  console.log('--- Probing Case 3: Inconclusive (Swiggy / Personal Email) ---');
  const res3 = await postVerify(SAMPLE_INCONCLUSIVE);
  console.log('HTTP Status:', res3.statusCode);
  console.log('Assessment Status:', res3.data?.report?.overallAssessment?.status);
  if (res3.data?.report?.overallAssessment?.status !== 'INCONCLUSIVE') {
    throw new Error('Case 3 failed: Expected INCONCLUSIVE');
  }
  console.log('✓ Case 3 Verified Successfully!\n');

  // 4. Test Official Listing Match: Scenario 1 (Strong Match)
  console.log('--- Probing Listing Scenario 1: Matching Role, Comp & ID ---');
  const resScen1 = await postVerify(SCENARIO_1_STRONG_MATCH);
  console.log('Listing Status:', resScen1.data?.report?.officialListingMatch?.status);
  if (resScen1.data?.report?.officialListingMatch?.status !== 'STRONG_MATCH') {
    throw new Error('Scenario 1 failed: Expected STRONG_MATCH');
  }
  console.log('✓ Scenario 1 Verified Successfully!\n');

  // 5. Test Official Listing Match: Scenario 2 (Copied Listing + Upfront Fee)
  console.log('--- Probing Listing Scenario 2: Copied Listing with Upfront Fee ---');
  const resScen2 = await postVerify(SCENARIO_2_COPIED_WITH_FEE);
  console.log('Listing Status:', resScen2.data?.report?.officialListingMatch?.status);
  console.log('Suspicious Differences:', resScen2.data?.report?.officialListingMatch?.suspiciousDifferences);
  if (resScen2.data?.report?.officialListingMatch?.status !== 'MISMATCH_DETECTED') {
    throw new Error('Scenario 2 failed: Expected MISMATCH_DETECTED');
  }
  if (resScen2.data?.report?.overallAssessment?.status !== 'HIGH_WARNING') {
    throw new Error('Scenario 2 failed: High fee must trigger HIGH_WARNING even with matching role title');
  }
  console.log('✓ Scenario 2 Verified Successfully: Critical fee mismatch flagged!\n');

  // 6. Test Official Listing Match: Scenario 3 (Contact & Channel Mismatch)
  console.log('--- Probing Listing Scenario 3: Mismatched Recruiter & Channel ---');
  const resScen3 = await postVerify(SCENARIO_3_CONTACT_MISMATCH);
  console.log('Listing Status:', resScen3.data?.report?.officialListingMatch?.status);
  if (resScen3.data?.report?.officialListingMatch?.status !== 'MISMATCH_DETECTED') {
    throw new Error('Scenario 3 failed: Expected MISMATCH_DETECTED for contact discrepancy');
  }
  console.log('✓ Scenario 3 Verified Successfully: Contact discrepancy caught!\n');

  // 7. Test Official Listing Match: Scenario 4 (Expired / Inaccessible Listing)
  console.log('--- Probing Listing Scenario 4: Expired / 404 Listing ---');
  const resScen4 = await postVerify(SCENARIO_4_EXPIRED_LISTING);
  console.log('Listing Status:', resScen4.data?.report?.officialListingMatch?.status);
  if (resScen4.data?.report?.officialListingMatch?.status !== 'UNABLE_TO_VERIFY') {
    throw new Error('Scenario 4 failed: Expected UNABLE_TO_VERIFY');
  }
  console.log('✓ Scenario 4 Verified Successfully: Expired state handled gracefully!\n');

  // 8. Test Official Listing Match: Scenario 5 (Unverified Domain)
  console.log('--- Probing Listing Scenario 5: Unverified Domain ---');
  const resScen5 = await postVerify(SCENARIO_5_UNVERIFIED_DOMAIN);
  console.log('Listing Status:', resScen5.data?.report?.officialListingMatch?.status);
  if (
    resScen5.data?.report?.officialListingMatch?.status !== 'USER_PROVIDED_UNVERIFIED' &&
    resScen5.data?.report?.officialListingMatch?.status !== 'MISMATCH_DETECTED'
  ) {
    throw new Error('Scenario 5 failed: Expected USER_PROVIDED_UNVERIFIED or MISMATCH_DETECTED');
  }
  console.log('✓ Scenario 5 Verified Successfully: Unverified domain flagged!\n');

  console.log('========================================================');
  console.log(' ALL BENCHMARK & OFFICIAL LISTING MATCH TESTS PASSED!   ');
  console.log('========================================================');
}

runProbes().catch((err) => {
  console.error('Probe failed:', err);
  process.exit(1);
});
