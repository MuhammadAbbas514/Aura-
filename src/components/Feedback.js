import React, { useState } from 'react';
// import './Feedback.css'; // Import the styling

const Feedback = ({ onSubmitFeedback }) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (feedback.trim() === '' || rating === 0) {
      alert('Please provide feedback and a rating before submitting.');
      return;
    }
    onSubmitFeedback({ feedback, rating });
    setFeedback('');
    setRating(0);
  };

  return (
    <div className="feedback-section">
      <h2>We Value Your Feedback</h2>
      <textarea
        className="feedback-textarea"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Write your feedback here..."
      />
      <div className="rating-container">
        <label htmlFor="rating" className="rating-label">
          Rating:
        </label>
        <select
          id="rating"
          className="rating-dropdown"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
        >
          <option value={0}>Select Rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 && 's'}
            </option>
          ))}
        </select>
      </div>
      <button className="submit-feedback-btn" onClick={handleSubmit}>
        Submit Feedback
      </button>
    </div>
  );
};

export default Feedback;
