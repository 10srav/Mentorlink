import React, { useMemo, useState } from 'react';
import HomeNavbar from '../components/common/HomeNavbar';
import Sidebar from '../components/home/Sidebar';
import FilterPanel from '../components/home/FilterPanel';
import MentorCard from '../components/home/MentorCard';
import Footer from '../components/common/Footer';
import './HomePage.css';

const HomePage = () => {
  // Temporary mock data
  const mockMentors = useMemo(() => ([
    {
      id: 1,
      name: 'Vivek Sridhar',
      verified: true,
      title: 'CTO - Microsoft For Startups',
      company: 'Microsoft',
      experience: 18,
      sessions: 10,
      rating: 4.5,
      avatar: 'https://i.pravatar.cc/100?img=12',
      bio: 'Vivek is a technophile and an Open Source contributor with 18+ years in software industry. Worked at Microsoft as CTO-Microsoft for startups.',
      skills: ['Javascript','Flutter','Node JS','React','Python','React Native','DevOps','Cloud','Leadership'],
      coreDomain: 'Interview Preparation',
      domains: ['Tech Mentor','Startup Mentor'],
    },
    {
      id: 2,
      name: 'Priyanka Taneja',
      verified: true,
      title: 'CTO - Microsoft For Startups',
      company: 'Microsoft',
      experience: 15,
      sessions: 9,
      rating: 4.0,
      avatar: 'https://i.pravatar.cc/100?img=32',
      bio: 'Priyanka is an Open Source contributor with 15+ years of experience and has worked at Microsoft in previous roles.',
      skills: ['Javascript','Kotlin','Node JS','React','Python','React Native'],
      coreDomain: 'System Design',
      domains: ['Professor in experiences','UI/UX Developer'],
    },
    {
      id: 3,
      name: 'Rahul Verma',
      verified: false,
      title: 'Senior Engineer',
      company: 'Google',
      experience: 10,
      sessions: 20,
      rating: 4.8,
      avatar: 'https://i.pravatar.cc/100?img=5',
      bio: 'Rahul specializes in scalable systems, cloud architecture and interview coaching.',
      skills: ['Golang','System Design','Kubernetes','GCP','React'],
      coreDomain: 'Backend Architecture',
      domains: ['Tech Mentor'],
    },
  ]), []);

  // See more: add N more temporary mentors
  const addMore = (n = 6) => {
    const templates = [
      {
        name: 'Ananya Rao', verified: true, title: 'Staff Engineer', company: 'Microsoft', experience: 12,
        bio: 'Staff Engineer with expertise in distributed systems and mentorship.',
        skills: ['C#','Azure','System Design','React','Node JS'], coreDomain: 'System Design', domains: ['Tech Mentor']
      },
      {
        name: 'Rohit Kumar', verified: false, title: 'SDE III', company: 'Amazon', experience: 9,
        bio: 'Passionate about backend engineering and interview preparation.',
        skills: ['Java','Microservices','AWS','DSA','Spring'], coreDomain: 'Backend Architecture', domains: ['Tech Mentor','Startup Mentor']
      },
      {
        name: 'Sneha Patel', verified: true, title: 'Product Designer', company: 'Adobe', experience: 8,
        bio: 'Design lead focusing on accessible UI/UX and design systems.',
        skills: ['Figma','UX','UI','Design Systems','Prototyping'], coreDomain: 'UI/UX', domains: ['UI/UX Developer']
      },
    ];
    const next = Array.from({ length: n }).map((_, idx) => {
      const t = templates[(idx + mentors.length) % templates.length];
      return {
        id: mentors.length + idx + 1,
        avatar: `https://i.pravatar.cc/100?img=${(mentors.length + idx) % 70}`,
        sessions: Math.floor(Math.random() * 20) + 5,
        rating: Math.round((Math.random() * 1 + 4) * 10) / 10,
        ...t,
      };
    });
    setMentors((prev) => [...prev, ...next]);
  };

  // Working mentor list state (start with mock)
  const [mentors, setMentors] = useState(mockMentors);

  // Filters and sort state
  const [filters, setFilters] = useState({
    query: '',
    sort: 'experience',
    domains: [],
    companies: [],
  });

  const filtered = useMemo(() => {
    let list = [...mentors];
    const q = filters.query.trim().toLowerCase();
    if (q) {
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    if (filters.domains.length) {
      list = list.filter(m => m.domains?.some(d => filters.domains.includes(d)));
    }
    if (filters.companies.length) {
      list = list.filter(m => filters.companies.includes(m.company));
    }
    // Sorting
    switch (filters.sort) {
      case 'experience':
        list.sort((a, b) => b.experience - a.experience);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'sessions':
        list.sort((a, b) => b.sessions - a.sessions);
        break;
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
        list.sort((a, b) => b.id - a.id);
        break;
      default:
        list.sort((a, b) => b.experience - a.experience);
    }
    return list;
  }, [mentors, filters]);

  // More realistic testimonials
  const testimonials = useMemo(() => ([
    { id: 't1', text: 'MentorLink connected me with an industry expert who helped me land my dream job at Google. The guidance was practical and personalized.', author: 'Amit Verma', company: 'Google', avatar: 'https://i.pravatar.cc/100?img=31' },
    { id: 't2', text: 'The mentorship sessions boosted my confidence and skills. I highly recommend MentorLink to anyone looking to grow.', author: 'Priya Singh', company: 'Amazon', avatar: 'https://i.pravatar.cc/100?img=32' },
    { id: 't3', text: 'My mentor helped me navigate a career switch into UX design. The advice and resources were invaluable.', author: 'Rohit Patel', company: 'Adobe', avatar: 'https://i.pravatar.cc/100?img=33' },
    { id: 't4', text: 'I loved the interactive sessions and real-world insights. MentorLink is a game changer for students.', author: 'Sneha Rao', company: 'Microsoft', avatar: 'https://i.pravatar.cc/100?img=34' },
    { id: 't5', text: 'The platform is easy to use and the mentors are truly invested in your success.', author: 'Karan Mehta', company: 'Meta', avatar: 'https://i.pravatar.cc/100?img=35' },
    { id: 't6', text: 'I gained clarity on my career path and built a strong professional network.', author: 'Neha Sharma', company: 'LinkedIn', avatar: 'https://i.pravatar.cc/100?img=36' },
    { id: 't7', text: 'MentorLink helped me prepare for technical interviews with mock sessions and feedback.', author: 'Rahul Jain', company: 'Google', avatar: 'https://i.pravatar.cc/100?img=37' },
    { id: 't8', text: 'The mentors are approachable and knowledgeable. I learned a lot about leadership and communication.', author: 'Divya Kapoor', company: 'Amazon', avatar: 'https://i.pravatar.cc/100?img=38' },
  ]), []);

  return (
    <>
      <HomeNavbar />
      <div className="home-layout">
        <Sidebar active="Home" />

        <main className="home-main">
          <div className="main-header">
            <div className="title">Our Mentors</div>
            <p className="subtitle">Discover the latest additions to our Mentors community! Meet the fresh faces ready to guide and inspire you on your journey</p>
          </div>

          <div className="toolbar">
            <input
              className="search"
              placeholder="Search here..."
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            />
            <select
              className="sort"
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            >
              <option value="experience">Sort By: Experience</option>
              <option value="rating">Sort By: Rating</option>
              <option value="sessions">Sort By: Sessions</option>
              <option value="name">Sort By: Name</option>
              <option value="recent">Sort By: Recently Joined</option>
            </select>
          </div>

          <div className="cards">
            {filtered.map((m) => (
              <MentorCard key={m.id} mentor={m} />
            ))}
          </div>

          <div className="see-more-wrap">
            <button className="see-more" onClick={() => addMore(6)}>See more ▸</button>
          </div>

          {/* Testimonials Section - scrollable animation */}
          <section className="testimonials">
            <div className="title">Testimonials</div>
            <div className="testimonial-scroll">
              {testimonials.map((t) => (
                <div key={t.id} className="testimonial-card">
                  <div className="testimonial-text">{t.text}</div>
                  <div className="author">
                    <img src={t.avatar} alt={t.author} />
                    <div>
                      <div>{t.author}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{t.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Footer />
        </main>

        <FilterPanel filters={filters} setFilters={setFilters} />
      </div>
    </>
  );
};

export default HomePage;
