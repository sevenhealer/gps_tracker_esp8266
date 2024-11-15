const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());

let latitude = 0;
let longitude = 0;
let speed = 0;

app.use(express.json());
app.use(express.static('public'));

app.post('/location', (req, res) => {
  latitude = req.body.latitude;
  longitude = req.body.longitude;
  speed = req.body.speed;
  res.sendStatus(200);
});

app.get('/get-location', (req, res) => {
  res.json({ latitude, longitude, speed });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

  setInterval(() => {
    console.log(`Received location: Latitude=${latitude}, Longitude=${longitude}, Speed=${speed}`);
  }, 5000);