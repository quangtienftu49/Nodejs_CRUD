const db = require("../models");

let createClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        await db.Clinics.create({
          name: data.name,
          address: data.address,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        });

        resolve({
          errCode: 0,
          errMessage: "Created a new clinic successfully!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllClinics = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinics.findAll({});

      if (data && data.length > 0) {
        data.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errCode: 0,
        errMessage: "OK",
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailClinicById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let data = await db.Clinics.findOne({
          where: {
            id: inputId,
          },
          attributes: [
            "descriptionHTML",
            "descriptionMarkdown",
            "address",
            "name",
          ],
          include: [
            {
              model: db.Doctor_infor,
              attributes: ["doctorId", "provinceId"],
            },
          ],
          raw: false,
          nest: true,
        });

        if (!data) {
          data = {};
        }

        resolve({
          errCode: 0,
          errMessage: "OK",
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createClinic: createClinic,
  getAllClinics: getAllClinics,
  getDetailClinicById: getDetailClinicById,
};
