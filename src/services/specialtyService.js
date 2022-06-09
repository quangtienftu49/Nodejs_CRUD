const db = require("../models");

let createSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        await db.Specialty.create({
          name: data.name,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        });

        resolve({
          errCode: 0,
          errMessage: "Created a new specialty successfully!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllSpecialties = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // findAll here means all data for a small amount of records
      // if thousands/millions of record, we need to use "limit"
      let data = await db.Specialty.findAll({});

      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
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

let getDetailSpecialtyById = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let data = [];
        if (location === "ALL") {
          data = await db.Specialty.findOne({
            where: {
              id: inputId,
            },
            attributes: ["descriptionHTML", "descriptionMarkdown"],
            include: [
              {
                model: db.Doctor_infor,
                attributes: ["doctorId", "provinceId"],
              },
            ],
            raw: false,
            nest: true,
          });
        } else {
          data = await db.Specialty.findOne({
            where: {
              id: inputId,
            },
            attributes: ["descriptionHTML", "descriptionMarkdown"],
            include: [
              {
                model: db.Doctor_infor,
                attributes: ["doctorId", "provinceId"],
                where: { provinceId: location },
              },
            ],
            raw: false,
            nest: true,
          });
        }

        if (!data) {
          data = {};
        }

        // if (data) {
        //   let doctorSpecialty = [];

        //   if (location === "ALL") {
        //     doctorSpecialty = await db.Doctor_infor.findAll({
        //       where: { specialtyId: inputId },
        //       attributes: ["doctorId", "provinceId"],
        //     });
        //   } else {
        //     // Find by location
        //     doctorSpecialty = await db.Doctor_infor.findAll({
        //       where: { specialtyId: inputId, provinceId: location },
        //       attributes: ["doctorId", "provinceId"],
        //     });
        //   }

        //   data.doctorSpecialty = doctorSpecialty;
        // } else data = {};

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
  createSpecialty: createSpecialty,
  getAllSpecialties: getAllSpecialties,
  getDetailSpecialtyById: getDetailSpecialtyById,
};
