from datetime import datetime
from enum import Enum
from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4


db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class Customer(db.Model):
    __tablename__ = 'customers'
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)

class Package(db.Model):
    __tablename__ = 'packages'
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    weight = db.Column(db.Float, nullable=False)
    length = db.Column(db.Float, nullable=False)
    width = db.Column(db.Float, nullable=False)
    height = db.Column(db.Float, nullable=False)
    orderId = db.Column(db.String(32), db.ForeignKey('orders.trackingNumber'), nullable=True, index=True)
    # relationship to order, i think it will make it easier to query the order details
    order = db.relationship('Order', backref='packages', lazy=True)

class Order(db.Model):
    __tablename__ = 'orders'
    trackingNumber = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    price = db.Column(db.Float, nullable=False)
    packageId = db.Column(db.String(32), db.ForeignKey('packages.id'), nullable=False, index=True)
    orderDetailsId = db.relationship('OrderDetails', backref='order', lazy=True)
    customerId = db.Column(db.String(32), db.ForeignKey('customers.id'), nullable=False, index=True)
    # relationship to order, i think it will make it easier to query the order details
    customer = db.relationship('Customer', backref='orders', lazy=True)

class DeliveryTypeEnum(Enum):
    REGULAR = "Regular"
    EXPRESS = "Express"
    ECO = "Eco"

class OrderDetails(db.Model):
    __tablename__ = 'orderDetails'
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    orderId = db.Column(db.String(32), db.ForeignKey('orders.trackingNumber'), nullable=True, index=True)
    sourceAddress = db.Column(db.String(255), nullable=False)
    departureAddress = db.Column(db.String(255), nullable=False)
    scheduledArrivalTime = db.Column(db.DateTime, nullable=True)
    actualArrivalTime = db.Column(db.DateTime, nullable=True)
    deliveryType = db.Column(db.Enum(*[e.value for e in DeliveryTypeEnum]), nullable=False)
    # relationship to order, i think it will make it easier to query the order details
    order = db.relationship('Order', backref='order_details', lazy=True)

