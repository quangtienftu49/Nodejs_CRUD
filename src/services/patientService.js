import db from "../models/index";
require("dotenv").config();
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
import res from "express/lib/response";

let buildUrlEmail = (doctorId) => {
  let result = "";
  let id = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

  result = `${process.env.URL_REACT}/verify-booking?token=${id}&doctorId=${doctorId}`;

  return result;
};

let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.fullName ||
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        await emailService.sendSimpleEmail({
          receiverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: buildUrlEmail(data.doctorId),
        });

        //upsert patient
        // findOrCreate is to check if record is existed >> not recorded,
        // if not existed >> inserted
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
          },
        });

        console.log("check user", user[0]);

        //create a booking record
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: { patientId: user[0].id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
            },
          });
        }

        resolve({
          errCode: 0,
          errMessage: "Save patient infor successfully!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  postBookAppointment: postBookAppointment,
};
