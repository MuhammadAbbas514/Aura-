import React from 'react';
import Feedback from './Feedback';
import axios from 'axios';
const AboutUs = () => {
  
  const onSubmitFeed = ({ feedback, rating }) => {

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please login to submit feedback');
      return;
    }

    console.log('Feedback:', feedback, 'Rating:', rating);
    axios.post('http://localhost:5000/api/feedback', { feedback, rating, userId: user.UserId })
      .then((response) => {
        if (response.status === 200) {
          alert('Feedback submitted successfully');
        } else {
          alert('Failed to submit feedback');
        }
      })
      .catch((error) => {
        console.error('Error submitting feedback: ', error);
        alert('Failed to submit feedback');
      });

  }
  
  return(
  <section id="about-us" className="section">
    <h2>About Us</h2>
    <p>Aura's carefully curated shades and high-quality formulas make it easy to create any look, from a soft glow to bold glamour.</p>
    <b><p>Embrace your individuality and let Aura be the finishing touch to your self-expression—because with Aura, you’re already glowing.</p></b>
    <Feedback onSubmitFeedback={onSubmitFeed} />
  </section>
)};

export default AboutUs;
