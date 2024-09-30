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
