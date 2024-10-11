import React, { useState, useEffect } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import { TypeAnimation } from 'react-type-animation';

import { CheckCircle, Slash } from 'react-feather'; 

const LimitsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postDetails, setPostDetails] = useState({});
  const [selectedPost, setSelectedPost] = useState(null); // Handle selected question
  const [error, setError] = useState(null); // Track error in case of API failures
  const [page, setPage] = useState(1); // Track the current page
  const [loadingMore, setLoadingMore] = useState(false); // Loading state for Load More button
  const [scrollPosition, setScrollPosition] = useState(0); // Track scroll position

  // Function to decode HTML entities
  const decodeHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.documentElement.textContent;
  };

  // Function to fetch the details of a specific question (only when clicked)
  const fetchPostDetails = async (questionId) => {
    if (!postDetails[questionId]) {
      try {
        const response = await fetch(
          `https://api.stackexchange.com/2.3/questions/${questionId}?order=desc&sort=activity&site=math&filter=withbody&key=rl_drhuikHjdY1MtufKAk9RdhDvt`
        );
        const data = await response.json();

        // Cache the response to avoid redundant calls
        setPostDetails((prevDetails) => ({
          ...prevDetails,
          [questionId]: data.items[0].body, // Save the body of the specific question
        }));
      } catch (error) {
        console.error('Error fetching post details:', error);
        setError('Failed to load post content. Please try again later.');
      }
    }
  };

  // Function to fetch posts (initial load and pagination)
  const fetchPosts = async (pageNum) => {
    setLoadingMore(true); // Set loadingMore state to show loading indicator for the Load More button
    try {
      const response = await fetch(
        `https://api.stackexchange.com/2.3/questions?order=desc&sort=votes&tagged=limits-without-lhopital&site=math&pagesize=100&page=${pageNum}&key=rl_drhuikHjdY1MtufKAk9RdhDvt`
      );
      const data = await response.json();
      setPosts((prevPosts) => [...prevPosts, ...data.items]); // Add new posts to the existing list
      setLoading(false);
      setLoadingMore(false); // Reset loading state for Load More button
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      setLoadingMore(false); // Reset loading state in case of an error
      setError('Failed to load posts. Please try again later.');
    }
  };

  // Fetching the list of posts initially
  useEffect(() => {
    fetchPosts(1); // Load the first page initially
  }, []);

  // Function to render title with LaTeX
  const renderTitleWithLatex = (title) => {
    const decodedTitle = decodeHTML(title); // Decode the HTML entities
    const latexPattern = /\$(.*?)\$/g;
    const parts = decodedTitle.split(latexPattern);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // LaTeX content
        return (
          <span key={index} className="mx-1">
            <InlineMath>{part}</InlineMath>
          </span>
        );
      }
      // Regular text content
      return <span key={index}>{part}</span>;
    });
  };

  // Function to render the body of the post with block and inline LaTeX
  const renderBodyWithLatex = (body) => {
    const decodedBody = decodeHTML(body); // Decode the HTML entities

    // Split by block-level LaTeX expressions $$...$$
    const blockLatexPattern = /\$\$(.*?)\$\$/gs;
    const parts = decodedBody.split(blockLatexPattern);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // Block LaTeX content
        return (
          <div key={index} className="my-4">
            <BlockMath>{part}</BlockMath>
          </div>
        );
      } else {
        // For inline LaTeX, we need to split further using $...$
        const inlineLatexPattern = /\$(.*?)\$/g;
        const inlineParts = part.split(inlineLatexPattern);

        return inlineParts.map((inlinePart, inlineIndex) => {
          if (inlineIndex % 2 === 1) {
            // Inline LaTeX content
            return (
              <span key={inlineIndex} className="mx-1">
                <InlineMath>{inlinePart}</InlineMath>
              </span>
            );
          }
          // Regular text content
          return <span key={inlineIndex}>{inlinePart}</span>;
        });
      }
    });
  };

  // Function to handle opening a specific post
  const handleOpenPost = (post) => {
    // Store the scroll position before navigating to the post
    setScrollPosition(window.scrollY);
    setSelectedPost(post);

    // Fetch details only when the question is clicked and only if not cached
    if (!postDetails[post.question_id]) {
      fetchPostDetails(post.question_id);
    }
  };

  // Function to handle closing the post view
  const handleBack = () => {
    setSelectedPost(null);

    // Restore the scroll position after going back
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  };

  // Function to handle loading more posts
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1); // Increment the page number
    fetchPosts(page + 1); // Fetch the next page of posts
  };

  // Function to render tags
  const renderTags = (tags) => {
    const displayedTags = tags.slice(0, 3); // Get only the first three tags
    return (
      <div className="flex space-x-2">
        {displayedTags.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-200 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="text-gray-500 text-sm font-medium">...</span>
        )}
      </div>
    );
  };

  // Function to render the header of the question (tags, score, accepted answer)
  const renderPostHeader = (post) => {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-2">{renderTags(post.tags)}</div>
          <div className="text-gray-500 text-sm flex items-center">
          <span className="mr-1">Score: {post.score} [</span>
          {post.is_answered && post.accepted_answer_id ? (
            <CheckCircle size={15} color="green" className="mr-1 " />
          ) : (
            <Slash size={15} color="red" className="mr-1 " />
          )}]
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-20">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-8 space-y-6">
      <h1 className="text-4xl font-courier p-8"><TypeAnimation
          sequence={[
            'Limits',
          ]}
          wrapper="span"
          cursor={false}
          repeat={0}
          speed={1}
          style={{ fontSize: '2em', display: 'inline-block', margin: '4px', fontFamily: 'Courier New, monospace' }}
        /></h1>
      {/* Check if a post is selected, render the question window, otherwise render the list */}
      {selectedPost ? (
        <div className="w-full max-w-2xl bg-white rounded-[30px] shadow-lg p-6 hover:shadow-2xl transition-shadow relative">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBack}
              className="text-blue-500 hover:underline text-xl"
            >
              ← Back
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-4 flex flex-wrap">
            {renderTitleWithLatex(selectedPost.title)}
          </h2>

          {/* Display the full question body here with block and inline LaTeX */}
          <div className="text-gray-700">
            {postDetails[selectedPost.question_id]
              ? renderBodyWithLatex(postDetails[selectedPost.question_id])
              : 'Loading question content...'}
          </div>

          {/* Render post header with tags, score, and accepted answer info */}
          {renderPostHeader(selectedPost)}

          <a
            href={selectedPost.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 mt-4 inline-block hover:underline"
          >
            View Post on StackExchange
          </a>
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post.question_id}
            onClick={() => handleOpenPost(post)}
            className="w-full max-w-lg md:max-w-2xl bg-white rounded-[30px] shadow-lg p-6 hover:shadow-2xl transition-shadow cursor-pointer"
          >
            <h2 className="text-xl font-bold mb-4 flex flex-wrap">
              {renderTitleWithLatex(post.title)}
            </h2>
            {/* Render post header with tags, score, and accepted answer info */}
            {renderPostHeader(post)}
          </div>
        ))
      )}

      {/* Load More button */}
      {!selectedPost && (
        <div className="mt-8">
          <button
            onClick={handleLoadMore}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default LimitsPage;