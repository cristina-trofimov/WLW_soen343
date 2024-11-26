# contact.py

from flask import Blueprint, request, jsonify, current_app
from models import db, Customer
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import smtplib

contact = Blueprint('contact', __name__)

@contact.route('/send_email', methods=['POST'])
def submit_form():
    # Get form data
    data = request.json

    topic = data.get('topic')
    userEmail = data.get('email')
    message = data.get('message')

    # Validate inputs
    if not topic or not userEmail or not message:
        return jsonify({"status": "error", "message": "All fields are required."}), 400

    try:
        # Call the send_email function
        send_email(topic, userEmail, message)
        return jsonify({"status": "success", "message": "Email sent successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error sending email: {str(e)}")
        return jsonify({"status": "error", "message": f"Failed to send email: {str(e)}"}), 500


def send_email(topic, user_email, message):
    sender_email = "miss.worldwide.wlw@hotmail.com"
    sender_password = "MissWorldwide123"
    recipient_email = "miss.worldwide.wlw@hotmail.com"

    # Compose email
    subject = topic
    body = f"Message: {message}\nSent by: {user_email}"

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    # Send email using SMTP
    with smtplib.SMTP('smtp.office365.com', 587) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)