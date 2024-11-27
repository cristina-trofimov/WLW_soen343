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
    ecoPoints = db.Column(db.Integer, nullable=True, default=0)

class Package(db.Model):
    __tablename__ = 'packages'
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    weight = db.Column(db.Float, nullable=False)
    length = db.Column(db.Float, nullable=False)
    width = db.Column(db.Float, nullable=False)
    height = db.Column(db.Float, nullable=False)
    orderId = db.Column(db.String(32), db.ForeignKey('orders.trackingNumber'), nullable=True, index=True)
    # relationship to order, i think it will make it easier to query the order details
    order = db.relationship('Order', backref='packages', lazy=True, foreign_keys=[orderId])

class Order(db.Model):
    __tablename__ = 'orders'
    trackingNumber = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    price = db.Column(db.Float, nullable=False)
    packageId = db.Column(db.String(32), db.ForeignKey('packages.id'), nullable=False, index=True)
    orderDetailsId = db.relationship('OrderDetails', backref='orders', lazy=True)
    trackingDetailsId = db.relationship('TrackingDetails', backref='orders', lazy=True)
    customerId = db.Column(db.String(32), db.ForeignKey('customers.id'), nullable=False, index=True)
    # relationship to order, i think it will make it easier to query the order details
    customer = db.relationship('Customer', backref='orders', lazy=True)
    review = db.Column(db.String(1000), nullable=True)

class DeliveryTypeEnum(Enum):
    STANDARD = "standard"
    EXPRESS = "express"
    ECO = "eco"

class OrderDetails(db.Model):
    __tablename__ = 'orderDetails'
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    orderId = db.Column(db.String(32), db.ForeignKey('orders.trackingNumber'), nullable=True, index=True)
    senderName = db.Column(db.String(100), nullable=False)
    senderAddress = db.Column(db.String(255), nullable=False)
    recipientName = db.Column(db.String(100), nullable=False)
    recipientAddress = db.Column(db.String(255), nullable=False)
    recipientPhone = db.Column(db.Integer, nullable=False)
    minDeliveryDate = db.Column(db.String(100), nullable=True)
    chosenDeliveryDate = db.Column(db.String(100), nullable=True)
    chosenDeliveryTime = db.Column(db.String(100), nullable=True, default="12:00 AM")
    deliveryMethod = db.Column(db.Enum(*[e.value for e in DeliveryTypeEnum]), nullable=False)
    specialInstructions = db.Column(db.String(500), nullable=True)
    distance = db.Column(db.String(50), nullable=True)

class DeliveryStatusEnum(Enum):
    PENDING = "Pending"
    SHIPPED = "Shipped"
    IN_TRANSIT = "In Transit"
    OUT_FOR_DELIVERY = "Out for Delivery"
    DELIVERED = "Delivered"
    CANCELLED = "Cancelled"
   
class TrackingDetails(db.Model):
    __tablename__ = 'trackingDetails'
    trackingNumber = db.Column(db.String(32), db.ForeignKey('orders.trackingNumber'), primary_key=True)
    lastRegisteredLocation = db.Column(db.String(100), nullable=False)
    estimatedDeliveryTime = db.Column(db.String(100), nullable=True)
    status = db.Column(db.Enum(*[e.value for e in DeliveryStatusEnum]), nullable=False)
    deliveryPersonNumber = db.Column(db.Integer, nullable=True)