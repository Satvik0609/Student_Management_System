import React, { useMemo, useState } from 'react';
import { Bookmark, Filter } from 'lucide-react';

const catalog = [
  { title: 'AI Fundamentals Sprint', format: 'Workshop', focus: 'AI', duration: '45 min' },
  { title: 'Career Storytelling Template', format: 'Template', focus: 'Career', duration: 'Download' },
  { title: 'Peer Mentor Office Hours', format: 'Live', focus: 'Wellbeing', duration: 'Daily' },
  { title: 'Industry Projects Marketplace', format: 'Portal', focus: 'Project', duration: 'Ongoing' }
];

const filters = ['All', 'AI', 'Career', 'Wellbeing', 'Project'];

export default function ResourceStudio() {
  const [activeFilter, setActiveFilter] = useState('All');

  const resources = useMemo(() => {
    if (activeFilter === 'All') return catalog;
    return catalog.filter((item) => item.focus === activeFilter);
  }, [activeFilter]);

  return (
    <section className="success-card resource-studio">
      <header>
        <p className="section-eyebrow mb-1">Resource studio</p>
        <h3>Curated boosts</h3>
      </header>
      <div className="resource-filters">
        <span>
          <Filter size={14} /> Focus
        </span>
        <div>
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={filter === activeFilter ? 'is-active' : ''}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <ul className="resource-list">
        {resources.map((resource) => (
          <li key={resource.title}>
            <div>
              <p>{resource.title}</p>
              <small>{resource.format} · {resource.duration}</small>
            </div>
            <span className="resource-tag">{resource.focus}</span>
            <button type="button" title="Save">
              <Bookmark size={16} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

