const express = require('express');
const app = express();
const blogEntryRoutes = require('./routes/blogEntryRoutes')
const imageRoutes = require('./routes/imagesRoutes')
const cors = require('cors');
const fileUpload = require('express-fileupload')

app.use(cors());
app.use(express.json());
app.use(fileUpload({
    limits: {
        fileSize: 16000000, // Around 10MB
    },
    abortOnLimit: true,
  })
);

// Parse incoming JSON requests

app.use('/blog', blogEntryRoutes)
app.use('/images', imageRoutes)

app.get('*', (req, res) => {
    res.send('There is nothing to be found at: ' + req.protocol + '://' + req.get('host') + req.originalUrl);
})

  // Start the server
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});