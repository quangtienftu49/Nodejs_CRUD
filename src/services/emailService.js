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
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    html: `
    <h3>Xin chào ${dataSent.patientName}</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên BookingDoctors</p>
    <p>Thông tin đặt lịch khám như sau:</p>
    <div><b>Thời gian: ${dataSent.time}</b></div>
    <div><b>Bác sỹ: ${dataSent.doctorName}</b></div>
    
    <p>Vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh:</p>
    <div>
    <a href=${dataSent.redirectLink} target="_blank">Click here!</a>
    </div>
    <div></div>
    <div>Xin chân thành cảm ơn!</div>
    `, // html body
  });
};

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
}

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
};
