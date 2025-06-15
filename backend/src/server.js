const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://cricketpredictions:gUc1ki2yvjT3G4Ft@cluster0.yleo2aj.mongodb.net/predictions?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((error) => console.error("❌ MongoDB connection error:", error));

// Cricket Prediction Schema
const CricketPredictionSchema = new mongoose.Schema({
  twitterHandle: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  seriesResult: {
    type: String,
    required: true,
    trim: true
  },
  topScorer: {
    type: String,
    required: true,
    trim: true
  },
  topWicketTaker: {
    type: String,
    required: true,
    trim: true
  },
  playerOfTheSeries: {
    type: String,
    required: true,
    trim: true
  },
  mostHundreds: {
    type: String,
    required: true,
    trim: true
  },
  mostFifties: {
    type: String,
    required: true,
    trim: true
  },
  outcomes: {
    seriesResult: {
      type: String,
      enum: ['correct', 'incorrect', 'pending'],
      default: 'pending'
    },
    topScorer: {
      type: String,
      enum: ['correct', 'incorrect', 'pending'],
      default: 'pending'
    },
    topWicketTaker: {
      type: String,
      enum: ['correct', 'incorrect', 'pending'],
      default: 'pending'
    },
    playerOfTheSeries: {
      type: String,
      enum: ['correct', 'incorrect', 'pending'],
      default: 'pending'
    },
    mostHundreds: {
      type: String,
      enum: ['correct', 'incorrect', 'pending'],
      default: 'pending'
    },
    mostFifties: {
      type: String,
      enum: ['correct', 'incorrect', 'pending'],
      default: 'pending'
    }
  }
}, {
  timestamps: true
});

const CricketPrediction = mongoose.model("CricketPrediction", CricketPredictionSchema);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "🏏 Welcome to Cricket Predictions API" });
});

// Get all cricket predictions
app.get("/api/predictions", async (req, res) => {
  try {
    const predictions = await CricketPrediction.find().sort({ createdAt: -1 });
    console.log(`🏏 Fetched ${predictions.length} cricket predictions`);
    res.json(predictions);
  } catch (error) {
    console.error("Error fetching predictions:", error);
    res.status(500).json({ message: "Error fetching predictions", error: error.message });
  }
});

// Create new cricket prediction
app.post("/api/predictions", async (req, res) => {
  try {
    console.log("🏏 Creating new cricket prediction:", req.body);
    
    // Check if twitter handle already exists
    const existingPrediction = await CricketPrediction.findOne({ 
      twitterHandle: req.body.twitterHandle.toLowerCase().trim() 
    });
    
    if (existingPrediction) {
      return res.status(400).json({ 
        message: "Twitter handle already has predictions. Use update instead." 
      });
    }
    
    const prediction = new CricketPrediction(req.body);
    await prediction.save();
    console.log("✅ Cricket prediction saved:", prediction._id);
    res.status(201).json(prediction);
  } catch (error) {
    console.error("Error creating prediction:", error);
    if (error.code === 11000) {
      res.status(400).json({ message: "Twitter handle already exists" });
    } else {
      res.status(400).json({ message: "Error creating prediction", error: error.message });
    }
  }
});

// Update cricket prediction
app.put("/api/predictions/:twitterHandle", async (req, res) => {
  try {
    console.log(`🔄 Updating prediction for ${req.params.twitterHandle}:`, req.body);
    const prediction = await CricketPrediction.findOneAndUpdate(
      { twitterHandle: req.params.twitterHandle.toLowerCase().trim() },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }
    
    console.log("✅ Cricket prediction updated:", prediction._id);
    res.json(prediction);
  } catch (error) {
    console.error("Error updating prediction:", error);
    res.status(400).json({ message: "Error updating prediction", error: error.message });
  }
});

// Update specific outcome
app.patch("/api/predictions/:twitterHandle/outcome", async (req, res) => {
  try {
    const { field, outcome } = req.body;
    console.log(`🎯 Updating ${field} outcome for ${req.params.twitterHandle} to ${outcome}`);
    
    const updateField = `outcomes.${field}`;
    const prediction = await CricketPrediction.findOneAndUpdate(
      { twitterHandle: req.params.twitterHandle.toLowerCase().trim() },
      { [updateField]: outcome },
      { new: true }
    );
    
    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }
    
    console.log("✅ Outcome updated:", prediction._id);
    res.json(prediction);
  } catch (error) {
    console.error("Error updating outcome:", error);
    res.status(400).json({ message: "Error updating outcome", error: error.message });
  }
});

// Delete prediction
app.delete("/api/predictions/:twitterHandle", async (req, res) => {
  try {
    console.log(`🗑️ Deleting prediction for ${req.params.twitterHandle}`);
    const prediction = await CricketPrediction.findOneAndDelete({
      twitterHandle: req.params.twitterHandle.toLowerCase().trim()
    });
    
    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }
    
    console.log("✅ Prediction deleted:", prediction._id);
    res.json({ message: "Prediction deleted successfully" });
  } catch (error) {
    console.error("Error deleting prediction:", error);
    res.status(400).json({ message: "Error deleting prediction", error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🏏 Cricket Predictions API available at http://localhost:${PORT}`);
});
