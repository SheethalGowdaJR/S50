const fs = require('fs');

const companies = [
  'Microsoft', 'Google', 'Amazon', 'Adobe', 'Oracle', 'IBM', 'Infosys', 
  'TCS', 'Wipro', 'Accenture', 'Capgemini', 'Deloitte', 'JPMorgan', 
  'Goldman Sachs', 'Flipkart', 'Swiggy', 'Zomato'
];

const roles = [
  'SDE', 'ML Engineer', 'Backend Engineer', 'Frontend Engineer', 
  'Cloud Engineer', 'Data Analyst', 'Cybersecurity Analyst'
];

const years = [2022, 2023, 2024, 2025, 2026];

const generateRecord = (id) => {
  const companyName = companies[Math.floor(Math.random() * companies.length)];
  const role = roles[Math.floor(Math.random() * roles.length)];
  
  let category = 'Product';
  if (['TCS', 'Wipro', 'Infosys', 'Accenture', 'Capgemini', 'IBM'].includes(companyName)) category = 'Service';
  else if (['JPMorgan', 'Goldman Sachs', 'Deloitte'].includes(companyName)) category = 'FinTech';
  else if (['Amazon', 'Flipkart', 'Swiggy', 'Zomato'].includes(companyName)) category = 'E-Commerce';

  const year = years[Math.floor(Math.random() * years.length)];
  
  let baseMultiplier = category === 'Service' ? 0.6 : (category === 'Product' || category === 'E-Commerce' || category === 'FinTech' ? 1.5 : 1);
  if (role === 'ML Engineer' || role === 'SDE') baseMultiplier *= 1.3;

  const basePay = Math.floor((Math.random() * 1000000 + 400000) * baseMultiplier);
  const variableBonus = Math.floor(basePay * (Math.random() * 0.2 + 0.05));
  const esopValue = (category === 'Product' || category === 'E-Commerce') ? Math.floor(basePay * (Math.random() * 0.6)) : 0;
  const stipend = Math.floor((basePay / 12) * (Math.random() * 0.4 + 0.3));

  const totalCTC = basePay + variableBonus + esopValue;
  const offerType = Math.random() > 0.25 ? 'Full-Time' : 'Internship + PPO';
  const verified = Math.random() > 0.05;

  return {
    id: `SLR-${1000 + id}`,
    companyName,
    role,
    category,
    year,
    totalCTC,
    basePay,
    variableBonus,
    esopValue,
    stipend,
    offerType,
    verified
  };
};

const data = Array.from({ length: 90 }, (_, i) => generateRecord(i));
if (!fs.existsSync('src/data')) {
  fs.mkdirSync('src/data', { recursive: true });
}
fs.writeFileSync('src/data/salaryData.json', JSON.stringify(data, null, 2));
console.log('Successfully generated 90 salary records.');
