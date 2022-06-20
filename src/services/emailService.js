require("dotenv").config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSent) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"TIEN DINH 👻" <quangtienftu49@gmail.com>', // sender address
    to: dataSent.receiverEmail, // list of receivers
    subject: getSubject(dataSent), // Subject line
    html: getBodyHTMLEmail(dataSent),
  });
};

let getSubject = (dataSent) => {
  let result = "";

  if (dataSent.language === "vi") {
    result = "Thông tin đặt lịch khám bệnh";
  } else if (dataSent.language === "en") {
    result = "Booking Information";
  }

  return result;
};

let getBodyHTMLEmail = (dataSent) => {
  let result = "";

  if (dataSent.language === "vi") {
    result = `
    <h3>Xin chào ${dataSent.patientName}!</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên BookingDoctors.</p>
    <p>Thông tin đặt lịch khám như sau:</p>
    <div><b>Thời gian: ${dataSent.time}</b></div>
    <div><b>Bác sỹ: ${dataSent.doctorName}</b></div>
    
    <p>Vui lòng nhấn vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh:</p>
    <div>
    <a href=${dataSent.redirectLink} target="_blank">Nhấn vào đây!</a>
    </div>
    <div></div>
    <div>Xin chân thành cảm ơn!</div>
    `;
  } else if (dataSent.language === "en") {
    result = `
    <h3>Dear ${dataSent.patientName},</h3>
    <p>This email was sent to you because you booked an appointment on BookingDoctors.</p>
    <p>The appointment details as belows:</p>
    <div><b>Time: ${dataSent.time}</b></div>
    <div><b>Doctor: ${dataSent.doctorName}</b></div>
    
    <p>Please click the link below to finish and confirm your appointment:</p>
    <div>
    <a href=${dataSent.redirectLink} target="_blank">Click here!</a>
    </div>
    <div></div>
    <div>Thank you for booking with us!</div>
    `;
  }

  return result;
};

let getBodyHTMLEmailPrescription = (dataSent) => {
  let result = "";

  if (dataSent.language === "vi") {
    result = `
    <h3>Xin chào ...!</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên BookingDoctors.</p>
    <p>Thông tin đơn thuốc và hóa đơn được gửi trong file đính kèm.</p>
    
    
    
    <div>Xin chân thành cảm ơn!</div>
    `;
  } else if (dataSent.language === "en") {
    result = `
    <h3>Dear ...,</h3>
    <p>This email was sent to you because you booked an appointment on BookingDoctors.</p>
    <p>The receipt and prescription as attachments.</p>
    
    <div>Thank you for booking with us!</div>
    `;
  }

  return result;
};

let sendAttachment = async (dataSent) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"TIEN DINH 👻" <quangtienftu49@gmail.com>', // sender address
    to: dataSent.receiverEmail, // list of receivers
    subject: "Kết quả đặt lịch khám bệnh", // Subject line
    html: getBodyHTMLEmailPrescription(dataSent),
    attachments: [
      {
        // encoded string as an attachment
        filename: "text1.png",
        content: "aGVsbG8gd29ybGQh",
        encoding: dataSent.imgBase64,
      },
    ],
  });
};

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendAttachment: sendAttachment,
};
