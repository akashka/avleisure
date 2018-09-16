'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Booking = mongoose.model('Booking'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  PDFDocument = require('pdfkit'),
  fs = require('fs'),
  moment = require('moment');
var htmlToPdf = require('html-to-pdf');
var conversion = require("phantom-html-to-pdf")();

/**
 * Create an booking
 */
exports.create = function (req, res) {
  var booking = new Booking(req.body);
  booking.user = req.user;

  booking.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(booking);
    }
  });
};

/**
 * Show the current booking
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var booking = req.booking ? req.booking.toJSON() : {};

  // Add a custom field to the Booking, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Booking model.
  booking.isCurrentUserOwner = !!(req.user && booking.user && booking.user._id.toString() === req.user._id.toString());

  res.json(booking);
};

/**
 * Update an booking
 */
exports.update = function (req, res) {
  var booking = req.booking;

  booking.booking_date = req.body.booking_date;
  booking.booking_amount = req.body.booking_amount;
  booking.school_name = req.body.school_name;
  booking.contact_person = req.body.contact_person;
  booking.contact_destination = req.body.contact_destination;
  booking.contact_phone = req.body.contact_phone;
  booking.contact_email = req.body.contact_email;
  booking.amount_paid = req.body.amount_paid;
  booking.no_of_students = req.body.no_of_students;
  booking.no_of_staff = req.body.no_of_staff;
  booking.class = req.body.class;
  booking.tour_managers = req.body.tour_managers;
  booking.destination = req.body.destination;
  booking.billing = req.body.billing;
  booking.expenses = req.body.expenses;
  booking.remarks = req.body.remarks;

  booking.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(booking);
    }
  });
};

/**
 * Delete an booking
 */
exports.delete = function (req, res) {
  var booking = req.booking;

  booking.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(booking);
    }
  });
};

/**
 * List of Bookings
 */
exports.list = function (req, res) {
  Booking.find().sort('-created').populate('user', 'displayName').exec(function (err, bookings) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bookings);
    }
  });
};

/**
 * Booking middleware
 */
exports.bookingByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Booking is invalid'
    });
  }

  Booking.findById(id).populate('user', 'displayName').exec(function (err, booking) {
    if (err) {
      return next(err);
    } else if (!booking) {
      return res.status(404).send({
        message: 'No booking with that identifier has been found'
      });
    }
    req.booking = booking;
    next();
  });
};

var calculateBillAmount = function (billing) {
  var amt = billing.bill_amount - (billing.gst_percentage * billing.bill_amount / 100);
  return (amt.toFixed(0));
}

var calculateGstAmount = function (billing) {
  var amt = billing.gst_percentage * billing.bill_amount / 100;
  return (amt.toFixed(0));
}

// Bill Generate
exports.downloadBill = function (req, res) {
  var id = req.params.bookingId;
  console.log(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Booking is invalid'
    });
  }

  Booking.findById(id).exec(function (err, booking) {
    if (err) {
      return next(err);
    } else if (!booking) {
      return res.status(404).send({
        message: 'No booking with that identifier has been found'
      });
    }

    var stringTemplate = fs.readFileSync(path.join(__dirname, '../helpers') + '/bill.html', "utf8");
    stringTemplate = stringTemplate.replace('[[InvoiceNo]]', (booking.booking_id != undefined) ? booking.booking_id : "");
    stringTemplate = stringTemplate.replace('[[InvoiceDate]]', (booking.created != undefined) ? moment(booking.created).format('dd/MMM/yyyy') : "");
    stringTemplate = stringTemplate.replace('[[BillerName]]', (booking.contact_person != undefined) ? booking.contact_person : "");
    stringTemplate = stringTemplate.replace('[[BillerAddress]]', (booking.school_name != undefined) ? booking.school_name : "");
    stringTemplate = stringTemplate.replace('[[ItineryName]]', (booking.destination != undefined) ? booking.destination : "");
    stringTemplate = stringTemplate.replace('[[TotalStudentsTeachers]]', (booking.no_of_students + booking.no_of_staff));
    stringTemplate = stringTemplate.replace('[[BillAmount]]', calculateBillAmount(booking.billing));
    stringTemplate = stringTemplate.replace('[[GstPercentage]]', booking.billing.gst_percentage);
    stringTemplate = stringTemplate.replace('[[GstAmount]]', calculateGstAmount(booking.billing));
    stringTemplate = stringTemplate.replace('[[TotalAmount]]', booking.billing.bill_amount);

    console.log(stringTemplate);

    conversion({ html: stringTemplate }, function (err, pdf) {
      var output = fs.createWriteStream('./output.pdf');
      pdf.stream.pipe(output);
      let filename = "invoice";
      filename = encodeURIComponent(filename) + '.pdf';
      var file = fs.readFileSync('./output.pdf');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
      pdf.stream.pipe(res);
    });

  });
}
