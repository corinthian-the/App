// app.js
const mongoose = require('mongoose');

// Replace with your actual MongoDB Atlas credentials
const uri = 'mongodb+srv://Brenda:18atlast@cluster0.l4i1nyh.mongodb.net/brendaAppDB?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected successfully!');

    // Optional: test document
    const testSchema = new mongoose.Schema({ message: String, createdAt: { type: Date, default: Date.now } });
    const Test = mongoose.model('Test', testSchema);

    const testDoc = new Test({ message: 'MongoDB connection is working!' });

    testDoc.save()
      .then(doc => {
        console.log('📄 Test document saved:', doc);
        mongoose.connection.close();
      })
      .catch(err => {
        console.error('❌ Error saving test document:', err);
        mongoose.connection.close();
      });

  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
