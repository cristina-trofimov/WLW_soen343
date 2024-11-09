from datetime import datetime
from flask import Flask, request, jsonify, session
from models import db, Customer, Package, Order, OrderDetails, DeliveryTypeEnum
from config import ApplicationConfig
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
from endpoints.auth import auth, bcrypt

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt.init_app(app)
cors = CORS(app, supports_credentials=True)
server_session = Session(app)

db.init_app(app)

with app.app_context():
    db.create_all()
    
 
app.register_blueprint(auth)