import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, HelpCircle, Info } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';

const mathTopics = {
  "Review / Algebra": "Algebra",
  "Quadratics and Inequalities": "Quadratics",
  "Transformations and Polynomials": "Polynomials",
  "Logarithms and Exponents": "Logs",
  "Trigonometry": "Trig",
  "Combinatorics and Probability": "Probability",
  "Statistics": "Stats",
  "Vectors": "Vec",
  "Limits": "Limits",
  "Derivatives": "Diff",
  "Applications of Derivatives": "Derivatives",
  "Integration": "Int",
  "Complex Numbers": "ComNum"
};

const Homepage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const filteredTopics = Object.keys(mathTopics).filter(topic =>
    topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(e.target.value.length > 0);
  };

  const handleTopicClick = (topic) => {
    const pageRoute = mathTopics[topic];
    if (pageRoute) {
      navigate(`/${pageRoute}`);
      setShowDropdown(false);
      setSearchTerm('');
    } else {
      console.error('Invalid topic selected');
    }
  };

  // Navigation handlers for icons
  const handleMotivationClick = () => {
    navigate('/motivation'); // Replace with your actual route
  };

  const handleHowToUseClick = () => {
    navigate('/howtouse'); // Replace with your actual route
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-3/4 max-w-4xl aspect-video flex flex-col items-center justify-center ">
        <TypeAnimation
          sequence={[
            'Math Stack Exchange', // Types 'One'
            1000, // Waits 1s
            'Math Stack Exchange [db]',
            500,
          ]}
          wrapper="span"
          cursor={false}
          repeat={0}
          speed={1}
          style={{ fontSize: '2em', display: 'inline-block', margin: '4px', fontFamily: 'Courier New, monospace' }}
        />
        <div className="w-full max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder=""
              value={searchTerm}
              onChange={handleSearch}
              className="font-courier w-full px-6 py-4 text-xl text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-full focus:border-gray-400 focus:outline-none focus:ring-opacity-40"
            />
            <Search className="absolute top-5 right-6 h-6 w-6 text-gray-400 " />
          </div>
          {showDropdown && (
            <div className="absolute mt-2 w-full max-w-2xl bg-white rounded-2xl shadow-lg z-10 overflow-hidden">
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="px-6 font-courier py-3 text-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => handleTopicClick(topic)}
                  >
                    {topic}
                  </div>
                ))
              ) : (
                <div className="px-6 py-3 text-lg text-gray-500">No results found</div>
              )}
            </div>
          )}
          {/* Pill-shaped icons section */}
          <div className="mt-3 flex justify-end space-x-1">
            <div className="relative">
              <HelpCircle 
                className="h-6 w-6 text-zinc-700 cursor-pointer hover:text-blue-600" 
                onClick={handleHowToUseClick}
              />
            </div>
            <div className="relative">
              <Info 
                className="h-6 w-6 text-zinc-700 cursor-pointer hover:text-green-600" 
                onClick={handleMotivationClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
