import clinicService from "../services/clinicService";

let createClinic = async (req, res) => {
  try {
    // req.body to get infor from react
    let infor = await clinicService.createClinic(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getAllClinics = async (req, res) => {
  try {
    let infor = await clinicService.getAllClinics();
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getDetailClinicById = async (req, res) => {
  try {
    let infor = await clinicService.getDetailClinicById(
      req.query.id
      // req.query.location
    );
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

module.exports = {
  createClinic: createClinic,
  getAllClinics: getAllClinics,
  getDetailClinicById: getDetailClinicById,
};
