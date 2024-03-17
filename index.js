const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { StreamChat } = require('stream-chat');

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STEAM_SECRET_KEY;
const serverClient = StreamChat.getInstance(api_key, api_secret);

console.log('api_key', api_key, 'api_secret', api_secret);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.post('/create-profile', async (req, res) => {
  const { email, name, avatarUrl, user_id } = req.body;

  const token = serverClient.createToken(user_id);

  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select()
    .eq('user_id', user_id);

  if (profileError) {
    return res.status(500).json({ error: error.message });
  }
  if (profile) {
    return res.status(202).json({
      user: {
        email,
        name,
        avatarUrl,
        user_id,
        streamToken: token,
      },
    });
  }

  if (!profile?.length) {
    const { data, error } = await supabase.from('profile').insert({
      user_id,
      avatarUrl,
      email,
      name,
      boarded: true,
      streamToken: token,
    });
    if (error) {
      console.log('error', error);

      return res.status(500).json({ error: error.message });
    }
    if (!error)
      return res.status(202).json({
        user: {
          email,
          name,
          avatarUrl,
          user_id,
          streamToken: token,
        },
      });
  }

  res.status(202).json({
    user: {
      email,
      name,
      avatarUrl,
      user_id,
      streamToken: token,
    },
  });
});

const Port = process.env.PORT || 3000;
app.listen(Port, () => {
  console.log('Server started on port ' + Port);
});
