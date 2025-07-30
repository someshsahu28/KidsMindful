import React, { useState } from 'react';
import StoryChatbot from '../components/StoryChatbot';
import './Stories.css';

const Stories = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  console.log('Stories component rendered, showChatbot:', showChatbot); // Debug log

  const storyCards = [
    {
      id: 1,
      title: "The Brave Little Cloud",
      description: "Click to start the story!",
      color: "lightblue",
      icon: "☁️"
    },
    {
      id: 2,
      title: "The Dancing Tree", 
      description: "Click to start the story!",
      color: "lightgreen",
      icon: "🌳"
    },
    {
      id: 3,
      title: "The Friendly Stars",
      description: "Click to start the story!",
      color: "mediumpurple", 
      icon: "⭐"
    },
    {
      id: 4,
      title: "The Magic Garden",
      description: "Click to start the story!",
      color: "lightcoral",
      icon: "🌸"
    },
    {
      id: 5,
      title: "Create Your Own Story",
      description: "Tell me what story you'd like!",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      icon: "🤖",
      isAI: true
    }
  ];

  const handleStoryClick = (storyId) => {
    console.log(`Starting story ${storyId}`);
  };

  const handleAIClick = () => {
    console.log('AI story clicked');
    setShowChatbot(true);
  };

  if (showChatbot) {
    return (
      <div className="stories-page">
        <div className="stories-header">
          <button 
            className="back-button"
            onClick={() => setShowChatbot(false)}
          >
            ← Back to Stories
          </button>
          <h1>Interactive Stories 📚</h1>
        </div>
        <StoryChatbot />
      </div>
    );
  }

  return (
    <div className="stories-page">
      <div className="stories-header">
        <h1>Interactive Stories 📚</h1>
      </div>
      
      <div className="stories-grid">
        {storyCards.map((story) => (
          <div 
            key={story.id}
            className="story-card"
            style={{ background: story.color }}
            onClick={() => story.isAI ? handleAIClick() : handleStoryClick(story.id)}
          >
            <div className="story-icon">{story.icon}</div>
            <h3>{story.title}</h3>
            <p>{story.description}</p>
            {story.isAI && <div className="ai-badge">AI Powered</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
