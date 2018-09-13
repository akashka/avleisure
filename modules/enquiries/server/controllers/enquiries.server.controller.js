'use strict';

/* Module dependencies */
var path = require('path'),
  mongoose = require('mongoose'),
  Enquiry = mongoose.model('Enquiry'),
  Itinery = mongoose.model('Itinery'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var moment = require('moment');
var nodemailer = require('nodemailer');
var fs = require('fs');
var request = require('request-promise');
var curl = require('curlrequest');
var sgMail = require('@sendgrid/mail');
var _ = require('lodash-node');
var json2csv = require('json2csv');
var base64 = require('base-64');
var utf8 = require('utf8');
var h2p = require('html2plaintext')

var smsUrl = "http://alerts.valueleaf.com/api/v4/?api_key=A172d1e496771a5758651f00704e4ad18";
var adminNumber = ["7259596963"];
var adminEmail = "akash.ka01@gmail.in";
var senderID = "LILWO";

var apiKey = "SG";
apiKey += ".41G";
apiKey += "-EH6mS";
apiKey += "-WT7ZWg_5bH";
apiKey += "-g";
apiKey += ".gEep1FU0lKjI8";
apiKey += "D4gd4zpY7a5HR7";
apiKey += "Up9jmE0AENHKO09A";
sgMail.setApiKey(apiKey);


var sendEnquiryMail = function (enquiry) {
  console.log("Sending enquiry mail to School");
  Itinery.find().exec(function (err, itineries) {
    if (err) { res.send(err); }
    var attachments = [];
    for (var e = 0; e < enquiry.enquiries.length; e++) {
      for (var i = 0; i < itineries.length; i++) {
        if (itineries[i]._id == enquiry.enquiries[e].itineries) attachments.push(itineries[i]);
      }
    }

    console.log(attachments);

    var stringTemplate = fs.readFileSync(path.join(__dirname, '../helpers') + '/school_enquiry.html', "utf8");
    var mailOptions = {
      to: enquiry.school_email_id,
      cc: enquiry.alternate_email_id,
      bcc: adminEmail,
      from: 'info@avleisures.com',
      subject: 'Enquiry successfully received at AV Leisures',
      html: stringTemplate,
      attachments: []
    };

    for (var l = 0; l < attachments.length; l++) {
      mailOptions.attachments.push({
        content: base64.encode(h2p(utf8.encode(attachments[l].description))),
        filename: attachments[l].title + '.txt'
      });
    }

    console.log(mailOptions);

    sgMail.send(mailOptions, function (err) {
      if (err) {
        debugger;
        console.log(err);
        console.log(err.response);
        console.log(err.response.headers);
        console.log(err.response.body);
      }
    });
  });
};

var sendEnquirySms = function (enquiry) {
  console.log("Sending SMS to school");

  var messageData = "Thank you for your enquiry at AV Leisure. " +
    "We assure to give you the best quotes in the shortest time possible. " +
    "Meanwhile please check your mails for itinery. " +
    "For more details you can contact us.";

  var formData = smsUrl + "&method=sms&message=" + encodeURIComponent(messageData) + "&to=" + enquiry.school_phone_no + "&sender=" + senderID;
  var formData1 = smsUrl + "&method=sms&message=" + encodeURIComponent(messageData) + "&to=" + enquiry.alternate_phone_no + "&sender=" + senderID;
  console.log(formData);

  curl.request(formData, function optionalCallback(err, body) {
    if (err) {
      return console.error('Sending SMS to school failed: ', err);
    }
    console.log('Successfully sent SMS to school');
  });

  curl.request(formData1, function optionalCallback(err, body) {
    if (err) {
      return console.error('Sending SMS to school failed: ', err);
    }
    console.log('Successfully sent SMS to school');
  });
}

/* Create an enquiry */
exports.create = function (req, res) {
  var enquiry = new Enquiry(req.body);
  enquiry.user = req.user;
  enquiry.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      debugger;
      sendEnquiryMail(enquiry);
      sendEnquirySms(enquiry);
      res.json(enquiry);
    }
  });
};

/* Show the current enquiry */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var enquiry = req.enquiry ? req.enquiry.toJSON() : {};

  // Add a custom field to the Enquiry, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Enquiry model.
  enquiry.isCurrentUserOwner = !!(req.user && enquiry.user && enquiry.user._id.toString() === req.user._id.toString());

  res.json(enquiry);
};

/* Update an enquiry */
exports.update = function (req, res) {
  var enquiry = req.enquiry;

  // enquiry._id = req.body._id;
  enquiry.user = req.body.user;
  enquiry.enquiry_id = req.body.enquiry_id;
  enquiry.school_name = req.body.school_name;
  enquiry.school_address = req.body.school_address;
  enquiry.school_gprs = req.body.school_gprs;
  enquiry.school_photo = req.body.school_photo;
  enquiry.school_email_id = req.body.school_email_id;
  enquiry.school_phone_no = req.body.school_phone_no;
  enquiry.school_contact_person = req.body.school_contact_person;
  enquiry.enquiries = req.body.enquiries;
  enquiry.followups = req.body.followups;
  enquiry.alternate_email_id = req.body.alternate_email_id;
  enquiry.alternate_phone_no = req.body.alternate_phone_no;
  enquiry.enquiry_by = req.body.enquiry_by;

  enquiry.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(enquiry);
    }
  });
};

/* Delete an enquiry */
exports.delete = function (req, res) {
  var enquiry = req.enquiry;

  enquiry.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(enquiry);
    }
  });
};

/* List of Enquiries */
exports.list = function (req, res) {
  Enquiry.find().sort('-created').populate('user', 'displayName').exec(function (err, enquiries) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(enquiries);
    }
  });
};

/* Enquiry middleware */
exports.enquiryByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Enquiry is invalid'
    });
  }

  Enquiry.findById(id).populate('user', 'displayName').exec(function (err, enquiry) {
    if (err) {
      return next(err);
    } else if (!enquiry) {
      return res.status(404).send({
        message: 'No enquiry with that identifier has been found'
      });
    }
    req.enquiry = enquiry;
    next();
  });
};

/* Send email / sms on update */
exports.sendEmailSms = function (req, res) {
  var enquiry = new Enquiry(req.body);
  sendEnquiryMail(enquiry);
  sendEnquirySms(enquiry);
};

var sendQuotationMail = function(enquiry) {

}

var sendQuotationSms = function(enquiry) {

}

exports.sendQuotations = function(req, res) {
  var enquiry = new Enquiry(req.body);
  sendQuotationMail(enquiry);
  sendQuotationSms(enquiry);
}