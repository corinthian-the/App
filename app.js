// app.js
const mongoose = require('mongoose');

// Your MongoDB credentials
const username = 'Brenda';         // your DB username
const password = '18atlast';       // your DB password
const dbName = 'brendaAppDB';      // your database name

// URL-encode the password in case it has special characters
const encodedPassword = encodeURIComponent(password);

// Build the connection string
const uri = `mongodb+srv://${username}:${encodedPassword}@cluster0.l4i1nyh.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected successfully!');

    // Optional test: create a collection and insert a document
    const TestSchema = new mongoose.Schema({ message: String });
    const Test = mongoose.model('Test', TestSchema);

    const testDoc = new Test({ message: 'MongoDB is working!' });
    testDoc.save()
      .then(doc => {
        console.log('Document saved:', doc);
        mongoose.connection.close(); // Close connection after test
      })
      .catch(err => console.error('Error saving document:', err));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
