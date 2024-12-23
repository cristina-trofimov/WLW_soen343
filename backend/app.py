from flask import Flask, request, jsonify, session
from models import db, Customer, Package, Order, OrderDetails, DeliveryTypeEnum
from config import ApplicationConfig
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
from endpoints.auth import auth, bcrypt
from endpoints.payment import payment_blueprint
from endpoints.order import order
from endpoints.tracking import tracking
from endpoints.contact import contact
from endpoints.customer import customer

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt.init_app(app)
cors = CORS(app, supports_credentials=True,resources={r"/*": {"origins": "http://localhost:5173"}})
server_session = Session(app)

db.init_app(app)

with app.app_context():
    db.create_all()
    
 
app.register_blueprint(auth)
app.register_blueprint(payment_blueprint)
app.register_blueprint(order)
app.register_blueprint(tracking)
app.register_blueprint(contact)
app.register_blueprint(customer)

if __name__ == "__main__":
    app.run(debug=True)