// Multi-domain job database — IT, Medical, Healthcare, Finance, Sales, Marketing, Manufacturing, Education, Legal, Government, Hospitality, Logistics
const { v4: uuidv4 } = require('uuid');

const jobsDatabase = [

  // ══════════════ IT / SOFTWARE ══════════════
  {
    id: uuidv4(), title: 'Generative AI & LLM Engineer', company: 'Cognitive Tech Labs', location: 'Bangalore', type: 'Full-time',
    experience: '1-4 years', salary: '₹14-28 LPA', remote: true,
    skills: ['generative ai', 'llm', 'llm integration', 'openai', 'anthropic', 'deepgram api', 'langchain', 'pinecone', 'vector database', 'rag', 'python'],
    description: 'Integrate state-of-the-art LLMs (OpenAI, Anthropic) and speech APIs (Deepgram) to build next-gen AI applications and voice agents.',
    requirements: ['LLM integration experience', 'LangChain/LlamaIndex', 'OpenAI & Anthropic APIs', 'Deepgram API / Whisper', 'Vector DBs (Pinecone/Chroma)'],
    category: 'ai', domain: 'IT', postedDate: '2025-03-05',
    applyUrl: 'https://in.linkedin.com/jobs/generative-ai-engineer-jobs', domainIcon: '🤖'
  },
  {
    id: uuidv4(), title: 'ASP.NET Core / C# Developer', company: 'Enterprise Software Solutions', location: 'Hyderabad', type: 'Full-time',
    experience: '2-5 years', salary: '₹9-18 LPA', remote: true,
    skills: ['c#', 'asp.net core', 'asp.net', '.net core', 'sql server', 'sql', 't-sql', 'rest api', 'azure', 'microservices'],
    description: 'Design and develop robust backend enterprise applications using C# and ASP.NET Core with SQL Server databases.',
    requirements: ['C# and ASP.NET Core proficiency', 'SQL Server / T-SQL expertise', 'RESTful APIs & Microservices', 'Azure cloud deployment'],
    category: 'backend', domain: 'IT', postedDate: '2025-03-04',
    applyUrl: 'https://in.linkedin.com/jobs/asp-net-developer-jobs', domainIcon: '💻'
  },
  {
    id: uuidv4(), title: 'Fullstack AI Engineer (React + Node + LLMs)', company: 'Innovate AI', location: 'Pune', type: 'Full-time',
    experience: '1-3 years', salary: '₹10-20 LPA', remote: true,
    skills: ['react', 'react.js', 'nodejs', 'node.js', 'express', 'c#', 'sql', 'generative ai', 'openai', 'anthropic', 'deepgram api', 'html', 'css', 'tailwind'],
    description: 'Build interactive AI applications with React.js frontend and Node.js/C# backend integrating OpenAI, Anthropic, and Deepgram APIs.',
    requirements: ['React.js and Node.js mastery', 'HTML/CSS/Tailwind UI design', 'Generative AI & LLM integration', 'API orchestration'],
    category: 'fullstack', domain: 'IT', postedDate: '2025-03-05',
    applyUrl: 'https://in.linkedin.com/jobs/full-stack-ai-engineer-jobs', domainIcon: '⚡'
  },
  {
    id: uuidv4(), title: 'Frontend Developer', company: 'TechCorp India', location: 'Bangalore', type: 'Full-time',
    experience: '0-2 years', salary: '₹4-8 LPA', remote: true,
    skills: ['react', 'javascript', 'html', 'css', 'typescript', 'redux', 'git'],
    description: 'Build modern web apps using React. Work with design and backend teams to deliver pixel-perfect UIs.',
    requirements: ['React.js proficiency', 'REST API integration', 'Responsive design', 'Git version control'],
    category: 'frontend', domain: 'IT', postedDate: '2025-03-01',
    applyUrl: 'https://in.linkedin.com/jobs/frontend-developer-jobs', domainIcon: '💻'
  },
  {
    id: uuidv4(), title: 'Full Stack Developer', company: 'StartupHub', location: 'Pune', type: 'Full-time',
    experience: '1-3 years', salary: '₹6-12 LPA', remote: false,
    skills: ['nodejs', 'react', 'mongodb', 'express', 'javascript', 'rest api', 'git'],
    description: 'Own end-to-end product features from database to UI in a fast-paced startup environment.',
    requirements: ['MERN stack', 'Database design', 'API development', 'Agile methodology'],
    category: 'fullstack', domain: 'IT', postedDate: '2025-03-02',
    applyUrl: 'https://in.linkedin.com/jobs/full-stack-developer-jobs', domainIcon: '💻'
  },
  {
    id: uuidv4(), title: 'Backend Developer (Node.js)', company: 'FinTech Solutions', location: 'Mumbai', type: 'Full-time',
    experience: '2-5 years', salary: '₹10-18 LPA', remote: true,
    skills: ['nodejs', 'express', 'postgresql', 'redis', 'docker', 'aws', 'microservices'],
    description: 'Design and build scalable backend services for financial products serving millions of users.',
    requirements: ['Node.js expert', 'SQL/NoSQL databases', 'Cloud deployment', 'System design'],
    category: 'backend', domain: 'IT', postedDate: '2025-03-01',
    applyUrl: 'https://in.linkedin.com/jobs/backend-developer-jobs', domainIcon: '💻'
  },
  {
    id: uuidv4(), title: 'Python Developer', company: 'DataDriven Co.', location: 'Hyderabad', type: 'Full-time',
    experience: '1-4 years', salary: '₹7-14 LPA', remote: true,
    skills: ['python', 'django', 'flask', 'postgresql', 'celery', 'aws', 'docker'],
    description: 'Build data pipelines and backend APIs in Python. Work with data science teams.',
    requirements: ['Python 3+', 'Django/Flask', 'Database optimization', 'REST API design'],
    category: 'backend', domain: 'IT', postedDate: '2025-02-28',
    applyUrl: 'https://in.linkedin.com/jobs/python-developer-jobs', domainIcon: '💻'
  },
  {
    id: uuidv4(), title: 'Data Scientist', company: 'AI Ventures', location: 'Bangalore', type: 'Full-time',
    experience: '1-3 years', salary: '₹8-16 LPA', remote: false,
    skills: ['python', 'machine learning', 'tensorflow', 'pandas', 'numpy', 'sql', 'data analysis', 'scikit-learn'],
    description: 'Build ML models to solve real-world business problems. Work with structured and unstructured data.',
    requirements: ['ML algorithms', 'Python data libraries', 'Statistical analysis', 'Data visualization'],
    category: 'data', domain: 'IT', postedDate: '2025-03-03',
    applyUrl: 'https://in.linkedin.com/jobs/data-scientist-jobs', domainIcon: '📊'
  },
  {
    id: uuidv4(), title: 'DevOps Engineer', company: 'CloudScale', location: 'Remote', type: 'Full-time',
    experience: '2-5 years', salary: '₹12-22 LPA', remote: true,
    skills: ['docker', 'kubernetes', 'aws', 'ci/cd', 'jenkins', 'terraform', 'linux', 'bash'],
    description: 'Manage cloud infrastructure and deployment pipelines for high-traffic applications.',
    requirements: ['Container orchestration', 'CI/CD pipelines', 'IaC tools', 'Monitoring and alerting'],
    category: 'devops', domain: 'IT', postedDate: '2025-02-25',
    applyUrl: 'https://in.linkedin.com/jobs/devops-engineer-jobs', domainIcon: '⚙️'
  },
  {
    id: uuidv4(), title: 'UI/UX Designer', company: 'DesignFirst', location: 'Delhi', type: 'Full-time',
    experience: '0-2 years', salary: '₹4-9 LPA', remote: true,
    skills: ['figma', 'ui design', 'ux research', 'adobe xd', 'prototyping', 'wireframing', 'css'],
    description: 'Design beautiful, user-centric interfaces for web and mobile applications.',
    requirements: ['Figma proficiency', 'User research', 'Design systems', 'Usability testing'],
    category: 'design', domain: 'IT', postedDate: '2025-03-02',
    applyUrl: 'https://in.linkedin.com/jobs/ux-designer-jobs', domainIcon: '🎨'
  },
  {
    id: uuidv4(), title: 'Machine Learning Engineer', company: 'DeepMind India', location: 'Bangalore', type: 'Full-time',
    experience: '2-5 years', salary: '₹18-35 LPA', remote: true,
    skills: ['python', 'tensorflow', 'pytorch', 'machine learning', 'deep learning', 'nlp', 'computer vision'],
    description: 'Research and deploy production ML systems at scale. Work on NLP, vision and generative AI.',
    requirements: ['Deep learning frameworks', 'MLOps', 'Research publications preferred', 'GPU optimization'],
    category: 'ai', domain: 'IT', postedDate: '2025-03-03',
    applyUrl: 'https://in.linkedin.com/jobs/machine-learning-engineer-jobs', domainIcon: '🤖'
  },
  {
    id: uuidv4(), title: 'Android Developer', company: 'MobileFirst', location: 'Chennai', type: 'Full-time',
    experience: '1-3 years', salary: '₹6-13 LPA', remote: false,
    skills: ['android', 'kotlin', 'java', 'rest api', 'sqlite', 'firebase', 'mvvm'],
    description: 'Build and maintain Android applications for millions of users across India.',
    requirements: ['Kotlin/Java', 'Android SDK', 'Play Store deployment', 'MVVM architecture'],
    category: 'mobile', domain: 'IT', postedDate: '2025-03-01',
    applyUrl: 'https://in.linkedin.com/jobs/android-developer-jobs', domainIcon: '📱'
  },
  {
    id: uuidv4(), title: 'Cybersecurity Analyst', company: 'SecureNet India', location: 'Hyderabad', type: 'Full-time',
    experience: '2-5 years', salary: '₹9-18 LPA', remote: false,
    skills: ['cybersecurity', 'penetration testing', 'siem', 'firewall', 'network security', 'linux', 'python', 'ethical hacking'],
    description: 'Protect enterprise systems from cyber threats, conduct vulnerability assessments and incident response.',
    requirements: ['CEH/CISSP certification', 'Network security knowledge', 'SIEM tools', 'Incident response'],
    category: 'cybersecurity', domain: 'IT', postedDate: '2025-03-04',
    applyUrl: 'https://in.linkedin.com/jobs/cybersecurity-analyst-jobs', domainIcon: '🔒'
  },
  {
    id: uuidv4(), title: 'Cloud Architect (AWS)', company: 'Infosys', location: 'Bangalore', type: 'Full-time',
    experience: '5-10 years', salary: '₹25-45 LPA', remote: true,
    skills: ['aws', 'azure', 'cloud architecture', 'terraform', 'kubernetes', 'microservices', 'cost optimization'],
    description: 'Design and lead cloud transformation initiatives for enterprise clients across the globe.',
    requirements: ['AWS Solutions Architect certification', 'Multi-cloud experience', 'Enterprise architecture', 'Cost management'],
    category: 'cloud', domain: 'IT', postedDate: '2025-03-01',
    applyUrl: 'https://in.linkedin.com/jobs/cloud-architect-jobs', domainIcon: '☁️'
  },
  {
    id: uuidv4(), title: 'Fresher Software Engineer', company: 'WizTech', location: 'Bangalore', type: 'Full-time',
    experience: '0-1 year', salary: '₹3-5 LPA', remote: false,
    skills: ['java', 'python', 'c++', 'data structures', 'algorithms', 'sql', 'git'],
    description: 'Great opportunity for freshers to kickstart their tech career with mentorship from senior engineers.',
    requirements: ['CS fundamentals', 'Any programming language', 'Problem solving', 'Communication skills'],
    category: 'general', domain: 'IT', postedDate: '2025-03-04',
    applyUrl: 'https://in.linkedin.com/jobs/software-engineer-fresher-jobs', domainIcon: '💻'
  },
  {
    id: uuidv4(), title: 'Java Backend Developer', company: 'Enterprise Solutions', location: 'Pune', type: 'Full-time',
    experience: '2-6 years', salary: '₹10-20 LPA', remote: false,
    skills: ['java', 'spring boot', 'microservices', 'sql', 'kafka', 'docker', 'rest api'],
    description: 'Develop enterprise-grade backend systems using Java Spring Boot for Fortune 500 clients.',
    requirements: ['Spring Boot', 'Microservices architecture', 'JPA/Hibernate', 'Message queues'],
    category: 'backend', domain: 'IT', postedDate: '2025-03-02',
    applyUrl: 'https://in.linkedin.com/jobs/java-developer-jobs', domainIcon: '💻'
  },

  // ══════════════ MEDICAL / HEALTHCARE ══════════════
  {
    id: uuidv4(), title: 'Medical Officer (MBBS)', company: 'Apollo Hospitals', location: 'Chennai', type: 'Full-time',
    experience: '0-2 years', salary: '₹8-14 LPA', remote: false,
    skills: ['mbbs', 'patient care', 'clinical diagnosis', 'medical records', 'emergency medicine', 'pharmacology'],
    description: 'Provide outpatient and inpatient medical care, conduct clinical assessments and coordinate with specialists.',
    requirements: ['MBBS degree', 'MCI registration', 'Clinical diagnosis', 'Emergency medicine basics'],
    category: 'clinical', domain: 'Medical', postedDate: '2025-03-05',
    applyUrl: 'https://in.linkedin.com/jobs/medical-officer-jobs', domainIcon: '🏥'
  },
  {
    id: uuidv4(), title: 'Registered Nurse (ICU)', company: 'Fortis Healthcare', location: 'Delhi', type: 'Full-time',
    experience: '1-4 years', salary: '₹4-8 LPA', remote: false,
    skills: ['nursing', 'patient care', 'icu', 'critical care', 'ventilator management', 'medication administration', 'bsc nursing'],
    description: 'Provide critical care nursing in ICU setting, monitor patients and administer medications.',
    requirements: ['BSc Nursing', 'ICU experience', 'Ventilator management', 'Medication administration'],
    category: 'nursing', domain: 'Healthcare', postedDate: '2025-03-06',
    applyUrl: 'https://in.linkedin.com/jobs/icu-nurse-jobs', domainIcon: '💊'
  },
  {
    id: uuidv4(), title: 'Healthcare Data Analyst', company: 'Narayana Health', location: 'Bangalore', type: 'Full-time',
    experience: '2-4 years', salary: '₹6-12 LPA', remote: true,
    skills: ['python', 'sql', 'tableau', 'power bi', 'healthcare analytics', 'ehr', 'data analysis', 'excel'],
    description: 'Analyze patient outcomes, clinical data and operational metrics to improve hospital performance.',
    requirements: ['Healthcare domain knowledge', 'Python/SQL', 'Data visualization', 'EHR systems'],
    category: 'healthtech', domain: 'Healthcare', postedDate: '2025-03-04',
    applyUrl: 'https://in.linkedin.com/jobs/healthcare-data-analyst-jobs', domainIcon: '📊'
  },
  {
    id: uuidv4(), title: 'Radiologist', company: 'Max Healthcare', location: 'Delhi', type: 'Full-time',
    experience: '3-8 years', salary: '₹18-40 LPA', remote: false,
    skills: ['radiology', 'mri', 'ct scan', 'x-ray', 'ultrasound', 'medical imaging', 'dmrd'],
    description: 'Interpret diagnostic imaging studies and provide reports to referring physicians.',
    requirements: ['MD Radiology/DMRD', 'MRI/CT expertise', 'Medical report writing', 'Teleradiology'],
    category: 'clinical', domain: 'Medical', postedDate: '2025-02-28',
    applyUrl: 'https://in.linkedin.com/jobs/radiologist-jobs', domainIcon: '🏥'
  },
  {
    id: uuidv4(), title: 'Pharmacist', company: 'Sun Pharma', location: 'Mumbai', type: 'Full-time',
    experience: '0-3 years', salary: '₹3-7 LPA', remote: false,
    skills: ['pharmacy', 'drug dispensing', 'pharmacovigilance', 'regulatory affairs', 'bpharm', 'quality control'],
    description: 'Dispense medications, counsel patients on drug usage and support clinical pharmacotherapy.',
    requirements: ['B.Pharm/D.Pharm', 'Drug counseling', 'Inventory management', 'Regulatory compliance'],
    category: 'pharmacy', domain: 'Healthcare', postedDate: '2025-03-03',
    applyUrl: 'https://in.linkedin.com/jobs/pharmacist-jobs', domainIcon: '💊'
  },
  {
    id: uuidv4(), title: 'Clinical Research Associate', company: 'Quintiles IQVIA', location: 'Hyderabad', type: 'Full-time',
    experience: '1-4 years', salary: '₹5-10 LPA', remote: false,
    skills: ['clinical research', 'gcp', 'clinical trials', 'regulatory affairs', 'medical writing', 'sop', 'pharmacovigilance'],
    description: 'Monitor clinical trials, ensure GCP compliance, manage study data and assist in regulatory submissions.',
    requirements: ['Life sciences degree', 'GCP training', 'Clinical trial management', 'ICH guidelines knowledge'],
    category: 'research', domain: 'Medical', postedDate: '2025-03-02',
    applyUrl: 'https://in.linkedin.com/jobs/clinical-research-associate-jobs', domainIcon: '🔬'
  },
  {
    id: uuidv4(), title: 'Hospital Administrator', company: 'Manipal Hospitals', location: 'Bangalore', type: 'Full-time',
    experience: '3-7 years', salary: '₹8-15 LPA', remote: false,
    skills: ['hospital administration', 'operations management', 'budgeting', 'hr management', 'healthcare management', 'compliance'],
    description: 'Oversee hospital operations, manage staff, budgets and ensure quality patient care delivery.',
    requirements: ['MHA/MBA Healthcare', 'Hospital operations', 'Team leadership', 'Budget management'],
    category: 'administration', domain: 'Healthcare', postedDate: '2025-03-01',
    applyUrl: 'https://in.linkedin.com/jobs/hospital-administrator-jobs', domainIcon: '🏥'
  },
  {
    id: uuidv4(), title: 'Mental Health Counselor', company: 'iCall (TISS)', location: 'Mumbai', type: 'Full-time',
    experience: '1-3 years', salary: '₹4-8 LPA', remote: true,
    skills: ['counseling', 'psychology', 'mental health', 'cbt', 'psychotherapy', 'assessment', 'empathy'],
    description: 'Provide individual and group counseling sessions for mental health issues including anxiety and depression.',
    requirements: ['MSc Psychology/MA Counseling', 'CBT certification', 'Active listening skills', 'Crisis intervention'],
    category: 'psychology', domain: 'Healthcare', postedDate: '2025-03-05',
    applyUrl: 'https://in.linkedin.com/jobs/mental-health-counselor-jobs', domainIcon: '🧠'
  },

  // ══════════════ FINANCE / BANKING ══════════════
  {
    id: uuidv4(), title: 'Financial Analyst', company: 'HDFC Bank', location: 'Mumbai', type: 'Full-time',
    experience: '1-4 years', salary: '₹6-12 LPA', remote: false,
    skills: ['financial modeling', 'excel', 'valuation', 'financial analysis', 'accounting', 'cfa', 'power bi', 'sql'],
    description: 'Conduct financial analysis, build models and support investment decisions for the corporate banking team.',
    requirements: ['CFA/MBA Finance', 'Financial modeling', 'Excel proficiency', 'Valuation techniques'],
    category: 'finance', domain: 'Finance', postedDate: '2025-03-02',
    applyUrl: 'https://in.linkedin.com/jobs/financial-analyst-jobs', domainIcon: '💰'
  },
  {
    id: uuidv4(), title: 'Chartered Accountant (CA)', company: 'Deloitte India', location: 'Bangalore', type: 'Full-time',
    experience: '0-3 years', salary: '₹8-18 LPA', remote: false,
    skills: ['ca', 'auditing', 'taxation', 'accounting standards', 'tally', 'gst', 'income tax', 'ifrs'],
    description: 'Handle auditing, tax compliance and financial advisory for diverse client portfolios.',
    requirements: ['CA qualification', 'Audit experience', 'Taxation knowledge', 'GST compliance'],
    category: 'accounting', domain: 'Finance', postedDate: '2025-03-03',
    applyUrl: 'https://in.linkedin.com/jobs/chartered-accountant-jobs', domainIcon: '📋'
  },
  {
    id: uuidv4(), title: 'Investment Banker (Associate)', company: 'JP Morgan India', location: 'Mumbai', type: 'Full-time',
    experience: '2-5 years', salary: '₹20-40 LPA', remote: false,
    skills: ['investment banking', 'financial modeling', 'ipo', 'mergers acquisitions', 'valuation', 'pitch book', 'excel'],
    description: 'Support M&A transactions, IPOs and structured finance deals for large corporates and PE clients.',
    requirements: ['MBA Finance from top school', 'Investment banking experience', 'CFA preferred', 'Client communication'],
    category: 'investment', domain: 'Finance', postedDate: '2025-03-01',
    applyUrl: 'https://in.linkedin.com/jobs/investment-banker-jobs', domainIcon: '📈'
  },
  {
    id: uuidv4(), title: 'Risk Analyst', company: 'ICICI Bank', location: 'Mumbai', type: 'Full-time',
    experience: '2-5 years', salary: '₹9-16 LPA', remote: false,
    skills: ['risk management', 'credit risk', 'market risk', 'var', 'python', 'sql', 'financial analysis', 'frm'],
    description: 'Assess and manage credit, market and operational risks for the bank\'s loan and investment portfolio.',
    requirements: ['FRM/CFA', 'Risk modeling', 'Python/SQL', 'Banking regulation knowledge'],
    category: 'risk', domain: 'Finance', postedDate: '2025-03-04',
    applyUrl: 'https://in.linkedin.com/jobs/risk-analyst-jobs', domainIcon: '⚖️'
  },
  {
    id: uuidv4(), title: 'Insurance Underwriter', company: 'LIC India', location: 'Delhi', type: 'Full-time',
    experience: '1-4 years', salary: '₹5-10 LPA', remote: false,
    skills: ['underwriting', 'insurance', 'risk assessment', 'actuarial', 'liabilities', 'compliance'],
    description: 'Evaluate insurance applications, assess risk and determine premium rates for life and health policies.',
    requirements: ['Insurance certifications', 'Risk assessment', 'Actuarial knowledge', 'Customer communication'],
    category: 'insurance', domain: 'Finance', postedDate: '2025-03-05',
    applyUrl: 'https://in.linkedin.com/jobs/insurance-underwriter-jobs', domainIcon: '🛡️'
  },
  {
    id: uuidv4(), title: 'Tax Consultant', company: 'EY India', location: 'Pune', type: 'Full-time',
    experience: '1-5 years', salary: '₹6-15 LPA', remote: true,
    skills: ['taxation', 'income tax', 'gst', 'tds', 'tax planning', 'ca', 'compliance', 'tally'],
    description: 'Provide tax advisory and compliance services to corporate clients across diverse industries.',
    requirements: ['CA/CMA', 'Direct and indirect tax', 'GST expertise', 'Client management'],
    category: 'accounting', domain: 'Finance', postedDate: '2025-03-01',
    applyUrl: 'https://in.linkedin.com/jobs/tax-consultant-jobs', domainIcon: '📋'
  },

  // ══════════════ SALES ══════════════
  {
    id: uuidv4(), title: 'Sales Executive (B2B)', company: 'Salesforce India', location: 'Bangalore', type: 'Full-time',
    experience: '1-3 years', salary: '₹5-10 LPA + incentives', remote: false,
    skills: ['b2b sales', 'crm', 'lead generation', 'negotiation', 'salesforce', 'cold calling', 'account management'],
    description: 'Drive B2B sales of SaaS products, manage enterprise accounts and exceed quarterly revenue targets.',
    requirements: ['B2B sales experience', 'CRM tools', 'Strong communication', 'Quota achievement'],
    category: 'sales', domain: 'Sales', postedDate: '2025-03-02',
    applyUrl: 'https://in.linkedin.com/jobs/sales-executive-b2b-jobs', domainIcon: '🤝'
  },
  {
    id: uuidv4(), title: 'Business Development Manager', company: 'Zomato', location: 'Delhi', type: 'Full-time',
    experience: '3-6 years', salary: '₹12-22 LPA', remote: false,
    skills: ['business development', 'partnerships', 'negotiation', 'market analysis', 'crm', 'strategy'],
    description: 'Identify new business opportunities, forge strategic partnerships and grow market share.',
    requirements: ['MBA preferred', 'Business development experience', 'Negotiation skills', 'Market analysis'],
    category: 'sales', domain: 'Sales', postedDate: '2025-03-03',
    applyUrl: 'https://in.linkedin.com/jobs/business-development-manager-jobs', domainIcon: '🤝'
  },
  {
    id: uuidv4(), title: 'Key Account Manager', company: 'Nestlé India', location: 'Mumbai', type: 'Full-time',
    experience: '3-7 years', salary: '₹10-18 LPA', remote: false,
    skills: ['account management', 'sales', 'relationship management', 'fmcg', 'negotiation', 'excel', 'crm'],
    description: 'Manage key retail and distributor accounts, drive category growth and ensure product availability.',
    requirements: ['FMCG experience', 'Account management', 'Distributor handling', 'Excel proficiency'],
    category: 'sales', domain: 'Sales', postedDate: '2025-03-01',
    applyUrl: 'https://in.linkedin.com/jobs/key-account-manager-jobs', domainIcon: '🤝'
  },
  {
    id: uuidv4(), title: 'Inside Sales Representative', company: 'Freshworks', location: 'Chennai', type: 'Full-time',
    experience: '0-2 years', salary: '₹4-8 LPA + incentives', remote: true,
    skills: ['inside sales', 'cold calling', 'crm', 'lead qualification', 'email marketing', 'salesforce', 'communication'],
    description: 'Qualify inbound leads, conduct product demos and close deals for SMB and mid-market clients.',
    requirements: ['Communication skills', 'CRM experience', 'Sales aptitude', 'Product knowledge'],
    category: 'sales', domain: 'Sales', postedDate: '2025-03-04',
    applyUrl: 'https://in.linkedin.com/jobs/inside-sales-jobs', domainIcon: '📞'
  },

  // ══════════════ MARKETING ══════════════
  {
    id: uuidv4(), title: 'Digital Marketing Manager', company: 'Flipkart', location: 'Bangalore', type: 'Full-time',
    experience: '3-6 years', salary: '₹12-22 LPA', remote: false,
    skills: ['digital marketing', 'seo', 'sem', 'google ads', 'facebook ads', 'analytics', 'content marketing', 'social media'],
    description: 'Lead digital marketing campaigns, manage performance budgets and drive customer acquisition at scale.',
    requirements: ['Digital marketing certifications', 'Google/Facebook Ads', 'Analytics tools', 'Team management'],
    category: 'marketing', domain: 'Marketing', postedDate: '2025-03-02',
    applyUrl: 'https://in.linkedin.com/jobs/digital-marketing-manager-jobs', domainIcon: '📢'
  },
  {
    id: uuidv4(), title: 'Content Marketing Specialist', company: 'HubSpot India', location: 'Remote', type: 'Full-time',
    experience: '1-3 years', salary: '₹5-10 LPA', remote: true,
    skills: ['content writing', 'seo', 'blogging', 'social media', 'copywriting', 'email marketing', 'wordpress', 'grammarly'],
    description: 'Create compelling content across blogs, social media and email to drive brand awareness and leads.',
    requirements: ['Content writing', 'SEO knowledge', 'Social media management', 'Editing skills'],
    category: 'marketing', domain: 'Marketing', postedDate: '2025-03-05',
    applyUrl: 'https://in.linkedin.com/jobs/content-marketing-jobs', domainIcon: '✍️'
  },
  {
    id: uuidv4(), title: 'Brand Manager', company: 'Hindustan Unilever', location: 'Mumbai', type: 'Full-time',
    experience: '2-5 years', salary: '₹14-25 LPA', remote: false,
    skills: ['brand management', 'marketing strategy', 'market research', 'advertising', 'p&l management', 'fmcg', 'consumer insights'],
    description: 'Lead brand P&L, develop go-to-market strategies and work with agencies on ATL/BTL campaigns.',
    requirements: ['MBA Marketing', 'FMCG brand experience', 'Consumer research', 'Agency management'],
    category: 'marketing', domain: 'Marketing', postedDate: '2025-03-03',
    applyUrl: 'https://in.linkedin.com/jobs/brand-manager-jobs', domainIcon: '📢'
  },
  {
    id: uuidv4(), title: 'SEO Analyst', company: 'Naukri.com', location: 'Noida', type: 'Full-time',
    experience: '1-3 years', salary: '₹4-8 LPA', remote: true,
    skills: ['seo', 'keyword research', 'google analytics', 'ahrefs', 'semrush', 'technical seo', 'link building', 'content strategy'],
    description: 'Optimize website content and structure to improve organic rankings and drive traffic growth.',
    requirements: ['SEO tools (Ahrefs/SEMrush)', 'Technical SEO', 'Google Analytics', 'Content strategy'],
    category: 'marketing', domain: 'Marketing', postedDate: '2025-03-04',
    applyUrl: 'https://in.linkedin.com/jobs/seo-analyst-jobs', domainIcon: '🔍'
  },

  // ══════════════ MANUFACTURING / ENGINEERING ══════════════
  {
    id: uuidv4(), title: 'Production Engineer', company: 'Tata Motors', location: 'Pune', type: 'Full-time',
    experience: '1-4 years', salary: '₹5-10 LPA', remote: false,
    skills: ['production planning', 'lean manufacturing', 'six sigma', 'quality control', 'autocad', 'manufacturing processes', 'kaizen'],
    description: 'Oversee production lines, improve processes, reduce waste and ensure quality standards in automotive manufacturing.',
    requirements: ['BE Mechanical/Production', 'Lean/Six Sigma', 'AutoCAD', 'Production planning'],
    category: 'manufacturing', domain: 'Manufacturing', postedDate: '2025-03-01',
    applyUrl: 'https://in.linkedin.com/jobs/production-engineer-jobs', domainIcon: '🏭'
  },
  {
    id: uuidv4(), title: 'Quality Control Inspector', company: 'Mahindra & Mahindra', location: 'Nashik', type: 'Full-time',
    experience: '1-5 years', salary: '₹4-8 LPA', remote: false,
    skills: ['quality control', 'quality assurance', 'iso 9001', 'inspection', 'spc', 'defect analysis', 'measurement tools'],
    description: 'Inspect products at various stages of manufacturing to ensure they meet quality specifications.',
    requirements: ['BE/Diploma Engineering', 'QC inspection', 'ISO 9001 knowledge', 'Measurement tools'],
    category: 'quality', domain: 'Manufacturing', postedDate: '2025-03-02',
    applyUrl: 'https://in.linkedin.com/jobs/quality-control-inspector-jobs', domainIcon: '🔧'
  },
  {
    id: uuidv4(), title: 'Mechanical Design Engineer', company: 'L&T Engineering', location: 'Chennai', type: 'Full-time',
    experience: '2-6 years', salary: '₹7-15 LPA', remote: false,
    skills: ['mechanical design', 'solidworks', 'catia', 'ansys', 'autocad', 'fea', 'product design', 'manufacturing'],
    description: 'Design mechanical components and systems for industrial and infrastructure projects using CAD tools.',
    requirements: ['BE Mechanical', 'SolidWorks/CATIA', 'FEA analysis', 'GD&T knowledge'],
    category: 'engineering', domain: 'Manufacturing', postedDate: '2025-03-03',
    applyUrl: 'https://in.linkedin.com/jobs/mechanical-design-engineer-jobs', domainIcon: '⚙️'
  },
  {
    id: uuidv4(), title: 'Supply Chain Manager', company: 'Amazon India', location: 'Hyderabad', type: 'Full-time',
    experience: '4-8 years', salary: '₹16-28 LPA', remote: false,
    skills: ['supply chain management', 'logistics', 'procurement', 'sap', 'inventory management', 'vendor management', 'lean'],
    description: 'Manage end-to-end supply chain operations, optimize inventory and lead cross-functional teams.',
    requirements: ['MBA Operations/SCM', 'SAP ERP', 'Vendor negotiations', 'Supply chain analytics'],
    category: 'supply chain', domain: 'Logistics', postedDate: '2025-03-01',
    applyUrl: 'https://in.linkedin.com/jobs/supply-chain-manager-jobs', domainIcon: '🚚'
  },
  {
    id: uuidv4(), title: 'Electrical Engineer', company: 'Siemens India', location: 'Navi Mumbai', type: 'Full-time',
    experience: '2-5 years', salary: '₹7-13 LPA', remote: false,
    skills: ['electrical engineering', 'plc', 'scada', 'autocad', 'power systems', 'hmi', 'panel design', 'automation'],
    description: 'Design and commission electrical systems, PLC programming and automation for industrial projects.',
    requirements: ['BE Electrical', 'PLC/SCADA', 'Electrical panel design', 'Field commissioning'],
    category: 'engineering', domain: 'Manufacturing', postedDate: '2025-03-02',
    applyUrl: 'https://in.linkedin.com/jobs/electrical-engineer-jobs', domainIcon: '⚡'
  },

  // ══════════════ EDUCATION ══════════════
  {
    id: uuidv4(), title: 'K-12 Science Teacher', company: 'DPS Schools Group', location: 'Delhi', type: 'Full-time',
    experience: '1-5 years', salary: '₹3.5-7 LPA', remote: false,
    skills: ['teaching', 'curriculum development', 'classroom management', 'science', 'lesson planning', 'assessment', 'communication'],
    description: 'Teach Science to students in classes 6-10, develop lesson plans and conduct lab practicals.',
    requirements: ['B.Ed/M.Ed', 'Science subject expertise', 'Classroom management', 'Communication skills'],
    category: 'teaching', domain: 'Education', postedDate: '2025-03-04',
    applyUrl: 'https://in.linkedin.com/jobs/science-teacher-jobs', domainIcon: '📚'
  },
  {
    id: uuidv4(), title: 'EdTech Content Developer', company: 'BYJU\'S', location: 'Bangalore', type: 'Full-time',
    experience: '1-3 years', salary: '₹5-10 LPA', remote: true,
    skills: ['content development', 'curriculum design', 'e-learning', 'instructional design', 'articulate', 'video production', 'lms'],
    description: 'Develop engaging digital learning content for K-12 and competitive exam preparation courses.',
    requirements: ['Education background', 'Instructional design', 'E-learning tools', 'Content writing'],
    category: 'edtech', domain: 'Education', postedDate: '2025-03-05',
    applyUrl: 'https://in.linkedin.com/jobs/edtech-content-developer-jobs', domainIcon: '🎓'
  },
  {
    id: uuidv4(), title: 'University Professor (Computer Science)', company: 'IIT Hyderabad', location: 'Hyderabad', type: 'Full-time',
    experience: '5-10 years', salary: '₹18-30 LPA', remote: false,
    skills: ['computer science', 'research', 'machine learning', 'algorithms', 'teaching', 'phd', 'publications', 'data structures'],
    description: 'Teach undergraduate/postgraduate courses, conduct cutting-edge research and mentor PhD students.',
    requirements: ['PhD Computer Science', 'Research publications', 'Teaching experience', 'Grant writing'],
    category: 'academia', domain: 'Education', postedDate: '2025-03-01',
    applyUrl: 'https://in.linkedin.com/jobs/professor-computer-science-jobs', domainIcon: '📚'
  },
  {
    id: uuidv4(), title: 'Training & Development Manager', company: 'Wipro', location: 'Bangalore', type: 'Full-time',
    experience: '5-9 years', salary: '₹12-22 LPA', remote: false,
    skills: ['training', 'l&d', 'instructional design', 'lms', 'talent development', 'facilitation', 'needs analysis', 'elearning'],
    description: 'Design and implement training programs for technical and leadership skill development across the organization.',
    requirements: ['MBA HR/Training', 'L&D program design', 'LMS platforms', 'Facilitation skills'],
    category: 'training', domain: 'Education', postedDate: '2025-03-03',
    applyUrl: 'https://in.linkedin.com/jobs/training-development-manager-jobs', domainIcon: '🎓'
  },

  // ══════════════ LEGAL ══════════════
  {
    id: uuidv4(), title: 'Corporate Lawyer (LLB)', company: 'Cyril Amarchand Mangaldas', location: 'Mumbai', type: 'Full-time',
    experience: '2-5 years', salary: '₹12-25 LPA', remote: false,
    skills: ['corporate law', 'contract drafting', 'mergers acquisitions', 'due diligence', 'llb', 'legal research', 'compliance'],
    description: 'Handle corporate legal matters including M&A, regulatory compliance, contracts and advisory services.',
    requirements: ['LLB from top law school', 'Corporate law experience', 'Contract drafting', 'M&A deals'],
    category: 'legal', domain: 'Legal', postedDate: '2025-03-02',
    applyUrl: 'https://in.linkedin.com/jobs/corporate-lawyer-jobs', domainIcon: '⚖️'
  },
  {
    id: uuidv4(), title: 'Legal Analyst / Paralegal', company: 'Nishith Desai Associates', location: 'Bangalore', type: 'Full-time',
    experience: '0-2 years', salary: '₹5-9 LPA', remote: false,
    skills: ['legal research', 'contract review', 'llb', 'documentation', 'compliance', 'legal writing', 'ms office'],
    description: 'Assist senior lawyers with legal research, document review and case preparation.',
    requirements: ['LLB degree', 'Legal research skills', 'Document drafting', 'Attention to detail'],
    category: 'legal', domain: 'Legal', postedDate: '2025-03-04',
    applyUrl: 'https://in.linkedin.com/jobs/legal-analyst-jobs', domainIcon: '📜'
  },
  {
    id: uuidv4(), title: 'Compliance Officer', company: 'SEBI-regulated Firm', location: 'Mumbai', type: 'Full-time',
    experience: '3-7 years', salary: '₹10-20 LPA', remote: false,
    skills: ['compliance', 'regulatory affairs', 'sebi regulations', 'risk management', 'legal', 'audit', 'financial regulations'],
    description: 'Ensure the organization complies with all SEBI, RBI and other regulatory requirements.',
    requirements: ['LLB/CS/CA', 'Regulatory knowledge', 'Audit experience', 'Report writing'],
    category: 'compliance', domain: 'Legal', postedDate: '2025-03-01',
    applyUrl: 'https://in.linkedin.com/jobs/compliance-officer-jobs', domainIcon: '📋'
  },

  // ══════════════ GOVERNMENT / PUBLIC SECTOR ══════════════
  {
    id: uuidv4(), title: 'IAS (Civil Services)', company: 'Government of India', location: 'All India', type: 'Government',
    experience: '0 years', salary: '₹6-8 LPA + benefits', remote: false,
    skills: ['civil services', 'upsc', 'public administration', 'policy making', 'governance', 'communication', 'leadership'],
    description: 'Serve as a senior administrative officer implementing government policies and managing public services.',
    requirements: ['UPSC Civil Services exam', 'Graduation degree', 'Leadership', 'Public administration knowledge'],
    category: 'government', domain: 'Government', postedDate: '2025-03-01',
    applyUrl: 'https://upsc.gov.in/', domainIcon: '🏛️'
  },
  {
    id: uuidv4(), title: 'Government Data Analyst', company: 'NASSCOM / MeitY', location: 'Delhi', type: 'Government',
    experience: '2-5 years', salary: '₹7-14 LPA', remote: false,
    skills: ['data analysis', 'python', 'sql', 'tableau', 'public policy', 'data governance', 'excel', 'government systems'],
    description: 'Analyze public sector data to support evidence-based policy decisions and digital India initiatives.',
    requirements: ['Data analysis skills', 'Government domain knowledge', 'Python/SQL', 'Policy understanding'],
    category: 'government', domain: 'Government', postedDate: '2025-03-05',
    applyUrl: 'https://meity.gov.in/careers', domainIcon: '🏛️'
  },
  {
    id: uuidv4(), title: 'Defence Engineer (DRDO)', company: 'DRDO', location: 'Hyderabad', type: 'Government',
    experience: '0-3 years', salary: '₹7-12 LPA', remote: false,
    skills: ['embedded systems', 'electronics', 'signal processing', 'c++', 'matlab', 'defence technology', 'research'],
    description: 'Work on cutting-edge defence R&D projects including missiles, electronics and communication systems.',
    requirements: ['BE/ME Electronics/CS', 'GATE qualified', 'Research aptitude', 'Security clearance'],
    category: 'government', domain: 'Government', postedDate: '2025-03-03',
    applyUrl: 'https://drdo.gov.in/careers', domainIcon: '🎖️'
  },

  // ══════════════ HOSPITALITY ══════════════
  {
    id: uuidv4(), title: 'Hotel General Manager', company: 'Taj Hotels', location: 'Mumbai', type: 'Full-time',
    experience: '8-15 years', salary: '₹25-50 LPA', remote: false,
    skills: ['hotel management', 'operations management', 'guest relations', 'revenue management', 'leadership', 'p&l management', 'f&b'],
    description: 'Lead all hotel operations, manage departments, ensure exceptional guest experience and drive profitability.',
    requirements: ['Hotel Management degree', 'GM experience', 'Revenue management', 'Multi-department leadership'],
    category: 'hospitality', domain: 'Hospitality', postedDate: '2025-03-01',
    applyUrl: 'https://in.linkedin.com/jobs/hotel-general-manager-jobs', domainIcon: '🏨'
  },
  {
    id: uuidv4(), title: 'Front Office Executive', company: 'Marriott Hotels', location: 'Bangalore', type: 'Full-time',
    experience: '0-2 years', salary: '₹3-5 LPA', remote: false,
    skills: ['front office', 'guest relations', 'opera pms', 'check-in check-out', 'communication', 'multitasking', 'hotel management'],
    description: 'Manage guest check-in/check-out, reservations, and provide exceptional front desk service.',
    requirements: ['Hotel Management diploma/degree', 'Opera PMS', 'Communication skills', 'Customer service'],
    category: 'hospitality', domain: 'Hospitality', postedDate: '2025-03-04',
    applyUrl: 'https://in.linkedin.com/jobs/front-office-executive-jobs', domainIcon: '🏨'
  },
  {
    id: uuidv4(), title: 'Executive Chef', company: 'Hyatt Regency', location: 'Delhi', type: 'Full-time',
    experience: '8-15 years', salary: '₹15-30 LPA', remote: false,
    skills: ['culinary arts', 'menu planning', 'food safety', 'haccp', 'kitchen management', 'team leadership', 'cost control', 'f&b'],
    description: 'Lead culinary operations, design menus, manage kitchen brigade and ensure food quality standards.',
    requirements: ['Culinary degree', 'Executive Chef experience', 'HACCP certification', 'Menu engineering'],
    category: 'food & beverage', domain: 'Hospitality', postedDate: '2025-03-02',
    applyUrl: 'https://in.linkedin.com/jobs/executive-chef-jobs', domainIcon: '👨‍🍳'
  },
  {
    id: uuidv4(), title: 'Travel Consultant', company: 'MakeMyTrip', location: 'Gurugram', type: 'Full-time',
    experience: '1-3 years', salary: '₹4-7 LPA', remote: false,
    skills: ['travel planning', 'amadeus', 'galileo', 'customer service', 'destinations knowledge', 'sales', 'communication'],
    description: 'Plan and book international and domestic travel packages, corporate travel and group tours.',
    requirements: ['Travel & Tourism degree', 'GDS systems (Amadeus/Galileo)', 'Geography knowledge', 'Sales skills'],
    category: 'travel', domain: 'Hospitality', postedDate: '2025-03-05',
    applyUrl: 'https://in.linkedin.com/jobs/travel-consultant-jobs', domainIcon: '✈️'
  },

  // ══════════════ LOGISTICS / SUPPLY CHAIN ══════════════
  {
    id: uuidv4(), title: 'Logistics Manager', company: 'BlueDart Express', location: 'Chennai', type: 'Full-time',
    experience: '4-8 years', salary: '₹10-18 LPA', remote: false,
    skills: ['logistics', 'supply chain', 'fleet management', 'warehouse management', 'routing', 'vendor management', 'kpi management'],
    description: 'Manage last-mile and middle-mile logistics operations, fleet, vendor relationships and delivery KPIs.',
    requirements: ['MBA Operations/Logistics', 'Fleet management', 'WMS experience', 'Team leadership'],
    category: 'logistics', domain: 'Logistics', postedDate: '2025-03-02',
    applyUrl: 'https://in.linkedin.com/jobs/logistics-manager-jobs', domainIcon: '🚚'
  },
  {
    id: uuidv4(), title: 'Warehouse Operations Executive', company: 'Delhivery', location: 'Gurgaon', type: 'Full-time',
    experience: '1-4 years', salary: '₹4-7 LPA', remote: false,
    skills: ['warehouse management', 'inventory control', 'wms', 'sap', 'logistics', 'barcode scanning', 'order fulfillment'],
    description: 'Manage daily warehouse operations including receiving, storage, order picking and dispatch.',
    requirements: ['Logistics/Commerce degree', 'WMS tools', 'Inventory management', 'Physical stamina'],
    category: 'logistics', domain: 'Logistics', postedDate: '2025-03-03',
    applyUrl: 'https://in.linkedin.com/jobs/warehouse-executive-jobs', domainIcon: '📦'
  },
  {
    id: uuidv4(), title: 'Procurement Specialist', company: 'Reliance Industries', location: 'Mumbai', type: 'Full-time',
    experience: '2-6 years', salary: '₹7-14 LPA', remote: false,
    skills: ['procurement', 'vendor management', 'negotiation', 'sap', 'supplier evaluation', 'contract management', 'cost reduction'],
    description: 'Source suppliers, negotiate contracts and manage vendor relationships for industrial procurement.',
    requirements: ['Engineering/MBA', 'SAP MM module', 'Vendor negotiations', 'Cost analysis'],
    category: 'procurement', domain: 'Logistics', postedDate: '2025-03-04',
    applyUrl: 'https://in.linkedin.com/jobs/procurement-specialist-jobs', domainIcon: '📦'
  },

  // ══════════════ HR / HUMAN RESOURCES ══════════════
  {
    id: uuidv4(), title: 'HR Manager', company: 'Infosys', location: 'Mysore', type: 'Full-time',
    experience: '5-9 years', salary: '₹12-20 LPA', remote: false,
    skills: ['hr management', 'recruitment', 'employee relations', 'payroll', 'hris', 'performance management', 'labor law', 'talent acquisition'],
    description: 'Lead HR operations including talent acquisition, employee engagement, performance management and compliance.',
    requirements: ['MBA HR', 'Full-cycle HR experience', 'Labor law knowledge', 'HRIS systems'],
    category: 'hr', domain: 'HR', postedDate: '2025-03-02',
    applyUrl: 'https://in.linkedin.com/jobs/hr-manager-jobs', domainIcon: '👥'
  },
  {
    id: uuidv4(), title: 'Talent Acquisition Specialist', company: 'Razorpay', location: 'Bangalore', type: 'Full-time',
    experience: '2-5 years', salary: '₹7-14 LPA', remote: true,
    skills: ['talent acquisition', 'recruitment', 'sourcing', 'linkedin', 'applicant tracking system', 'interviewing', 'campus hiring'],
    description: 'Drive end-to-end recruitment for tech and business roles, manage ATS and build talent pipelines.',
    requirements: ['HR/Recruitment experience', 'LinkedIn Recruiter', 'ATS tools', 'Tech recruitment experience'],
    category: 'hr', domain: 'HR', postedDate: '2025-03-05',
    applyUrl: 'https://in.linkedin.com/jobs/talent-acquisition-specialist-jobs', domainIcon: '👥'
  },

  // ══════════════ REAL ESTATE / CONSTRUCTION ══════════════
  {
    id: uuidv4(), title: 'Civil Site Engineer', company: 'DLF Ltd', location: 'Gurugram', type: 'Full-time',
    experience: '1-5 years', salary: '₹5-10 LPA', remote: false,
    skills: ['civil engineering', 'autocad', 'project management', 'site supervision', 'rcc design', 'ms project', 'estimation'],
    description: 'Supervise construction activities on site, coordinate with contractors and ensure quality standards.',
    requirements: ['BE Civil Engineering', 'Site supervision', 'AutoCAD', 'Construction management'],
    category: 'construction', domain: 'Real Estate', postedDate: '2025-03-01',
    applyUrl: 'https://in.linkedin.com/jobs/civil-site-engineer-jobs', domainIcon: '🏗️'
  },
  {
    id: uuidv4(), title: 'Real Estate Sales Manager', company: 'Housing.com', location: 'Mumbai', type: 'Full-time',
    experience: '3-7 years', salary: '₹10-18 LPA + incentives', remote: false,
    skills: ['real estate', 'property sales', 'negotiation', 'crm', 'market analysis', 'client management', 'team management'],
    description: 'Lead a team of property consultants, drive residential and commercial property sales targets.',
    requirements: ['Sales experience', 'Real estate knowledge', 'CRM tools', 'Team leadership'],
    category: 'real estate', domain: 'Real Estate', postedDate: '2025-03-03',
    applyUrl: 'https://in.linkedin.com/jobs/real-estate-sales-manager-jobs', domainIcon: '🏠'
  },

  // ══════════════ MEDIA / JOURNALISM ══════════════
  {
    id: uuidv4(), title: 'Journalist / Reporter', company: 'NDTV', location: 'Delhi', type: 'Full-time',
    experience: '1-4 years', salary: '₹4-9 LPA', remote: false,
    skills: ['journalism', 'reporting', 'writing', 'video editing', 'social media', 'research', 'communication', 'news writing'],
    description: 'Report on breaking news, conduct interviews, write stories and create digital content for broadcast and online.',
    requirements: ['Mass Communication/Journalism degree', 'Writing skills', 'Video editing', 'Source development'],
    category: 'media', domain: 'Media', postedDate: '2025-03-04',
    applyUrl: 'https://in.linkedin.com/jobs/journalist-reporter-jobs', domainIcon: '📰'
  },
  {
    id: uuidv4(), title: 'Video Editor / Content Creator', company: 'Zee Entertainment', location: 'Mumbai', type: 'Full-time',
    experience: '1-3 years', salary: '₹4-8 LPA', remote: true,
    skills: ['video editing', 'adobe premiere', 'after effects', 'color grading', 'storytelling', 'youtube', 'content creation', 'photoshop'],
    description: 'Edit video content for TV shows, digital campaigns and social media across all platforms.',
    requirements: ['Adobe Premiere/Final Cut', 'After Effects', 'Storytelling', 'Color grading'],
    category: 'media', domain: 'Media', postedDate: '2025-03-05',
    applyUrl: 'https://in.linkedin.com/jobs/video-editor-jobs', domainIcon: '🎬'
  },

  // ══════════════ RETAIL / E-COMMERCE ══════════════
  {
    id: uuidv4(), title: 'Category Manager (E-commerce)', company: 'Myntra', location: 'Bangalore', type: 'Full-time',
    experience: '3-6 years', salary: '₹12-22 LPA', remote: false,
    skills: ['category management', 'e-commerce', 'merchandising', 'analytics', 'vendor management', 'pricing strategy', 'sql'],
    description: 'Own a product category P&L, manage vendor relationships and drive GMV growth on the platform.',
    requirements: ['MBA preferred', 'E-commerce category experience', 'SQL', 'Vendor negotiations'],
    category: 'ecommerce', domain: 'Retail', postedDate: '2025-03-02',
    applyUrl: 'https://in.linkedin.com/jobs/category-manager-ecommerce-jobs', domainIcon: '🛒'
  },

  // ══════════════ EXCEL / OFFICE / DATA OPS ══════════════
  {
    id: uuidv4(), title: 'Data Entry Executive (Excel)', company: 'Wipro BPS', location: 'Pune', type: 'Full-time',
    experience: '0-2 years', salary: '₹2.5-4.5 LPA', remote: false,
    skills: ['excel', 'ms excel', 'data entry', 'ms office', 'typing', 'spreadsheet', 'accuracy'],
    description: 'Maintain accurate spreadsheets, enter and validate data in Excel, and support daily reporting.',
    requirements: ['MS Excel basics', 'Fast and accurate typing', 'Attention to detail', 'MS Office'],
    category: 'operations', domain: 'Finance', postedDate: '2025-03-05',
    applyUrl: 'https://in.linkedin.com/jobs/data-entry-excel-jobs', domainIcon: '📊'
  },
  {
    id: uuidv4(), title: 'Excel / MIS Executive', company: 'Genpact', location: 'Hyderabad', type: 'Full-time',
    experience: '1-3 years', salary: '₹3.5-6 LPA', remote: false,
    skills: ['excel', 'advanced excel', 'pivot tables', 'vlookup', 'mis', 'reporting', 'ms office', 'data analysis'],
    description: 'Build MIS reports in Excel using pivot tables, VLOOKUP/XLOOKUP, and support ops dashboards.',
    requirements: ['Advanced Excel', 'Pivot tables & VLOOKUP', 'MIS reporting', '1+ years Excel experience'],
    category: 'operations', domain: 'Finance', postedDate: '2025-03-05',
    applyUrl: 'https://in.linkedin.com/jobs/mis-executive-jobs', domainIcon: '📊'
  },
  {
    id: uuidv4(), title: 'Junior Data Analyst (Excel)', company: 'Mu Sigma', location: 'Bangalore', type: 'Full-time',
    experience: '0-2 years', salary: '₹4-7 LPA', remote: true,
    skills: ['excel', 'data analysis', 'sql', 'powerpoint', 'reporting', 'dashboard', 'google sheets'],
    description: 'Analyze datasets in Excel/Sheets, prepare insights decks, and support analytics projects.',
    requirements: ['Strong Excel skills', 'Basic SQL preferred', 'Data storytelling', 'Fresher/junior friendly'],
    category: 'data', domain: 'IT', postedDate: '2025-03-05',
    applyUrl: 'https://in.linkedin.com/jobs/junior-data-analyst-jobs', domainIcon: '📈'
  },
  {
    id: uuidv4(), title: 'Business Analyst (Excel + Reporting)', company: 'Deloitte', location: 'Mumbai', type: 'Full-time',
    experience: '1-4 years', salary: '₹6-12 LPA', remote: false,
    skills: ['excel', 'advanced excel', 'business analysis', 'reporting', 'powerpoint', 'sql', 'data analysis', 'stakeholder management'],
    description: 'Gather requirements, analyze business data in Excel, and present findings to stakeholders.',
    requirements: ['Advanced Excel', 'Business analysis', 'Reporting & PowerPoint', '1-4 years experience'],
    category: 'data', domain: 'Consulting', postedDate: '2025-03-04',
    applyUrl: 'https://in.linkedin.com/jobs/business-analyst-excel-jobs', domainIcon: '📋'
  },
  {
    id: uuidv4(), title: 'Finance Analyst (Advanced Excel)', company: 'EY India', location: 'Gurgaon', type: 'Full-time',
    experience: '1-3 years', salary: '₹5-10 LPA', remote: false,
    skills: ['excel', 'advanced excel', 'financial analysis', 'financial modeling', 'powerpoint', 'accounting', 'reporting'],
    description: 'Support FP&A with Excel models, variance analysis, and monthly finance packs.',
    requirements: ['Advanced Excel modeling', 'Finance/accounting basics', 'Strong reporting skills'],
    category: 'finance', domain: 'Finance', postedDate: '2025-03-04',
    applyUrl: 'https://in.linkedin.com/jobs/finance-analyst-excel-jobs', domainIcon: '💰'
  },
  {
    id: uuidv4(), title: 'Operations Analyst (Excel)', company: 'Amazon', location: 'Chennai', type: 'Full-time',
    experience: '2-4 years', salary: '₹6-11 LPA', remote: false,
    skills: ['excel', 'advanced excel', 'operations', 'data analysis', 'kpi', 'reporting', 'sql', 'process improvement'],
    description: 'Track ops KPIs in Excel, identify process gaps, and drive weekly performance reviews.',
    requirements: ['2+ years Excel/analytics', 'Operations mindset', 'KPI reporting'],
    category: 'operations', domain: 'Logistics', postedDate: '2025-03-03',
    applyUrl: 'https://in.linkedin.com/jobs/operations-analyst-jobs', domainIcon: '📦'
  },

  // ══════════════ CONSULTING ══════════════
  {
    id: uuidv4(), title: 'Management Consultant', company: 'McKinsey & Company India', location: 'Mumbai', type: 'Full-time',
    experience: '2-5 years', salary: '₹25-50 LPA', remote: false,
    skills: ['consulting', 'strategy', 'problem solving', 'business analysis', 'excel', 'powerpoint', 'data analysis', 'client management'],
    description: 'Work with CEOs and boards to solve complex strategic and operational challenges across industries.',
    requirements: ['MBA from top school', 'Consulting experience', 'Analytical thinking', 'Structured communication'],
    category: 'consulting', domain: 'Consulting', postedDate: '2025-03-03',
    applyUrl: 'https://in.linkedin.com/jobs/management-consultant-jobs', domainIcon: '💼'
  },
  {
    id: uuidv4(), title: 'IT Consultant (SAP)', company: 'Accenture', location: 'Hyderabad', type: 'Full-time',
    experience: '3-7 years', salary: '₹12-25 LPA', remote: true,
    skills: ['sap', 'erp', 'sap fi/co', 'sap mm', 'abap', 'business analysis', 'consulting', 'project management'],
    description: 'Implement and customize SAP modules for enterprise clients across finance, logistics and HR.',
    requirements: ['SAP certification', 'Module expertise', 'Client communication', 'Business process knowledge'],
    category: 'consulting', domain: 'IT', postedDate: '2025-03-04',
    applyUrl: 'https://in.linkedin.com/jobs/sap-consultant-jobs', domainIcon: '💻'
  },

  // ══════════════ AGRICULTURE ══════════════
  {
    id: uuidv4(), title: 'Agronomist / Agriculture Consultant', company: 'ITC Agribusiness', location: 'Hyderabad', type: 'Full-time',
    experience: '2-5 years', salary: '₹5-10 LPA', remote: false,
    skills: ['agronomy', 'crop science', 'soil testing', 'pest management', 'precision farming', 'agricultural technology', 'field work'],
    description: 'Provide agronomic advisory to farmers, support precision agriculture adoption and improve crop yields.',
    requirements: ['BSc/MSc Agriculture', 'Crop science knowledge', 'Field experience', 'Farmer communication'],
    category: 'agriculture', domain: 'Agriculture', postedDate: '2025-03-01',
    applyUrl: 'https://in.linkedin.com/jobs/agronomist-jobs', domainIcon: '🌾'
  },

  // ══════════════ ENVIRONMENT / SUSTAINABILITY ══════════════
  {
    id: uuidv4(), title: 'Environmental Consultant', company: 'ERM India', location: 'Mumbai', type: 'Full-time',
    experience: '2-5 years', salary: '₹7-13 LPA', remote: false,
    skills: ['environmental science', 'eia', 'environmental auditing', 'sustainability', 'air quality', 'water treatment', 'ehs'],
    description: 'Conduct Environmental Impact Assessments, sustainability audits and advise on regulatory compliance.',
    requirements: ['MSc Environmental Science', 'EIA experience', 'EHS regulations', 'Report writing'],
    category: 'environment', domain: 'Environment', postedDate: '2025-03-02',
    applyUrl: 'https://in.linkedin.com/jobs/environmental-consultant-jobs', domainIcon: '🌿'
  },

  // ══════════════ SOCIAL WORK / NGO ══════════════
  {
    id: uuidv4(), title: 'Social Worker / Program Officer', company: 'CRY India', location: 'Delhi', type: 'Full-time',
    experience: '1-4 years', salary: '₹3.5-7 LPA', remote: false,
    skills: ['social work', 'community development', 'project management', 'fundraising', 'msw', 'communication', 'ngo management'],
    description: 'Implement community development programs for underprivileged children, monitor impact and engage donors.',
    requirements: ['MSW degree', 'Community work experience', 'Report writing', 'Program management'],
    category: 'ngo', domain: 'Social', postedDate: '2025-03-05',
    applyUrl: 'https://in.linkedin.com/jobs/social-worker-ngo-jobs', domainIcon: '❤️'
  },

  // ══════════════ AVIATION ══════════════
  {
    id: uuidv4(), title: 'Commercial Pilot (CPL)', company: 'IndiGo Airlines', location: 'Delhi', type: 'Full-time',
    experience: '0-2 years', salary: '₹18-30 LPA', remote: false,
    skills: ['cpl', 'aviation', 'atpl', 'navigation', 'flight operations', 'atc communication', 'cpr', 'emergency procedures'],
    description: 'Fly commercial aircraft safely, adhere to DGCA regulations and ensure passenger safety standards.',
    requirements: ['CPL license', 'DGCA medical', 'Type rating', 'English proficiency'],
    category: 'aviation', domain: 'Aviation', postedDate: '2025-03-03',
    applyUrl: 'https://in.linkedin.com/jobs/commercial-pilot-jobs', domainIcon: '✈️'
  },

  // ══════════════ TELECOM ══════════════
  {
    id: uuidv4(), title: 'Network Engineer (5G)', company: 'Jio Platforms', location: 'Mumbai', type: 'Full-time',
    experience: '2-6 years', salary: '₹9-18 LPA', remote: false,
    skills: ['networking', '5g', 'network planning', 'routing', 'switching', 'rf engineering', 'cisco', 'ccna'],
    description: 'Plan and deploy 5G network infrastructure, optimize coverage and capacity for nationwide rollout.',
    requirements: ['CCNA/CCNP', '5G knowledge', 'RF planning tools', 'Network troubleshooting'],
    category: 'telecom', domain: 'Telecom', postedDate: '2025-03-04',
    applyUrl: 'https://in.linkedin.com/jobs/network-engineer-5g-jobs', domainIcon: '📡'
  },

  // ══════════════ PART-TIME / HYBRID / ONSITE / REMOTE MIX ══════════════
  {
    id: uuidv4(), title: 'Part-time Excel Data Associate', company: 'Concentrix', location: 'Mumbai', type: 'Part-time',
    experience: '0-2 years', salary: '₹15-25k/month', remote: false, workMode: 'Onsite',
    skills: ['excel', 'ms excel', 'data entry', 'ms office', 'spreadsheet', 'accuracy'],
    description: 'Part-time onsite Excel data entry and sheet cleanup for client operations teams.',
    requirements: ['MS Excel', 'Part-time availability', 'Attention to detail'],
    category: 'operations', domain: 'Finance', postedDate: '2025-03-06',
    applyUrl: 'https://in.linkedin.com/jobs/part-time-excel-jobs', domainIcon: '📊'
  },
  {
    id: uuidv4(), title: 'Hybrid MIS Analyst', company: 'TCS BPS', location: 'Pune', type: 'Full-time',
    experience: '1-3 years', salary: '₹4-7 LPA', remote: false, workMode: 'Hybrid',
    skills: ['excel', 'advanced excel', 'pivot tables', 'vlookup', 'reporting', 'mis', 'data analysis'],
    description: 'Hybrid MIS role building Excel dashboards with 2–3 office days per week.',
    requirements: ['Advanced Excel', 'MIS experience', 'Comfortable with hybrid work'],
    category: 'operations', domain: 'Finance', postedDate: '2025-03-06',
    applyUrl: 'https://in.linkedin.com/jobs/mis-analyst-hybrid-jobs', domainIcon: '📊'
  },
  {
    id: uuidv4(), title: 'Remote Content Writer (Part-time)', company: 'WriteRight Studio', location: 'Remote', type: 'Part-time',
    experience: '0-3 years', salary: '₹20-40k/month', remote: true, workMode: 'Remote',
    skills: ['content writing', 'seo', 'blogging', 'copywriting', 'wordpress', 'communication'],
    description: 'Write blog and website content remotely on a flexible part-time schedule.',
    requirements: ['Strong English writing', 'SEO basics', 'Remote-ready setup'],
    category: 'content', domain: 'Marketing', postedDate: '2025-03-06',
    applyUrl: 'https://in.linkedin.com/jobs/part-time-content-writer-jobs', domainIcon: '✍️'
  },
  {
    id: uuidv4(), title: 'Onsite Customer Support Executive', company: 'Airtel', location: 'Delhi', type: 'Full-time',
    experience: '0-2 years', salary: '₹3-5 LPA', remote: false, workMode: 'Onsite',
    skills: ['communication', 'customer service', 'crm', 'ms office', 'excel', 'problem solving'],
    description: 'Full-time onsite support handling customer queries and CRM updates.',
    requirements: ['Good communication', 'Shift flexibility', 'MS Office'],
    category: 'support', domain: 'Telecom', postedDate: '2025-03-06',
    applyUrl: 'https://in.linkedin.com/jobs/customer-support-executive-jobs', domainIcon: '📞'
  },
  {
    id: uuidv4(), title: 'Hybrid Frontend Developer', company: 'Zoho', location: 'Chennai', type: 'Full-time',
    experience: '1-3 years', salary: '₹6-12 LPA', remote: false, workMode: 'Hybrid',
    skills: ['react', 'javascript', 'html', 'css', 'typescript', 'git', 'redux'],
    description: 'Build UI features in a hybrid setup with office collaboration days.',
    requirements: ['React.js', 'Responsive UI', 'Hybrid work readiness'],
    category: 'frontend', domain: 'IT', postedDate: '2025-03-06',
    applyUrl: 'https://in.linkedin.com/jobs/hybrid-frontend-developer-jobs', domainIcon: '💻'
  },
  {
    id: uuidv4(), title: 'Part-time Online Tutor (Math/Science)', company: 'Vedantu', location: 'Remote', type: 'Part-time',
    experience: '0-4 years', salary: '₹15-35k/month', remote: true, workMode: 'Remote',
    skills: ['teaching', 'tutoring', 'communication', 'lesson planning', 'assessment'],
    description: 'Teach K-12 students online on evenings/weekends as a part-time tutor.',
    requirements: ['Subject expertise', 'Stable internet', 'Teaching passion'],
    category: 'teaching', domain: 'Education', postedDate: '2025-03-06',
    applyUrl: 'https://in.linkedin.com/jobs/online-tutor-jobs', domainIcon: '📚'
  },
  {
    id: uuidv4(), title: 'Contract QA Tester (Remote)', company: 'BrowserStack', location: 'Remote', type: 'Contract',
    experience: '1-4 years', salary: '₹40-70k/month', remote: true, workMode: 'Remote',
    skills: ['manual testing', 'qa', 'selenium', 'bug tracking', 'jira', 'test cases'],
    description: 'Remote contract QA testing for web and mobile releases.',
    requirements: ['Manual/automation QA', 'Bug reporting', 'Contract availability'],
    category: 'qa', domain: 'IT', postedDate: '2025-03-06',
    applyUrl: 'https://in.linkedin.com/jobs/contract-qa-tester-jobs', domainIcon: '🧪'
  },
  {
    id: uuidv4(), title: 'Hybrid HR Coordinator', company: 'Capgemini', location: 'Bangalore', type: 'Full-time',
    experience: '1-3 years', salary: '₹4-7 LPA', remote: false, workMode: 'Hybrid',
    skills: ['hr management', 'recruitment', 'excel', 'ms office', 'payroll', 'employee relations'],
    description: 'Coordinate HR ops in a hybrid model — onboarding, Excel trackers, and employee support.',
    requirements: ['HR coordination', 'Excel proficiency', 'Hybrid schedule'],
    category: 'hr', domain: 'HR', postedDate: '2025-03-06',
    applyUrl: 'https://in.linkedin.com/jobs/hr-coordinator-jobs', domainIcon: '👥'
  },
  {
    id: uuidv4(), title: 'Onsite Warehouse Associate', company: 'Flipkart Logistics', location: 'Hyderabad', type: 'Full-time',
    experience: '0-2 years', salary: '₹2.8-4.5 LPA', remote: false, workMode: 'Onsite',
    skills: ['warehouse management', 'inventory management', 'barcode scanning', 'logistics', 'order fulfillment'],
    description: 'Onsite warehouse picking, packing, and inventory handling.',
    requirements: ['Physical fitness', 'Shift readiness', 'Basic computer skills'],
    category: 'warehouse', domain: 'Logistics', postedDate: '2025-03-06',
    applyUrl: 'https://in.linkedin.com/jobs/warehouse-associate-jobs', domainIcon: '📦'
  },
  {
    id: uuidv4(), title: 'Part-time Accounting Assistant', company: 'Local CA Firm', location: 'Mumbai', type: 'Part-time',
    experience: '0-3 years', salary: '₹12-22k/month', remote: false, workMode: 'Onsite',
    skills: ['accounting', 'tally', 'excel', 'gst', 'bookkeeping', 'ms office'],
    description: 'Part-time onsite support for bookkeeping, Tally entries, and Excel reconciliations.',
    requirements: ['Tally/Excel basics', 'Part-time schedule', 'Accounting fundamentals'],
    category: 'finance', domain: 'Finance', postedDate: '2025-03-06',
    applyUrl: 'https://in.linkedin.com/jobs/part-time-accountant-jobs', domainIcon: '💰'
  },

];

// Normalize every job with type + workMode so filters work consistently
function enrichJob(job, index) {
  let workMode = job.workMode;
  if (!workMode) {
    if (job.remote || /^remote$/i.test(String(job.location || '').trim())) {
      workMode = 'Remote';
    } else if (index % 4 === 0) {
      workMode = 'Hybrid';
    } else {
      workMode = 'Onsite';
    }
  }

  let type = job.type || 'Full-time';
  // Diversify a subset of suitable roles into Part-time (unless already set)
  if (
    type === 'Full-time' &&
    !job.workMode &&
    /tutor|counselor|content|data entry|seo|sales representative|pharmacist|inside sales|video editor|social worker/i.test(job.title) &&
    index % 2 === 0
  ) {
    type = 'Part-time';
  }

  return {
    ...job,
    type,
    workMode,
    remote: workMode === 'Remote',
  };
}

const enrichedJobsDatabase = jobsDatabase.map(enrichJob);

module.exports = { jobsDatabase: enrichedJobsDatabase };
