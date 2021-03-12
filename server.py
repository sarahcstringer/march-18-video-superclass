import os
import uuid

import twilio
import twilio.jwt.access_token
import twilio.jwt.access_token.grants
import twilio.rest
from dotenv import load_dotenv
from flask import Flask, render_template, request

# Load environment variables from a `.env` file
load_dotenv()

# Create a Flask app
app = Flask(__name__)

# Twilio client initialization
account_sid = os.environ["TWILIO_ACCOUNT_SID"]
api_key = os.environ["TWILIO_API_KEY"]
api_secret = os.environ["TWILIO_API_SECRET"]

# Room settings
ROOM_NAME = "Superclass!"
MAX_PARTICIPANTS = 6

twilio_client = twilio.rest.Client(api_key, api_secret, account_sid)


def find_or_create_room(room_name):
    try:
        room = twilio_client.video.rooms(room_name).fetch()
    except twilio.base.exceptions.TwilioRestException:
        room = twilio_client.video.rooms.create(
            unique_name=ROOM_NAME, type="group", max_participants=6
        )
    print(f"{room.unique_name} has {len(room.participants.list())} participants")
    return room


@app.route("/")
def serve():
    """Render the homepage."""
    room = find_or_create_room(ROOM_NAME)
    return render_template("index.html")


@app.route("/token", methods=["POST"])
def get_access_token():
    """Retrieve an access token for a Room Participant."""
    access_token = twilio.jwt.access_token.AccessToken(
        account_sid, api_key, api_secret, identity=uuid.uuid4().int
    )
    video_grant = twilio.jwt.access_token.grants.VideoGrant(room=ROOM_NAME)
    access_token.add_grant(video_grant)
    return {"token": access_token.to_jwt().decode()}


# Start the server when we run this file
if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
