import React from 'react';
import { Briefcase, CalendarDays, ArrowUpRight } from 'lucide-react';

const jobMatches = [
  { company: 'Nebula Labs', title: 'AI Research Intern', skills: ['Python', 'LLMs'], stage: 'Interview' },
  { company: 'Lumina Health', title: 'Product Analyst', skills: ['SQL', 'Storytelling'], stage: 'Shortlisted' }
];

const events = [
  { name: 'Mock interview blitz', date: 'Fri · 4pm', format: 'Virtual' },
  { name: 'Career studio drop-in', date: 'Mon · 11am', format: 'On campus' }
];

export default function CareerLaunchpad() {
  return (
    <section className="success-card career-launchpad">
      <header>
        <p className="section-eyebrow mb-1">Career launchpad</p>
        <h3>Job signals & events</h3>
      </header>
      <div className="career-grid">
        <div>
          <h4>
            <Briefcase size={16} />
            Hot matches
          </h4>
          <ul>
            {jobMatches.map((job) => (
              <li key={job.company}>
                <div>
                  <p>{job.title}</p>
                  <small>{job.company} · {job.skills.join(', ')}</small>
                </div>
                <span className="chip tone-success">{job.stage}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>
            <CalendarDays size={16} />
            Upcoming boosts
          </h4>
          <ul>
            {events.map((event) => (
              <li key={event.name}>
                <div>
                  <p>{event.name}</p>
                  <small>{event.date} · {event.format}</small>
                </div>
                <button type="button">
                  Join
                  <ArrowUpRight size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

