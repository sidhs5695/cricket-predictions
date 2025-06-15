const mongoose = require("mongoose");

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://cricketpredictions:gUc1ki2yvjT3G4Ft@cluster0.yleo2aj.mongodb.net/predictions?retryWrites=true&w=majority&appName=Cluster0";

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

let CricketPrediction;

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

// Initialize model
const getModel = () => {
  if (!CricketPrediction) {
    CricketPrediction = mongoose.model("CricketPrediction", CricketPredictionSchema);
  }
  return CricketPrediction;
};

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    await connectDB();
    const CricketPrediction = getModel();

    const { httpMethod, path, body } = event;
    const pathParts = path.split('/').filter(Boolean);
    
    // Remove 'api' and 'predictions' from path if present
    const cleanPath = pathParts.filter(part => part !== 'api' && part !== 'predictions');

    switch (httpMethod) {
      case 'GET':
        // Get all predictions
        const predictions = await CricketPrediction.find().sort({ createdAt: -1 });
        console.log(`🏏 Fetched ${predictions.length} cricket predictions`);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(predictions),
        };

      case 'POST':
        // Create new prediction
        const newPredictionData = JSON.parse(body);
        console.log("🏏 Creating new cricket prediction:", newPredictionData);
        
        // Check if twitter handle already exists
        const existingPrediction = await CricketPrediction.findOne({ 
          twitterHandle: newPredictionData.twitterHandle.toLowerCase().trim() 
        });
        
        if (existingPrediction) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ 
              message: "Twitter handle already has predictions. Use update instead." 
            }),
          };
        }
        
        const prediction = new CricketPrediction(newPredictionData);
        await prediction.save();
        console.log("✅ Cricket prediction saved:", prediction._id);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(prediction),
        };

      case 'PUT':
        // Update prediction
        const twitterHandle = cleanPath[0];
        const updateData = JSON.parse(body);
        console.log(`🔄 Updating prediction for ${twitterHandle}:`, updateData);
        
        const updatedPrediction = await CricketPrediction.findOneAndUpdate(
          { twitterHandle: twitterHandle.toLowerCase().trim() },
          updateData,
          { new: true, runValidators: true }
        );
        
        if (!updatedPrediction) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ message: "Prediction not found" }),
          };
        }
        
        console.log("✅ Cricket prediction updated:", updatedPrediction._id);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(updatedPrediction),
        };

      case 'PATCH':
        // Update specific outcome
        const handleForOutcome = cleanPath[0];
        const isOutcomeUpdate = cleanPath[1] === 'outcome';
        
        if (isOutcomeUpdate) {
          const { field, outcome } = JSON.parse(body);
          console.log(`🎯 Updating ${field} outcome for ${handleForOutcome} to ${outcome}`);
          
          const updateField = `outcomes.${field}`;
          const predictionWithOutcome = await CricketPrediction.findOneAndUpdate(
            { twitterHandle: handleForOutcome.toLowerCase().trim() },
            { [updateField]: outcome },
            { new: true }
          );
          
          if (!predictionWithOutcome) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ message: "Prediction not found" }),
            };
          }
          
          console.log("✅ Outcome updated:", predictionWithOutcome._id);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(predictionWithOutcome),
          };
        }
        break;

      case 'DELETE':
        // Delete prediction
        const handleToDelete = cleanPath[0];
        console.log(`🗑️ Deleting prediction for ${handleToDelete}`);
        
        const deletedPrediction = await CricketPrediction.findOneAndDelete({
          twitterHandle: handleToDelete.toLowerCase().trim()
        });
        
        if (!deletedPrediction) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ message: "Prediction not found" }),
          };
        }
        
        console.log("✅ Prediction deleted:", deletedPrediction._id);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: "Prediction deleted successfully" }),
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ message: "Method not allowed" }),
        };
    }
  } catch (error) {
    console.error("Error in predictions function:", error);
    
    if (error.code === 11000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Twitter handle already exists" }),
      };
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: "Internal server error", 
        error: error.message 
      }),
    };
  }
}; 