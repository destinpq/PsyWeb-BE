import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost, PostStatus } from '../blog/entities/blog-post.entity';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seedAll() {
    await this.seedDoctor();
    await this.seedBlogPosts();
    console.log('✅ All data seeded successfully!');
  }

  private async seedDoctor() {
    const existingDoctor = await this.userRepository.findOne({
      where: { email: 'drakanksha@destinpq.com' }
    });

    if (!existingDoctor) {
      const hashedPassword = await bcrypt.hash('pookie@1234', 10);
      
      const doctor = this.userRepository.create({
        firstName: 'Dr. Akanksha',
        lastName: 'Agarwal',
        email: 'drakanksha@destinpq.com',
        phone: '+1-555-123-4567',
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
        notes: 'Licensed Clinical Psychologist - Main Administrator',
        profilePicture: '/doctor-profile.jpg'
      });

      await this.userRepository.save(doctor);
      console.log('✅ Doctor user created - Email: drakanksha@destinpq.com, Password: pookie@1234');
    }
  }

  private async seedBlogPosts() {
    const blogPosts = [
      {
        title: "Understanding Anxiety: Signs, Symptoms, and Solutions",
        excerpt: "Anxiety affects millions of people worldwide. Learn to recognize the signs and discover effective coping strategies that can help you regain control of your mental health.",
        content: `
          <h2>What is Anxiety?</h2>
          <p>Anxiety is a natural human emotion that everyone experiences from time to time. However, when anxiety becomes persistent, overwhelming, or interferes with daily life, it may indicate an anxiety disorder.</p>
          
          <h3>Common Signs and Symptoms</h3>
          <ul>
            <li>Persistent worry or fear</li>
            <li>Restlessness or feeling on edge</li>
            <li>Difficulty concentrating</li>
            <li>Sleep disturbances</li>
            <li>Physical symptoms like rapid heartbeat or sweating</li>
          </ul>
          
          <h3>Effective Coping Strategies</h3>
          <p>There are many evidence-based approaches to managing anxiety:</p>
          <ol>
            <li><strong>Deep Breathing Exercises:</strong> Practice slow, controlled breathing to activate your body's relaxation response.</li>
            <li><strong>Mindfulness Meditation:</strong> Stay present and observe your thoughts without judgment.</li>
            <li><strong>Progressive Muscle Relaxation:</strong> Systematically tense and release muscle groups to reduce physical tension.</li>
            <li><strong>Cognitive Restructuring:</strong> Challenge negative thought patterns and replace them with more balanced perspectives.</li>
          </ol>
          
          <h3>When to Seek Professional Help</h3>
          <p>If anxiety is significantly impacting your daily life, relationships, or work performance, it's time to consider professional support. Therapy, particularly Cognitive Behavioral Therapy (CBT), has proven highly effective for anxiety disorders.</p>
          
          <p>Remember, seeking help is a sign of strength, not weakness. With the right support and strategies, anxiety can be successfully managed.</p>
        `,
        category: "Mental Health",
        readTime: "5 min read",
        status: PostStatus.PUBLISHED,
        tags: JSON.stringify(["anxiety", "mental health", "coping strategies", "therapy"]),
        publishedAt: new Date('2024-06-10'),
        featuredImage: "/blog/anxiety-management.jpg"
      },
      {
        title: "The Power of Mindfulness in Daily Life",
        excerpt: "Discover how incorporating mindfulness practices into your daily routine can reduce stress, improve focus, and enhance overall well-being.",
        content: `
          <h2>What is Mindfulness?</h2>
          <p>Mindfulness is the practice of paying attention to the present moment with openness, curiosity, and acceptance. It's about being fully engaged with whatever you're doing, free from distraction or judgment.</p>
          
          <h3>Benefits of Mindfulness Practice</h3>
          <ul>
            <li>Reduced stress and anxiety</li>
            <li>Improved emotional regulation</li>
            <li>Enhanced focus and concentration</li>
            <li>Better sleep quality</li>
            <li>Increased self-awareness</li>
            <li>Improved relationships</li>
          </ul>
          
          <h3>Simple Mindfulness Exercises</h3>
          
          <h4>1. Mindful Breathing</h4>
          <p>Spend 5-10 minutes focusing solely on your breath. Notice the sensation of air entering and leaving your body. When your mind wanders, gently return your attention to your breath.</p>
          
          <h4>2. Body Scan</h4>
          <p>Lie down comfortably and systematically bring awareness to each part of your body, from your toes to the top of your head. Notice any sensations without trying to change them.</p>
          
          <h4>3. Mindful Walking</h4>
          <p>Take a slow, deliberate walk while paying attention to the sensation of your feet touching the ground, the rhythm of your steps, and the environment around you.</p>
          
          <h3>Incorporating Mindfulness Into Daily Activities</h3>
          <p>You don't need to set aside hours for mindfulness practice. Try these simple approaches:</p>
          <ul>
            <li>Eat meals without distractions, savoring each bite</li>
            <li>Listen fully when others are speaking</li>
            <li>Take three deep breaths before responding to stressful situations</li>
            <li>Notice the details of your surroundings during routine activities</li>
          </ul>
          
          <p>Remember, mindfulness is a skill that develops over time. Be patient with yourself as you build this practice.</p>
        `,
        category: "Wellness",
        readTime: "6 min read",
        status: PostStatus.PUBLISHED,
        tags: JSON.stringify(["mindfulness", "meditation", "stress relief", "wellness"]),
        publishedAt: new Date('2024-06-12'),
        featuredImage: "/blog/mindfulness-practice.jpg"
      },
      {
        title: "Building Resilience: Bouncing Back from Life's Challenges",
        excerpt: "Learn practical strategies to develop emotional resilience and navigate life's ups and downs with greater strength and adaptability.",
        content: `
          <h2>Understanding Resilience</h2>
          <p>Resilience is the ability to adapt and bounce back when things don't go as planned. It's not about avoiding difficulties, but rather learning to work through them effectively.</p>
          
          <h3>Key Components of Resilience</h3>
          <ol>
            <li><strong>Emotional Regulation:</strong> Managing your emotional responses to stress</li>
            <li><strong>Optimism:</strong> Maintaining a hopeful outlook despite challenges</li>
            <li><strong>Problem-Solving Skills:</strong> Approaching difficulties with a solution-focused mindset</li>
            <li><strong>Social Support:</strong> Building and maintaining strong relationships</li>
            <li><strong>Self-Compassion:</strong> Treating yourself with kindness during tough times</li>
          </ol>
          
          <h3>Strategies for Building Resilience</h3>
          
          <h4>Develop a Growth Mindset</h4>
          <p>View challenges as opportunities to learn and grow rather than threats to avoid. Ask yourself: "What can I learn from this experience?"</p>
          
          <h4>Practice Self-Care</h4>
          <p>Regular exercise, adequate sleep, and healthy eating provide the physical foundation for emotional resilience.</p>
          
          <h4>Build Strong Relationships</h4>
          <p>Invest time in nurturing supportive relationships. Don't hesitate to reach out for help when you need it.</p>
          
          <h4>Develop Coping Skills</h4>
          <p>Learn healthy ways to manage stress, such as deep breathing, journaling, or engaging in hobbies you enjoy.</p>
          
          <h3>The Role of Professional Support</h3>
          <p>Sometimes building resilience requires professional guidance. Therapy can provide you with personalized strategies and tools to strengthen your ability to cope with life's challenges.</p>
          
          <p>Remember, resilience is like a muscle – it gets stronger with practice. Every challenge you face is an opportunity to build your resilience skills.</p>
        `,
        category: "Personal Growth",
        readTime: "7 min read",
        status: PostStatus.PUBLISHED,
        tags: JSON.stringify(["resilience", "mental strength", "coping skills", "personal growth"]),
        publishedAt: new Date('2024-06-15'),
        featuredImage: "/blog/building-resilience.jpg"
      },
      {
        title: "The Importance of Sleep for Mental Health",
        excerpt: "Explore the crucial connection between quality sleep and mental well-being, plus practical tips for improving your sleep hygiene.",
        content: `
          <h2>The Sleep-Mental Health Connection</h2>
          <p>Sleep and mental health are intimately connected. Poor sleep can contribute to mental health problems, while mental health issues can make it harder to sleep well.</p>
          
          <h3>How Sleep Affects Mental Health</h3>
          <ul>
            <li><strong>Mood Regulation:</strong> Adequate sleep helps regulate emotions and mood</li>
            <li><strong>Stress Management:</strong> Well-rested individuals cope better with daily stressors</li>
            <li><strong>Cognitive Function:</strong> Sleep is essential for concentration, memory, and decision-making</li>
            <li><strong>Immune Function:</strong> Good sleep supports overall physical and mental resilience</li>
          </ul>
          
          <h3>Signs of Poor Sleep Quality</h3>
          <ul>
            <li>Difficulty falling asleep or staying asleep</li>
            <li>Waking up feeling unrefreshed</li>
            <li>Daytime fatigue or sleepiness</li>
            <li>Irritability or mood changes</li>
            <li>Difficulty concentrating</li>
          </ul>
          
          <h3>Sleep Hygiene Tips</h3>
          
          <h4>Create a Sleep-Friendly Environment</h4>
          <ul>
            <li>Keep your bedroom cool, dark, and quiet</li>
            <li>Invest in a comfortable mattress and pillows</li>
            <li>Remove electronic devices from the bedroom</li>
          </ul>
          
          <h4>Establish a Bedtime Routine</h4>
          <ul>
            <li>Go to bed and wake up at the same time every day</li>
            <li>Create a relaxing pre-sleep routine (reading, gentle stretching, meditation)</li>
            <li>Avoid screens for at least an hour before bedtime</li>
          </ul>
          
          <h4>Watch Your Diet and Exercise</h4>
          <ul>
            <li>Avoid caffeine and large meals close to bedtime</li>
            <li>Get regular exercise, but not too close to bedtime</li>
            <li>Limit alcohol consumption, especially in the evening</li>
          </ul>
          
          <h3>When to Seek Help</h3>
          <p>If you've tried improving your sleep hygiene but still struggle with sleep issues, consider speaking with a healthcare professional. Sleep disorders are treatable, and addressing them can significantly improve your mental health and quality of life.</p>
        `,
        category: "Health & Wellness",
        readTime: "5 min read",
        status: PostStatus.PUBLISHED,
        tags: JSON.stringify(["sleep", "mental health", "wellness", "self-care"]),
        publishedAt: new Date('2024-06-18'),
        featuredImage: "/blog/sleep-mental-health.jpg"
      },
      {
        title: "Effective Communication in Relationships",
        excerpt: "Learn essential communication skills that can strengthen your relationships and resolve conflicts more effectively.",
        content: `
          <h2>The Foundation of Healthy Relationships</h2>
          <p>Effective communication is the cornerstone of all healthy relationships. It involves not just speaking clearly, but also listening actively and understanding your partner's perspective.</p>
          
          <h3>Key Elements of Effective Communication</h3>
          
          <h4>1. Active Listening</h4>
          <ul>
            <li>Give your full attention to the speaker</li>
            <li>Avoid interrupting or planning your response while they're talking</li>
            <li>Ask clarifying questions to ensure understanding</li>
            <li>Reflect back what you've heard to confirm comprehension</li>
          </ul>
          
          <h4>2. Using "I" Statements</h4>
          <p>Instead of saying "You always..." or "You never...", express your feelings using "I" statements:</p>
          <ul>
            <li>"I feel frustrated when..."</li>
            <li>"I need help understanding..."</li>
            <li>"I would appreciate it if..."</li>
          </ul>
          
          <h4>3. Emotional Regulation</h4>
          <p>Before engaging in difficult conversations:</p>
          <ul>
            <li>Take time to calm down if you're feeling highly emotional</li>
            <li>Practice deep breathing or mindfulness techniques</li>
            <li>Choose an appropriate time and place for the conversation</li>
          </ul>
          
          <h3>Common Communication Pitfalls</h3>
          <ul>
            <li><strong>Defensiveness:</strong> Responding to criticism with counter-attacks</li>
            <li><strong>Stonewalling:</strong> Shutting down or withdrawing from the conversation</li>
            <li><strong>Contempt:</strong> Using sarcasm, eye-rolling, or name-calling</li>
            <li><strong>Criticism:</strong> Attacking the person's character rather than addressing specific behaviors</li>
          </ul>
          
          <h3>Conflict Resolution Strategies</h3>
          <ol>
            <li><strong>Stay Focused:</strong> Address one issue at a time</li>
            <li><strong>Find Common Ground:</strong> Identify shared goals or values</li>
            <li><strong>Compromise:</strong> Be willing to meet in the middle</li>
            <li><strong>Take Breaks:</strong> If emotions escalate, take a break and return to the discussion later</li>
            <li><strong>Seek to Understand:</strong> Focus on understanding rather than being right</li>
          </ol>
          
          <h3>Building Communication Skills</h3>
          <p>Like any skill, effective communication improves with practice. Consider couples therapy or communication workshops to strengthen these skills in a supportive environment.</p>
          
          <p>Remember, healthy communication is a two-way street that requires effort from all parties involved.</p>
        `,
        category: "Relationships",
        readTime: "8 min read",
        status: PostStatus.PUBLISHED,
        tags: JSON.stringify(["relationships", "communication", "conflict resolution", "couples therapy"]),
        publishedAt: new Date('2024-06-20'),
        featuredImage: "/blog/effective-communication.jpg"
      }
    ];

    for (const postData of blogPosts) {
      const existingPost = await this.blogPostRepository.findOne({
        where: { title: postData.title }
      });

      if (!existingPost) {
        const post = this.blogPostRepository.create(postData);
        await this.blogPostRepository.save(post);
        console.log(`✅ Created blog post: ${postData.title}`);
      }
    }
  }
} 