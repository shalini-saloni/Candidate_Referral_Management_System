require('dotenv').config();
const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const sampleCandidates = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0101',
    jobTitle: 'Senior Software Engineer',
    status: 'Pending',
    notes: 'Strong background in React and Node.js'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1-555-0102',
    jobTitle: 'Product Manager',
    status: 'Reviewed',
    notes: 'Excellent communication skills and product vision'
  },
  {
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    phone: '+1-555-0103',
    jobTitle: 'UX Designer',
    status: 'Hired',
    notes: 'Portfolio showcases impressive design work'
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '+1-555-0104',
    jobTitle: 'Data Scientist',
    status: 'Pending',
    notes: 'PhD in Machine Learning from Stanford'
  },
  {
    name: 'Robert Brown',
    email: 'robert.brown@example.com',
    phone: '+1-555-0105',
    jobTitle: 'DevOps Engineer',
    status: 'Reviewed',
    notes: 'Expert in Kubernetes and AWS infrastructure'
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+1-555-0106',
    jobTitle: 'Marketing Manager',
    status: 'Pending',
    notes: 'Led successful campaigns for Fortune 500 companies'
  },
  {
    name: 'David Martinez',
    email: 'david.m@example.com',
    phone: '+1-555-0107',
    jobTitle: 'Full Stack Developer',
    status: 'Hired',
    notes: 'Contributed to several open-source projects'
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    phone: '+1-555-0108',
    jobTitle: 'HR Manager',
    status: 'Rejected',
    notes: 'Not a good culture fit'
  }
];

const sampleUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
};

const seedDatabase = async () => {
  try {
    await connectDB();
    await Candidate.deleteMany();
    await User.deleteMany();

    console.log('Existing data cleared');

    const user = await User.create(sampleUser);
    console.log('Sample user created:', user.email);

    const candidates = await Candidate.insertMany(sampleCandidates);
    console.log(`${candidates.length} sample candidates created`);

    console.log('Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
