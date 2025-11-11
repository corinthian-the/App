// Import Mongoose
const mongoose = require('mongoose');

// MongoDB connection string
const uri = 'mongodb+srv://Brenda:18atlast@cluster0.l4i1nyh.mongodb.net/brendaAppDB?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected successfully!');

    // Define a simple schema & model
    const messageSchema = new mongoose.Schema({
      message: String,
      createdAt: { type: Date, default: Date.now }
    });

    const Message = mongoose.model('Message', messageSchema);

    // Create and save a test document
    const testMessage = new Message({ message: 'MongoDB connection is working!' });

    return testMessage.save();
  })
  .then(doc => {
    console.log('📄 Document saved:', doc);
    mongoose.connection.close(); // Close connection after saving
  })
  .catch(err => {
    console.error('❌ Error:', err);
  });
