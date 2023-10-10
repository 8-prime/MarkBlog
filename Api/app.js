const express = require('express');
const app = express();
const blogEntryRoutes = require('./routes/blogEntryRoutes')
const cors = require('cors');


app.use(cors());


// Parse incoming JSON requests
app.use(express.json());

app.use('/blog', blogEntryRoutes)

app.get('*', (req, res) => {
    res.send('There is nothing to be found at: ' + req.protocol + '://' + req.get('host') + req.originalUrl);
})

  // Start the server
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});