// Mock job database — replace with real DB (MongoDB/PostgreSQL) in production
const { v4: uuidv4 } = require('uuid');

const jobsDatabase = [
  {
    id: uuidv4(), title: 'Frontend Developer', company: 'TechCorp India', location: 'Bangalore', type: 'Full-time',
    experience: '0-2 years', salary: '₹4-8 LPA', remote: true,
    skills: ['react', 'javascript', 'html', 'css', 'typescript', 'redux', 'git'],
    description: 'Build modern web apps using React. Work with design and backend teams.',
    requirements: ['React.js proficiency', 'REST API integration', 'Responsive design'],
    category: 'frontend', postedDate: '2025-03-01'
  },
  {
    id: uuidv4(), title: 'Full Stack Developer', company: 'StartupHub', location: 'Pune', type: 'Full-time',
    experience: '1-3 years', salary: '₹6-12 LPA', remote: false,
    skills: ['nodejs', 'react', 'mongodb', 'express', 'javascript', 'rest api', 'git'],
    description: 'Own end-to-end product features from database to UI.',
    requirements: ['MERN stack', 'Database design', 'API development'],
    category: 'fullstack', postedDate: '2025-03-02'
  },
  {
    id: uuidv4(), title: 'Backend Developer (Node.js)', company: 'FinTech Solutions', location: 'Mumbai', type: 'Full-time',
    experience: '2-5 years', salary: '₹10-18 LPA', remote: true,
    skills: ['nodejs', 'express', 'postgresql', 'redis', 'docker', 'aws', 'microservices'],
    description: 'Design and build scalable backend services for financial products.',
    requirements: ['Node.js expert', 'SQL/NoSQL databases', 'Cloud deployment'],
    category: 'backend', postedDate: '2025-03-01'
  },
  {
    id: uuidv4(), title: 'Python Developer', company: 'DataDriven Co.', location: 'Hyderabad', type: 'Full-time',
    experience: '1-4 years', salary: '₹7-14 LPA', remote: true,
    skills: ['python', 'django', 'flask', 'postgresql', 'celery', 'aws', 'docker'],
    description: 'Build data pipelines and backend APIs in Python.',
    requirements: ['Python 3+', 'Django/Flask', 'Database optimization'],
    category: 'backend', postedDate: '2025-02-28'
  },
  {
    id: uuidv4(), title: 'Data Scientist', company: 'AI Ventures', location: 'Bangalore', type: 'Full-time',
    experience: '1-3 years', salary: '₹8-16 LPA', remote: false,
    skills: ['python', 'machine learning', 'tensorflow', 'pandas', 'numpy', 'sql', 'data analysis', 'scikit-learn'],
    description: 'Build ML models to solve real-world business problems.',
    requirements: ['ML algorithms', 'Python data libraries', 'Statistical analysis'],
    category: 'data', postedDate: '2025-03-03'
  },
  {
    id: uuidv4(), title: 'DevOps Engineer', company: 'CloudScale', location: 'Remote', type: 'Full-time',
    experience: '2-5 years', salary: '₹12-22 LPA', remote: true,
    skills: ['docker', 'kubernetes', 'aws', 'ci/cd', 'jenkins', 'terraform', 'linux', 'bash'],
    description: 'Manage cloud infrastructure and deployment pipelines.',
    requirements: ['Container orchestration', 'CI/CD pipelines', 'IaC tools'],
    category: 'devops', postedDate: '2025-02-25'
  },
  {
    id: uuidv4(), title: 'UI/UX Designer', company: 'DesignFirst', location: 'Delhi', type: 'Full-time',
    experience: '0-2 years', salary: '₹4-9 LPA', remote: true,
    skills: ['figma', 'ui design', 'ux research', 'adobe xd', 'prototyping', 'wireframing', 'css'],
    description: 'Design beautiful, user-centric interfaces for web and mobile.',
    requirements: ['Figma proficiency', 'User research', 'Design systems'],
    category: 'design', postedDate: '2025-03-02'
  },
  {
    id: uuidv4(), title: 'Android Developer', company: 'MobileFirst', location: 'Chennai', type: 'Full-time',
    experience: '1-3 years', salary: '₹6-13 LPA', remote: false,
    skills: ['android', 'kotlin', 'java', 'rest api', 'sqlite', 'firebase', 'mvvm'],
    description: 'Build and maintain Android applications for millions of users.',
    requirements: ['Kotlin/Java', 'Android SDK', 'Play Store deployment'],
    category: 'mobile', postedDate: '2025-03-01'
  },
  {
    id: uuidv4(), title: 'React Native Developer', company: 'CrossPlatform Inc', location: 'Remote', type: 'Contract',
    experience: '1-4 years', salary: '₹7-15 LPA', remote: true,
    skills: ['react native', 'react', 'javascript', 'typescript', 'redux', 'firebase', 'expo'],
    description: 'Build cross-platform mobile apps with React Native.',
    requirements: ['React Native', 'iOS & Android deployment', 'State management'],
    category: 'mobile', postedDate: '2025-02-27'
  },
  {
    id: uuidv4(), title: 'Fresher Software Engineer', company: 'WizTech', location: 'Bangalore', type: 'Full-time',
    experience: '0-1 year', salary: '₹3-5 LPA', remote: false,
    skills: ['java', 'python', 'c++', 'data structures', 'algorithms', 'sql', 'git'],
    description: 'Great opportunity for freshers to kickstart their tech career.',
    requirements: ['CS fundamentals', 'Any programming language', 'Problem solving'],
    category: 'general', postedDate: '2025-03-04'
  },
  {
    id: uuidv4(), title: 'Java Backend Developer', company: 'Enterprise Solutions', location: 'Pune', type: 'Full-time',
    experience: '2-6 years', salary: '₹10-20 LPA', remote: false,
    skills: ['java', 'spring boot', 'microservices', 'sql', 'kafka', 'docker', 'rest api'],
    description: 'Develop enterprise-grade backend systems using Java Spring.',
    requirements: ['Spring Boot', 'Microservices architecture', 'JPA/Hibernate'],
    category: 'backend', postedDate: '2025-03-02'
  },
  {
    id: uuidv4(), title: 'Machine Learning Engineer', company: 'DeepMind India', location: 'Bangalore', type: 'Full-time',
    experience: '2-5 years', salary: '₹18-35 LPA', remote: true,
    skills: ['python', 'tensorflow', 'pytorch', 'machine learning', 'deep learning', 'nlp', 'computer vision'],
    description: 'Research and deploy production ML systems at scale.',
    requirements: ['Deep learning frameworks', 'MLOps', 'Research publications preferred'],
    category: 'ai', postedDate: '2025-03-03'
  }
];

module.exports = { jobsDatabase };
