// app.js
const mongoose = require('mongoose');

// ==== Your MongoDB credentials ====
const username = 'Brenda';
const password = '18atlast';
const dbName = 'brendaAppDB'; // your database name

// URL-encode the password (in case it has special characters)
const encodedPassword = encodeURIComponent(password);

// Build the MongoDB connection string
const uri = `mongodb+srv://${username}:${encodedPassword}@cluster0.l4i1nyh.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected successfully!');

    // Optional: Create a test schema and model
    const TestSchema = new mongoose.Schema({
      message: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    });

    const Test = mongoose.model('Test', TestSchema);

    // Optional: Insert a sample document
    const testDoc = new Test({ message: 'MongoDB connection is working!' });
    testDoc.save()
      .then(doc => console.log('Sample document saved:', doc))
      .catch(err => console.error('Error saving sample document:', err));

  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Optional: Keep the process alive (so you can add more app logic)
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});
