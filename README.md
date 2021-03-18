# Twilio Video Demo

This is the code written during the live Twilio Video
demo during Twilio's March 18 Superclass.

It creates a simple Video application that creates a virtual
knitting circle and populates each yarn ball with an HTML
video element when a participant enters the Room.

You'll need Python3 to get this running. To install the required
dependencies:

```
python3 -m venv venv  # create a virtual environment
source venv/bin/activate
pip install -r requirements.txt
```

You'll need to create a `.env` file and put your account
credentials in that file, so that the Flask server can
connect to Twilio.

```
touch .env
```

In the .env file, you'll want these credentials:

```
TWILIO_ACCOUNT_SID=<your account SID>
TWILIO_API_KEY=<your api key>
TWILIO_API_SECRET=<your api key secret>
```

You can find your account SID in the Twilio Console Dashboard: https://www.twilio.com/console

You can create a new API key and get the secret through the
Twilio console: https://www.twilio.com/console/project/api-keys

To run the Flask server:

```
source venv/bin/activate
python server.py
```

This will start a server that you can access on your
local machine at port 5000 (`localhost:5000`).

Can't wait to see what you build with Twilio Video!
