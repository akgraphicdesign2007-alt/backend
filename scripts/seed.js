const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Gallery = require('../models/Gallery');
const Blog = require('../models/Blog');
const Testimonial = require('../models/Testimonial');
const User = require('../models/User'); // Import User model

// Load environment variables
dotenv.config();

// Sample data
const galleryData = [
    {
        title: 'Modern Brand Identity',
        description: 'Complete brand identity design for a tech startup including logo, color palette, and brand guidelines.',
        category: 'Branding',
        imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
        cloudinaryId: 'sample_1',
    },
    {
        title: 'Mobile App UI Design',
        description: 'Clean and intuitive mobile app interface design for a fitness tracking application.',
        category: 'UI/UX',
        imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
        cloudinaryId: 'sample_2',
    },
    {
        title: 'Music Festival Poster',
        description: 'Vibrant poster design for an annual summer music festival featuring bold typography and dynamic composition.',
        category: 'Posters',
        imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800',
        cloudinaryId: 'sample_3',
    },
    {
        title: 'Social Media Campaign',
        description: 'Cohesive social media graphics for a product launch campaign across Instagram, Facebook, and Twitter.',
        category: 'Social Media',
        imageUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800',
        cloudinaryId: 'sample_4',
    },
    {
        title: 'Product Animation',
        description: '3D product animation showcasing features and benefits with smooth transitions and dynamic camera movements.',
        category: 'Motion',
        imageUrl: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800',
        cloudinaryId: 'sample_5',
    },
    {
        title: 'Corporate Branding',
        description: 'Professional branding package for a financial services company with elegant and trustworthy design elements.',
        category: 'Branding',
        imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
        cloudinaryId: 'sample_6',
    },
    {
        title: 'E-commerce Website',
        description: 'Modern e-commerce website design with focus on user experience and conversion optimization.',
        category: 'UI/UX',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        cloudinaryId: 'sample_7',
    },
    {
        title: 'Event Poster Series',
        description: 'Series of promotional posters for monthly cultural events with consistent visual language.',
        category: 'Posters',
        imageUrl: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800',
        cloudinaryId: 'sample_8',
    },
];

const blogData = [
    {
        title: 'The Power of Minimalism in Modern Design',
        content: `Minimalism has become one of the most influential design philosophies in recent years. But what makes it so powerful, and how can you apply it to your own work?

In this article, we'll explore the principles of minimalist design and how they can help you create more impactful, user-friendly designs.

The core principle of minimalism is "less is more." By removing unnecessary elements and focusing on what truly matters, we can create designs that are both beautiful and functional.

Key principles of minimalist design:
1. Simplicity - Remove anything that doesn't serve a purpose
2. White space - Use negative space to create breathing room
3. Typography - Let type do the heavy lifting
4. Color - Use a limited, purposeful color palette
5. Functionality - Every element should have a purpose

When applied correctly, minimalism can help your designs communicate more effectively, load faster, and provide a better user experience.`,
        excerpt: 'Discover how minimalist design principles can help you create more impactful and user-friendly designs.',
        category: 'Design Theory',
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        cloudinaryId: 'blog_1',
    },
    {
        title: 'Color Psychology in Branding',
        content: `Color is one of the most powerful tools in a designer's arsenal. The colors you choose for a brand can evoke specific emotions, influence purchasing decisions, and create lasting impressions.

Understanding color psychology is essential for creating effective brand identities. Different colors trigger different emotional responses and associations.

Red: Energy, passion, urgency
Blue: Trust, stability, professionalism
Green: Growth, health, nature
Yellow: Optimism, clarity, warmth
Purple: Luxury, creativity, wisdom

When choosing colors for a brand, consider the target audience, industry, and desired emotional response. Test different combinations and gather feedback to ensure your color choices resonate with your audience.`,
        excerpt: 'Learn how to use color psychology to create more effective and emotionally resonant brand identities.',
        category: 'Branding',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800',
        cloudinaryId: 'blog_2',
    },
    {
        title: '10 UI/UX Trends to Watch in 2024',
        content: `The world of UI/UX design is constantly evolving. Here are the top trends shaping the industry in 2024:

1. AI-Powered Personalization - Interfaces that adapt to individual user preferences
2. Immersive 3D Experiences - More websites incorporating 3D elements
3. Neumorphism Evolution - Soft UI continues to evolve
4. Dark Mode Everywhere - Dark mode as a standard feature
5. Micro-interactions - Subtle animations that enhance UX
6. Voice User Interfaces - Voice commands becoming mainstream
7. Augmented Reality Integration - AR features in everyday apps
8. Sustainable Design - Eco-friendly design practices
9. Inclusive Design - Accessibility as a priority
10. Glassmorphism - Frosted glass effects gaining popularity

Stay ahead of the curve by incorporating these trends thoughtfully into your designs.`,
        excerpt: 'Stay ahead of the curve with these emerging UI/UX design trends that are shaping the industry.',
        category: 'UI/UX',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800',
        cloudinaryId: 'blog_3',
    },
];

const testimonialData = [
    {
        name: 'John Doe',
        role: 'CEO',
        company: 'TechCorp',
        message: 'Anand is an exceptional designer who truly understands user experience. His work transformed our product.',
        approved: true
    },
    {
        name: 'Jane Smith',
        role: 'Marketing Director',
        company: 'Creative Studio',
        message: 'The branding package Anand created for us was exactly what we needed. Highly recommended!',
        approved: true
    },
    {
        name: 'Mike Johnson',
        role: 'Founder',
        company: 'StartupX',
        message: 'Professional, creative, and timely. Working with AK Design was a pleasure.',
        approved: true
    }
];

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            family: 4 // Force IPv4
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await Gallery.deleteMany({});
        await Gallery.deleteMany({});
        await Blog.deleteMany({});
        await Testimonial.deleteMany({});
        await User.deleteMany({}); // Clear users too
        console.log('Cleared existing data');

        // Create Admin User
        await User.create({
            name: 'Anand K',
            email: 'admin@akdesign.com',
            password: 'password123', // Will be hashed by pre-save hook
            role: 'admin'
        });
        console.log('Admin user created (admin@akdesign.com / password123)');

        // Insert gallery items
        await Gallery.insertMany(galleryData);
        console.log(`Inserted ${galleryData.length} gallery items`);

        // Insert blog posts
        for (const blogPost of blogData) {
            await Blog.create(blogPost);
        }
        console.log(`Inserted ${blogData.length} blog posts`);

        // Insert testimonials
        await Testimonial.insertMany(testimonialData);
        console.log(`Inserted ${testimonialData.length} testimonials`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
