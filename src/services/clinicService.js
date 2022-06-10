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
        await db.Clinic.create({
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
      let data = await db.Clinic.findAll({});

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

let getDetailClinicById = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let data = {};
        // return an array with multiple objects {provinceId: "PRO1"} etc,...
        let provinceSpecialty = await db.Doctor_infor.findAll({
          attributes: ["provinceId"],
        });

        // convert the above arr into an arr with only province code
        let provinceSpecialtyArr = [];
        for (let i = 0; i < provinceSpecialty.length; i++) {
          provinceSpecialtyArr.push(provinceSpecialty[i].provinceId);
        }

        if (location === "ALL") {
          // search all locations
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
        } else if (provinceSpecialtyArr.indexOf(location) >= 0) {
          // search only on location
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
        } else {
          // return only description with locations without any registered doctors
          data = await db.Specialty.findOne({
            where: {
              id: inputId,
            },
            attributes: ["descriptionHTML", "descriptionMarkdown"],
            raw: false,
            nest: true,
          });
        }

        // data = await db.Specialty.findOne({
        //   where: {
        //     id: inputId,
        //   },
        //   attributes: ["descriptionHTML", "descriptionMarkdown"],
        //   include: [
        //     {
        //       model: db.Doctor_infor,
        //       attributes: ["doctorId", "provinceId"],
        //     },
        //   ],
        //   raw: false,
        //   nest: true,
        // });

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
  createClinic: createClinic,
  getAllClinics: getAllClinics,
  getDetailClinicById: getDetailClinicById,
};
