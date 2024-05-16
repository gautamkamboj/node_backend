const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (_,res)=>{
    res.send("go to /api/images for random image and /api/both to get image and a joke both");
});

app.get('/api/image', async (_, res) => {
    try {
        const response = await axios.get('https://picsum.photos/500/500', {
            responseType: 'arraybuffer'
        });
        const imageBuffer = Buffer.from(response.data, 'binary');
        res.set('Content-Type', 'image/jpeg');
        res.send(imageBuffer);
    } catch (error) {
        res.status(500).send('Error fetching image');
    }
});
app.get('/api/jokes-images', async (req, res) => {
    try {
        const [jokeResponse, imageResponse] = await Promise.all([
            axios.get('https://official-joke-api.appspot.com/random_joke'),
            axios.get('https://picsum.photos/500/500', {
                responseType: 'arraybuffer'
            })
        ]);

        const imageBuffer = Buffer.from(imageResponse.data, 'binary');
        const imageBase64 = imageBuffer.toString('base64');

      
        res.json({
            joke: jokeResponse.data,

            image: `data:image/jpeg;base64,${imageBase64}`
        });
    } catch (error) {
        res.status(500).send('Error fetching joke or image');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
