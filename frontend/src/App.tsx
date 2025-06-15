import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface CricketPrediction {
  _id: string;
  twitterHandle: string;
  seriesResult: string;
  topScorer: string;
  topWicketTaker: string;
  playerOfTheSeries: string;
  mostHundreds: string;
  mostFifties: string;
  outcomes: {
    seriesResult: 'correct' | 'incorrect' | 'pending';
    topScorer: 'correct' | 'incorrect' | 'pending';
    topWicketTaker: 'correct' | 'incorrect' | 'pending';
    playerOfTheSeries: 'correct' | 'incorrect' | 'pending';
    mostHundreds: 'correct' | 'incorrect' | 'pending';
    mostFifties: 'correct' | 'incorrect' | 'pending';
  };
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [predictions, setPredictions] = useState<CricketPrediction[]>([]);
  const [formData, setFormData] = useState({
    twitterHandle: '',
    seriesResult: '',
    topScorer: '',
    topWicketTaker: '',
    playerOfTheSeries: '',
    mostHundreds: '',
    mostFifties: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPredictions();
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8888' : '');

  const fetchPredictions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/predictions`);
      setPredictions(response.data);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setMessage('Error loading predictions');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Create new prediction
      const response = await axios.post(`${API_URL}/api/predictions`, formData);
      setPredictions([response.data, ...predictions]);
      setMessage('✅ Prediction submitted successfully!');
      
      setFormData({
        twitterHandle: '',
        seriesResult: '',
        topScorer: '',
        topWicketTaker: '',
        playerOfTheSeries: '',
        mostHundreds: '',
        mostFifties: ''
      });
    } catch (error) {
      console.error('Error submitting prediction:', error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage('❌ Error submitting prediction');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const updateOutcome = async (twitterHandle: string, field: string, outcome: 'correct' | 'incorrect') => {
    try {
      const response = await axios.patch(`${API_URL}/api/predictions/${twitterHandle}/outcome`, { 
        field, 
        outcome 
      });
      setPredictions(predictions.map(p => p.twitterHandle === twitterHandle ? response.data : p));
      setMessage(`✅ ${field} marked as ${outcome}!`);
    } catch (error) {
      console.error('Error updating outcome:', error);
      setMessage('❌ Error updating outcome');
    }
  };

  const toggleExpanded = (twitterHandle: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(twitterHandle)) {
      newExpanded.delete(twitterHandle);
    } else {
      newExpanded.add(twitterHandle);
    }
    setExpandedCards(newExpanded);
  };

  const getOutcomeEmoji = (outcome: string) => {
    switch (outcome) {
      case 'correct': return '✅';
      case 'incorrect': return '❌';
      default: return '⏳';
    }
  };

  const fieldLabels = {
    topScorer: 'Top Scorer',
    topWicketTaker: 'Top Wicket Taker',
    playerOfTheSeries: 'Player of the Series',
    mostHundreds: 'Most Hundreds',
    mostFifties: 'Most Fifties'
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🏏 Cricket Predictions</h1>
        <p>Share and track cricket predictions with your friends</p>
      </header>

      <main className="main">
        <div className="form-container">
          <h2>📝 Make Your Prediction</h2>
          <form onSubmit={handleSubmit} className="prediction-form">
            <div className="form-group">
              <label htmlFor="twitterHandle">Twitter Handle:</label>
              <input
                type="text"
                id="twitterHandle"
                name="twitterHandle"
                value={formData.twitterHandle}
                onChange={handleInputChange}
                placeholder="@username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="seriesResult">Series Result:</label>
              <input
                type="text"
                id="seriesResult"
                name="seriesResult"
                value={formData.seriesResult}
                onChange={handleInputChange}
                placeholder="e.g., India 3-1 England"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="topScorer">Top Scorer:</label>
              <input
                type="text"
                id="topScorer"
                name="topScorer"
                value={formData.topScorer}
                onChange={handleInputChange}
                placeholder="e.g., Virat Kohli"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="topWicketTaker">Top Wicket Taker:</label>
              <input
                type="text"
                id="topWicketTaker"
                name="topWicketTaker"
                value={formData.topWicketTaker}
                onChange={handleInputChange}
                placeholder="e.g., Jasprit Bumrah"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="playerOfTheSeries">Player of the Series:</label>
              <input
                type="text"
                id="playerOfTheSeries"
                name="playerOfTheSeries"
                value={formData.playerOfTheSeries}
                onChange={handleInputChange}
                placeholder="e.g., Rohit Sharma"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mostHundreds">Most Hundreds:</label>
              <input
                type="text"
                id="mostHundreds"
                name="mostHundreds"
                value={formData.mostHundreds}
                onChange={handleInputChange}
                placeholder="e.g., Joe Root"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mostFifties">Most Fifties:</label>
              <input
                type="text"
                id="mostFifties"
                name="mostFifties"
                value={formData.mostFifties}
                onChange={handleInputChange}
                placeholder="e.g., KL Rahul"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? '⏳ Submitting...' : '🚀 Submit Prediction'}
            </button>
          </form>

          {message && (
            <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </div>

        <div className="predictions-container">
          <h2>🏆 All Predictions ({predictions.length})</h2>
          {predictions.length === 0 ? (
            <p className="no-predictions">No predictions yet. Be the first to make one! 🎯</p>
          ) : (
            <div className="predictions-grid">
              {predictions.map((prediction) => (
                <div key={prediction._id} className="prediction-card">
                  <div className="prediction-header">
                    <div className="compact-view">
                      <span className="twitter-handle">🐦 @{prediction.twitterHandle}</span>
                      <div className="series-result">
                        <strong>Series Result:</strong> {prediction.seriesResult}
                        <span className="outcome-badge">
                          {getOutcomeEmoji(prediction.outcomes.seriesResult)}
                        </span>
                      </div>
                    </div>
                    <div className="card-actions">
                      <button 
                        onClick={() => toggleExpanded(prediction.twitterHandle)}
                        className="expand-btn"
                        title={expandedCards.has(prediction.twitterHandle) ? "Hide details" : "Show details"}
                      >
                        {expandedCards.has(prediction.twitterHandle) ? '🔼' : '🔽'}
                      </button>
                    </div>
                  </div>
                  
                  {expandedCards.has(prediction.twitterHandle) && (
                    <div className="expanded-details">
                      <div className="series-result-detail">
                        <div className="prediction-item">
                          <div className="prediction-field">
                            <strong>Series Result:</strong> {prediction.seriesResult}
                          </div>
                          <div className="outcome-section">
                            <span className="outcome">
                              {getOutcomeEmoji(prediction.outcomes.seriesResult)} 
                              {prediction.outcomes.seriesResult}
                            </span>
                            {prediction.outcomes.seriesResult === 'pending' && (
                              <div className="outcome-buttons">
                                <button
                                  onClick={() => updateOutcome(prediction.twitterHandle, 'seriesResult', 'correct')}
                                  className="outcome-btn correct"
                                  title="Mark Series Result as correct"
                                >
                                  ✅
                                </button>
                                <button
                                  onClick={() => updateOutcome(prediction.twitterHandle, 'seriesResult', 'incorrect')}
                                  className="outcome-btn incorrect"
                                  title="Mark Series Result as incorrect"
                                >
                                  ❌
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="other-predictions">
                        <h4>📊 Other Predictions:</h4>
                        <div className="predictions-list">
                          {Object.entries(fieldLabels).map(([field, label]) => (
                            <div key={field} className="prediction-item">
                              <div className="prediction-field">
                                <strong>{label}:</strong> {prediction[field as keyof typeof fieldLabels]}
                              </div>
                              <div className="outcome-section">
                                <span className="outcome">
                                  {getOutcomeEmoji(prediction.outcomes[field as keyof typeof prediction.outcomes])} 
                                  {prediction.outcomes[field as keyof typeof prediction.outcomes]}
                                </span>
                                {prediction.outcomes[field as keyof typeof prediction.outcomes] === 'pending' && (
                                  <div className="outcome-buttons">
                                    <button
                                      onClick={() => updateOutcome(prediction.twitterHandle, field, 'correct')}
                                      className="outcome-btn correct"
                                      title={`Mark ${label} as correct`}
                                    >
                                      ✅
                                    </button>
                                    <button
                                      onClick={() => updateOutcome(prediction.twitterHandle, field, 'incorrect')}
                                      className="outcome-btn incorrect"
                                      title={`Mark ${label} as incorrect`}
                                    >
                                      ❌
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="created-at">
                        Created: {new Date(prediction.createdAt).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
