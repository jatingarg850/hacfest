const { getConversationalModel } = require('../config/gemini');

// Get educational news
exports.getNews = async (req, res) => {
  try {
    const { category = 'all' } = req.query;
    
    const allNews = [
      {
        id: 1,
        title: 'New Study Techniques Boost Memory Retention by 40%',
        summary: 'Recent research from Stanford University shows that active recall combined with spaced repetition significantly improves long-term memory retention. Students who used these techniques scored 40% higher on tests.',
        category: 'study-tips',
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        readTime: '5 min read',
      },
      {
        id: 2,
        title: 'AI in Education: The Future of Personalized Learning',
        summary: 'Artificial intelligence is revolutionizing how students learn with adaptive learning systems that adjust to individual pace and style. Major universities are now integrating AI tutors into their curriculum.',
        category: 'technology',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        readTime: '7 min read',
      },
      {
        id: 3,
        title: 'Top Universities Announce Free Online Courses for 2024',
        summary: 'Harvard, MIT, and Stanford are offering free access to premium courses in STEM fields. Over 500 courses are now available covering computer science, mathematics, physics, and engineering.',
        category: 'education',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        readTime: '4 min read',
      },
      {
        id: 4,
        title: 'The Pomodoro Technique: Science-Backed Productivity Hack',
        summary: 'Studies confirm that the Pomodoro Technique (25-minute focused work sessions) increases productivity by 25%. Learn how to implement this simple yet effective study method.',
        category: 'study-tips',
        imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        readTime: '6 min read',
      },
      {
        id: 5,
        title: 'Breakthrough in Quantum Computing Education',
        summary: 'New quantum computing courses make complex concepts accessible to beginners. IBM and Google launch free quantum programming tutorials for students worldwide.',
        category: 'technology',
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        readTime: '8 min read',
      },
      {
        id: 6,
        title: 'Study Shows Sleep is Crucial for Learning',
        summary: 'New research reveals that getting 7-9 hours of sleep improves information retention by 60%. Sleep helps consolidate memories and enhances problem-solving abilities.',
        category: 'health',
        imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        readTime: '5 min read',
      },
      {
        id: 7,
        title: 'Scholarships Worth $10M Available for STEM Students',
        summary: 'Major tech companies announce new scholarship programs for students pursuing degrees in science, technology, engineering, and mathematics. Applications open next month.',
        category: 'education',
        imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        readTime: '4 min read',
      },
      {
        id: 8,
        title: 'Mind Mapping: Visual Learning for Better Understanding',
        summary: 'Research shows that mind mapping improves comprehension and recall by 32%. This visual learning technique helps students organize complex information effectively.',
        category: 'study-tips',
        imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400',
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        readTime: '6 min read',
      },
    ];

    const filteredNews = category === 'all' 
      ? allNews 
      : allNews.filter(item => item.category === category);

    res.json({ news: filteredNews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Summarize news article
exports.summarizeNews = async (req, res) => {
  try {
    const { content } = req.body;
    const model = getConversationalModel();

    const prompt = `Summarize this educational news article in 2-3 sentences:\n\n${content}`;
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
