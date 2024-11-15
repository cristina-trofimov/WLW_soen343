from flask import Blueprint
from flask import Flask, jsonify, request
from models import db, TrackingDetails
from sqlalchemy.orm import joinedload


tracking = Blueprint('tracking', __name__)


@tracking.route("/tracking_details", methods=["GET"])
def get_tracking_details():
    tracking_number = request.args.get('trackingNumber')

    if tracking_number:
        # Fetch tracking details for a specific tracking number
        tracking_detail = TrackingDetails.query.options(joinedload(TrackingDetails.order)).get(tracking_number)
        if not tracking_detail:
            return jsonify({"message": "No tracking details found for this tracking number"}), 404
        
        result = format_tracking_detail(tracking_detail)
        return jsonify(result), 200
    else:
        # Fetch all tracking details
        tracking_details = TrackingDetails.query.options(joinedload(TrackingDetails.order)).all()
        if not tracking_details:
            return jsonify({"message": "No tracking details found"}), 404
        
        result = [format_tracking_detail(detail) for detail in tracking_details]
        return jsonify(result), 200

def format_tracking_detail(detail):
    return {
        "trackingNumber": detail.trackingNumber,
        "lastRegisteredLocation": detail.lastRegisteredLocation,
        "timeLastRegistered": detail.timeLastRegistered,
        "status": detail.status,
        "order": {
            "price": detail.order.price if detail.order else None,
            "packageId": detail.order.packageId if detail.order else None,
            "customerId": detail.order.customerId if detail.order else None
        }
    }


