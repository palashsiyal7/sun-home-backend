const asyncHandler = require("express-async-handler");
const Patient = require("../models/PatientModel");

// Get all patients
const getPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find({});
  res.status(200).json(patients);
});

//Get all patinets with pagination
// const getPatients = asyncHandler(async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 5;

//     const skip = (page - 1) * limit;

//     const patients = await Patient.find({}).skip(skip).limit(limit);

//     res.status(200).json({
//       patients,
//       currentPage: page,
//       totalPages: Math.ceil(await Patient.countDocuments({}) / limit),
//     });
//   } catch (error) {
//     console.error("Error while fetching patients:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// Get patient by Id
// const getPatientById = asyncHandler(async (req, res) => {
//   const patientId = req.params.id;

//   const patient = await Patient.findById(patientId);

//   if (!patient) {
//     res.status(404).json({ error: "Patient not found" });
//   } else {
//     res.status(200).json(patient);
//   }
// });

const getPatientById = asyncHandler(async (req, res) => {
  const patientId = req.params.id;

  const patient = await Patient.findById(patientId)
    .select({
      _id: 1,
      patient_name: 1,
      ss: 1,
      mcr: 1,
      mcd: 1,
      specialRequest: 1,
      dob: 1,
      city: 1,
      state: 1,
      zip: 1,
      phoneNumber: 1,
      address: 1,
      relativeNameFirst: 1,
      relativeContactFirst: 1,
      caseMgrName: 1,
      caseMgrPhone: 1,
      caseMgrEmail: 1,
      doctorName: 1,
      npi: 1,
      doctorPhone: 1,
      doctorAddress: 1,
      doctorCity: 1,
      doctorState: 1,
      doctorZip: 1,
      daysNeeded: 1,
      timeSlots: 1,
      programs: 1,
      code: 1,
      image: 1
    })
    .populate('timeSlots') // Assuming 'timeSlots' is the correct field name in your Patient model
    .populate('programs'); // Assuming 'programs' is the correct field name in your Patient model

  if (!patient) {
    res.status(404).json({ error: "Patient not found" });
  } else {
    res.status(200).json(patient);
  }
});


// Add new patient
// const createPatient = asyncHandler(async (req, res) => {
//   const {
//     name,
//     dob,
//     city,
//     state,
//     zip,
//     phoneNumber,
//     address,
//     relativeNameFirst,
//     relativeContactFirst,
//     relativeNameSecond,
//     relativeContactSecond,
//     caseMgrName,
//     caseMgrPhone,
//     caseMgrFax,
//     caseMgrEmail,
//     doctorName,
//     doctorPhone,
//     doctorFax,
//     daysNeeded,
//     timeSlots,
//     programs,
//     liveAlone,
//     liveWithOther,
//     aloneDuringDay,
//     bedBound,
//     bedRest,
//     upAsTolerated,
//     amputee,
//     amputeeInfo,
//     partialWeightBearing,
//     partialWeightBearingR,
//     partialWeightBearingL,
//     normalWeightBearing,
//     normalWeightBearingR,
//     normalWeightBearingL,
//     fallPrecautions,
//     speechDeficit,
//     visionDeficit,
//     glasses,
//     contacts,
//     visionOther,
//     hearingDeficit,
//     hearingAid,
//     dentures,
//     upper,
//     lower,
//     partial,
//     forgetfull,
//     urinaryCatheter,
//     prosthesis,
//     prosthesisInfo,
//     allergies,
//     allergiesInfo,
//     diabetic,
//     doNotCutNails,
//     diet,
//     dietInfo,
//     seizurePrecaution,
//     proneToFactures,
//     precautionOther,
//     bath_tubShowerEveryVisit,
//     bath_tubShowerWeekly,
//     bath_bedBathPartial,
//     bath_bedBathComplete,
//     bath_bedBathEveryVisit,
//     bath_bedBathWeekly,
//     bath_assistBathChairEveryVisit,
//     bath_assistBathChairWeekly,
//     bathOtherInfo,
//     personalCareEveryVisit,
//     personalCareWeekly,
//     personalCare_assistWithDressingEveryVisit,
//     personalCare_assistWithDressingWeekly,
//     personalCare_groomHairEveryVisit,
//     personalCare_groomHairWeekly,
//     personalCare_shampooEveryVisit,
//     personalCare_shampooWeekly,
//     personalCare_skinCareEveryVisit,
//     personalCare_skinCareWeekly,
//     personalCare_teethCareEveryVisit,
//     personalCare_teethCareWeekly,
//     personalCare_otherEveryVisit,
//     personalCare_otherWeekly,
//     personalCare_otherInfo,
//     procedures_toiletingAssistEveryVisit,
//     procedures_toiletingAssistWeekly,
//     procedures_catheterCareEveryVisit,
//     procedures_catheterCareWeekly,
//     procedures_ostomyCareEveryVisit,
//     procedures_ostomyCareWeekly,
//     procedures_medicationReminderEveryVisit,
//     procedures_medicationReminderWeekly,
//     procedures_otherEveryVisit,
//     procedures_otherWeekly,
//     procedures_otherInfo,
//     activity_assistWithAmbulation,
//     activity_assistWithWheelChair,
//     activity_assistWithWalker,
//     activity_assistWithCane,
//     activity_assistWithEveryVisit,
//     activity_assistWithWeekly,
//     activity_mobilityAssistChair,
//     activity_mobilityAssistBed,
//     activity_mobilityAssistShower,
//     activity_mobilityAssistTub,
//     activity_mobilityAssistEveryVisit,
//     activity_mobilityAssistWeekly,
//     activity_exercisePerPTOT,
//     activity_exercisePerCarePlan,
//     activity_exerciseEveryVisit,
//     activity_exerciseWeekly,
//     activity_otherEveryVisit,
//     activity_otherWeekly,
//     activity_otherInfo,
//     nutrition_mealPreparationEveryVisit,
//     nutrition_mealPreparationWeekly,
//     nutrition_assistWithFeedingEveryVisit,
//     nutrition_assistWithFeedingWeekly,
//     nutrition_limitFluid,
//     nutrition_encourageFluid,
//     nutrition_fluidEveryVisit,
//     nutrition_fluidWeekly,
//     nutrition_groceryShoppingEveryVisit,
//     nutrition_groceryShoppingWeekly,
//     nutrition_otherEveryVisit,
//     nutrition_otherWeekly,
//     nutrition_otherInfo,
//     other_laundryEveryVisit,
//     other_laundryWeekly,
//     other_bedroomKeeping,
//     other_bathroomKeeping,
//     other_kitchenKeeping,
//     other_bedLinenKeeping,
//     other_houseKeepingEveryVisit,
//     other_houseKeepingWeekly,
//     other_equipmentCareEveryVisit,
//     other_equipmentCareWeekly,
//     other_transportationEveryVisit,
//     other_transportationWeekly,
//     other_otherInfo,
//   } = req.body;

//   // Check if required fields are provided
//   if (
//     !name ||
//     !dob ||
//     !state ||
//     !city ||
//     !zip ||
//     !phoneNumber ||
//     !address ||
//     !relativeContactFirst ||
//     !relativeNameFirst ||
//     !caseMgrName ||
//     !caseMgrPhone ||
//     !caseMgrFax ||
//     !caseMgrEmail ||
//     !doctorName ||
//     !doctorPhone ||
//     !doctorFax
//   ) {
//     res.status(400).json({ error: "Required fields are missing" });
//     return;
//   }

  // // Check if phoneNumber is already in use
  // const existingContactNo = await Patient.findOne({ phoneNumber });
  // if (existingContactNo) {
  //   res.status(422).json({ error: "Contact Number already in use" });
  //   return;
  // }

//   // Create the patient
//   try {
//     const patient = await Patient.create({
//       patient_name: name,
//       dob,
//       city,
//       state,
//       zip,
//       phoneNumber,
//       address,
//       relativeNameFirst,
//       relativeContactFirst,
//       relativeNameSecond: relativeNameSecond || "NA",
//       relativeContactSecond: relativeContactSecond || "NA",
//       caseMgrName,
//       caseMgrPhone,
//       caseMgrFax,
//       caseMgrEmail,
//       doctorName,
//       doctorPhone,
//       doctorFax,
//       daysNeeded,
//       timeSlots,
//       programs,
//       liveAlone,
//       liveWithOther,
//       aloneDuringDay,
//       bedBound,
//       bedRest,
//       upAsTolerated,
//       amputee,
//       amputeeInfo,
//       partialWeightBearing,
//       partialWeightBearingR,
//       partialWeightBearingL,
//       normalWeightBearing,
//       normalWeightBearingR,
//       normalWeightBearingL,
//       fallPrecautions,
//       speechDeficit,
//       visionDeficit,
//       glasses,
//       contacts,
//       visionOther,
//       hearingDeficit,
//       hearingAid,
//       dentures,
//       upper,
//       lower,
//       partial,
//       forgetfull,
//       urinaryCatheter,
//       prosthesis,
//       prosthesisInfo,
//       allergies,
//       allergiesInfo,
//       diabetic,
//       doNotCutNails,
//       diet,
//       dietInfo,
//       seizurePrecaution,
//       proneToFactures,
//       precautionOther,
//       bath_tubShowerEveryVisit,
//       bath_tubShowerWeekly,
//       bath_bedBathPartial,
//       bath_bedBathComplete,
//       bath_bedBathEveryVisit,
//       bath_bedBathWeekly,
//       bath_assistBathChairEveryVisit,
//       bath_assistBathChairWeekly,
//       bathOtherInfo,
//       personalCareEveryVisit,
//       personalCareWeekly,
//       personalCare_assistWithDressingEveryVisit,
//       personalCare_assistWithDressingWeekly,
//       personalCare_groomHairEveryVisit,
//       personalCare_groomHairWeekly,
//       personalCare_shampooEveryVisit,
//       personalCare_shampooWeekly,
//       personalCare_skinCareEveryVisit,
//       personalCare_skinCareWeekly,
//       personalCare_teethCareEveryVisit,
//       personalCare_teethCareWeekly,
//       personalCare_otherEveryVisit,
//       personalCare_otherWeekly,
//       personalCare_otherInfo,
//       procedures_toiletingAssistEveryVisit,
//       procedures_toiletingAssistWeekly,
//       procedures_catheterCareEveryVisit,
//       procedures_catheterCareWeekly,
//       procedures_ostomyCareEveryVisit,
//       procedures_ostomyCareWeekly,
//       procedures_medicationReminderEveryVisit,
//       procedures_medicationReminderWeekly,
//       procedures_otherEveryVisit,
//       procedures_otherWeekly,
//       procedures_otherInfo,
//       activity_assistWithAmbulation,
//       activity_assistWithWheelChair,
//       activity_assistWithWalker,
//       activity_assistWithCane,
//       activity_assistWithEveryVisit,
//       activity_assistWithWeekly,
//       activity_mobilityAssistChair,
//       activity_mobilityAssistBed,
//       activity_mobilityAssistShower,
//       activity_mobilityAssistTub,
//       activity_mobilityAssistEveryVisit,
//       activity_mobilityAssistWeekly,
//       activity_exercisePerPTOT,
//       activity_exercisePerCarePlan,
//       activity_exerciseEveryVisit,
//       activity_exerciseWeekly,
//       activity_otherEveryVisit,
//       activity_otherWeekly,
//       activity_otherInfo,
//       nutrition_mealPreparationEveryVisit,
//       nutrition_mealPreparationWeekly,
//       nutrition_assistWithFeedingEveryVisit,
//       nutrition_assistWithFeedingWeekly,
//       nutrition_limitFluid,
//       nutrition_encourageFluid,
//       nutrition_fluidEveryVisit,
//       nutrition_fluidWeekly,
//       nutrition_groceryShoppingEveryVisit,
//       nutrition_groceryShoppingWeekly,
//       nutrition_otherEveryVisit,
//       nutrition_otherWeekly,
//       nutrition_otherInfo,
//       other_laundryEveryVisit,
//       other_laundryWeekly,
//       other_bedroomKeeping,
//       other_bathroomKeeping,
//       other_kitchenKeeping,
//       other_bedLinenKeeping,
//       other_houseKeepingEveryVisit,
//       other_houseKeepingWeekly,
//       other_equipmentCareEveryVisit,
//       other_equipmentCareWeekly,
//       other_transportationEveryVisit,
//       other_transportationWeekly,
//       other_otherInfo,
//     });
//     res.status(201).json({ message: "Entry added successfully", patient });
//   } catch (error) {
//     console.error("Error creating patient:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// CREATE a new patient
const createPatient = async (req, res) => {
  try {
    const {
      patient_name,
      ss,
      mcr,
      mcd,
      specialRequest,
      dob,
      city,
      state,
      zip,
      phoneNumber,
      address,
      relativeNameFirst,
      relativeContactFirst,
      caseMgrName,
      caseMgrPhone,
      caseMgrEmail,
      doctorName,
      npi,
      doctorPhone,
      doctorAddress,
      doctorCity,
      doctorState,
      doctorZip,
      daysNeeded,
      timeSlots,
      programs,
      image,
      liveAlone,
    liveWithOther,
    aloneDuringDay,
    bedBound,
    bedRest,
    upAsTolerated,
    amputee,
    amputeeInfo,
    partialWeightBearing,
    partialWeightBearingR,
    partialWeightBearingL,
    normalWeightBearing,
    normalWeightBearingR,
    normalWeightBearingL,
    fallPrecautions,
    speechDeficit,
    visionDeficit,
    glasses,
    contacts,
    visionOther,
    hearingDeficit,
    hearingAid,
    dentures,
    upper,
    lower,
    partial,
    forgetfull,
    urinaryCatheter,
    prosthesis,
    prosthesisInfo,
    allergies,
    allergiesInfo,
    diabetic,
    doNotCutNails,
    diet,
    dietInfo,
    seizurePrecaution,
    proneToFactures,
    precautionOther,
    bath_tubShowerEveryVisit,
    bath_tubShowerWeekly,
    bath_bedBathPartial,
    bath_bedBathComplete,
    bath_bedBathEveryVisit,
    bath_bedBathWeekly,
    bath_assistBathChairEveryVisit,
    bath_assistBathChairWeekly,
    bathOtherInfo,
    personalCareEveryVisit,
    personalCareWeekly,
    personalCare_assistWithDressingEveryVisit,
    personalCare_assistWithDressingWeekly,
    personalCare_groomHairEveryVisit,
    personalCare_groomHairWeekly,
    personalCare_shampooEveryVisit,
    personalCare_shampooWeekly,
    personalCare_skinCareEveryVisit,
    personalCare_skinCareWeekly,
    personalCare_teethCareEveryVisit,
    personalCare_teethCareWeekly,
    personalCare_otherEveryVisit,
    personalCare_otherWeekly,
    personalCare_otherInfo,
    procedures_toiletingAssistEveryVisit,
    procedures_toiletingAssistWeekly,
    procedures_catheterCareEveryVisit,
    procedures_catheterCareWeekly,
    procedures_ostomyCareEveryVisit,
    procedures_ostomyCareWeekly,
    procedures_medicationReminderEveryVisit,
    procedures_medicationReminderWeekly,
    procedures_otherEveryVisit,
    procedures_otherWeekly,
    procedures_otherInfo,
    activity_assistWithAmbulation,
    activity_assistWithWheelChair,
    activity_assistWithWalker,
    activity_assistWithCane,
    activity_assistWithEveryVisit,
    activity_assistWithWeekly,
    activity_mobilityAssistChair,
    activity_mobilityAssistBed,
    activity_mobilityAssistShower,
    activity_mobilityAssistTub,
    activity_mobilityAssistEveryVisit,
    activity_mobilityAssistWeekly,
    activity_exercisePerPTOT,
    activity_exercisePerCarePlan,
    activity_exerciseEveryVisit,
    activity_exerciseWeekly,
    activity_otherEveryVisit,
    activity_otherWeekly,
    activity_otherInfo,
    nutrition_mealPreparationEveryVisit,
    nutrition_mealPreparationWeekly,
    nutrition_assistWithFeedingEveryVisit,
    nutrition_assistWithFeedingWeekly,
    nutrition_limitFluid,
    nutrition_encourageFluid,
    nutrition_fluidEveryVisit,
    nutrition_fluidWeekly,
    nutrition_groceryShoppingEveryVisit,
    nutrition_groceryShoppingWeekly,
    nutrition_otherEveryVisit,
    nutrition_otherWeekly,
    nutrition_otherInfo,
    other_laundryEveryVisit,
    other_laundryWeekly,
    other_bedroomKeeping,
    other_bathroomKeeping,
    other_kitchenKeeping,
    other_bedLinenKeeping,
    other_houseKeepingEveryVisit,
    other_houseKeepingWeekly,
    other_equipmentCareEveryVisit,
    other_equipmentCareWeekly,
    other_transportationEveryVisit,
    other_transportationWeekly,
    other_otherInfo,
      // ... include other fields as needed
    } = req.body;

    // Generate code based on the provided information
    const code = generatePatientCode(patient_name, address, zip);

    const newPatient = new Patient({
      patient_name,
      ss,
      mcr,
      mcd,
      specialRequest,
      dob,
      city,
      state,
      zip,
      code,
      phoneNumber,
      address,
      relativeNameFirst,
      relativeContactFirst,
      caseMgrName,
      caseMgrPhone,
      caseMgrEmail,
      doctorName,
      npi,
      doctorPhone,
      doctorAddress,
      doctorCity,
      doctorState,
      doctorZip,
      daysNeeded,
      timeSlots,
      programs,
      image,
      liveAlone,
      liveWithOther,
      aloneDuringDay,
      bedBound,
      bedRest,
      upAsTolerated,
      amputee,
      amputeeInfo,
      partialWeightBearing,
      partialWeightBearingR,
      partialWeightBearingL,
      normalWeightBearing,
      normalWeightBearingR,
      normalWeightBearingL,
      fallPrecautions,
      speechDeficit,
      visionDeficit,
      glasses,
      contacts,
      visionOther,
      hearingDeficit,
      hearingAid,
      dentures,
      upper,
      lower,
      partial,
      forgetfull,
      urinaryCatheter,
      prosthesis,
      prosthesisInfo,
      allergies,
      allergiesInfo,
      diabetic,
      doNotCutNails,
      diet,
      dietInfo,
      seizurePrecaution,
      proneToFactures,
      precautionOther,
      bath_tubShowerEveryVisit,
      bath_tubShowerWeekly,
      bath_bedBathPartial,
      bath_bedBathComplete,
      bath_bedBathEveryVisit,
      bath_bedBathWeekly,
      bath_assistBathChairEveryVisit,
      bath_assistBathChairWeekly,
      bathOtherInfo,
      personalCareEveryVisit,
      personalCareWeekly,
      personalCare_assistWithDressingEveryVisit,
      personalCare_assistWithDressingWeekly,
      personalCare_groomHairEveryVisit,
      personalCare_groomHairWeekly,
      personalCare_shampooEveryVisit,
      personalCare_shampooWeekly,
      personalCare_skinCareEveryVisit,
      personalCare_skinCareWeekly,
      personalCare_teethCareEveryVisit,
      personalCare_teethCareWeekly,
      personalCare_otherEveryVisit,
      personalCare_otherWeekly,
      personalCare_otherInfo,
      procedures_toiletingAssistEveryVisit,
      procedures_toiletingAssistWeekly,
      procedures_catheterCareEveryVisit,
      procedures_catheterCareWeekly,
      procedures_ostomyCareEveryVisit,
      procedures_ostomyCareWeekly,
      procedures_medicationReminderEveryVisit,
      procedures_medicationReminderWeekly,
      procedures_otherEveryVisit,
      procedures_otherWeekly,
      procedures_otherInfo,
      activity_assistWithAmbulation,
      activity_assistWithWheelChair,
      activity_assistWithWalker,
      activity_assistWithCane,
      activity_assistWithEveryVisit,
      activity_assistWithWeekly,
      activity_mobilityAssistChair,
      activity_mobilityAssistBed,
      activity_mobilityAssistShower,
      activity_mobilityAssistTub,
      activity_mobilityAssistEveryVisit,
      activity_mobilityAssistWeekly,
      activity_exercisePerPTOT,
      activity_exercisePerCarePlan,
      activity_exerciseEveryVisit,
      activity_exerciseWeekly,
      activity_otherEveryVisit,
      activity_otherWeekly,
      activity_otherInfo,
      nutrition_mealPreparationEveryVisit,
      nutrition_mealPreparationWeekly,
      nutrition_assistWithFeedingEveryVisit,
      nutrition_assistWithFeedingWeekly,
      nutrition_limitFluid,
      nutrition_encourageFluid,
      nutrition_fluidEveryVisit,
      nutrition_fluidWeekly,
      nutrition_groceryShoppingEveryVisit,
      nutrition_groceryShoppingWeekly,
      nutrition_otherEveryVisit,
      nutrition_otherWeekly,
      nutrition_otherInfo,
      other_laundryEveryVisit,
      other_laundryWeekly,
      other_bedroomKeeping,
      other_bathroomKeeping,
      other_kitchenKeeping,
      other_bedLinenKeeping,
      other_houseKeepingEveryVisit,
      other_houseKeepingWeekly,
      other_equipmentCareEveryVisit,
      other_equipmentCareWeekly,
      other_transportationEveryVisit,
      other_transportationWeekly,
      other_otherInfo,
      
      // ... include other fields as needed
    });

      // Check if phoneNumber is already in use
  // const existingContactNo = await Patient.findOne({ phoneNumber });
  // if (existingContactNo) {
  //   res.status(422).json({ error: "Contact Number already in use" });
  //   return;
  // }

    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Function to generate the patient code
const generatePatientCode = (patientName, address, zip) => {
  // Get initials of patient name
  const initials = patientName.split(' ').map(name => name[0]).join('').toUpperCase();

  // Get the first 4 characters of the address
  const addressInitials = address.replace(/\s+/g, '').slice(0, 4).toUpperCase();

  // Get the zipcode
  const zipcode = zip;

  // Concatenate the parts to form the code
  const code = `${initials}${addressInitials}${zipcode}`;
  
  return code;
};

// UPDATE a patient by ID
const updatePatientInfo = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Update the patient document with the new values from req.body
    for (const [key, value] of Object.entries(req.body)) {
      patient[key] = value;
    }

    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message });
  }
};

// Delete patient by ID
const deletePatient = asyncHandler(async (req, res) => {
  const patientId = req.params.id;

  const patient = await Patient.findById(patientId);

  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  await Patient.deleteOne({ _id: patientId });

  res.status(200).json({
    message: `Patient deleted successfully`,
  });
});

// Update fields of patient
// const updatePatientInfo = asyncHandler(async (req, res) => {
//   const { patientId } = req.params;
//   const {
//     name,
//     dob,
//     city,
//     state,
//     zip,
//     phoneNumber,
//     address,
//     relativeNameFirst,
//     relativeContactFirst,
//     relativeNameSecond,
//     relativeContactSecond,
//     caseMgrName,
//     caseMgrPhone,
//     caseMgrFax,
//     caseMgrEmail,
//     doctorName,
//     doctorPhone,
//     doctorFax,
//     daysNeeded,
//     timeSlots,
//     programs,
//     liveAlone,
//     liveWithOther,
//     aloneDuringDay,
//     bedBound,
//     bedRest,
//     upAsTolerated,
//     amputee,
//     amputeeInfo,
//     partialWeightBearing,
//     partialWeightBearingR,
//     partialWeightBearingL,
//     normalWeightBearing,
//     normalWeightBearingR,
//     normalWeightBearingL,
//     fallPrecautions,
//     speechDeficit,
//     visionDeficit,
//     glasses,
//     contacts,
//     visionOther,
//     hearingDeficit,
//     hearingAid,
//     dentures,
//     upper,
//     lower,
//     partial,
//     forgetfull,
//     urinaryCatheter,
//     prosthesis,
//     prosthesisInfo,
//     allergies,
//     allergiesInfo,
//     diabetic,
//     doNotCutNails,
//     diet,
//     dietInfo,
//     seizurePrecaution,
//     proneToFactures,
//     precautionOther,
//     bath_tubShowerEveryVisit,
//     bath_tubShowerWeekly,
//     bath_bedBathPartial,
//     bath_bedBathComplete,
//     bath_bedBathEveryVisit,
//     bath_bedBathWeekly,
//     bath_assistBathChairEveryVisit,
//     bath_assistBathChairWeekly,
//     bathOtherInfo,
//     personalCareEveryVisit,
//     personalCareWeekly,
//     personalCare_assistWithDressingEveryVisit,
//     personalCare_assistWithDressingWeekly,
//     personalCare_groomHairEveryVisit,
//     personalCare_groomHairWeekly,
//     personalCare_shampooEveryVisit,
//     personalCare_shampooWeekly,
//     personalCare_skinCareEveryVisit,
//     personalCare_skinCareWeekly,
//     personalCare_teethCareEveryVisit,
//     personalCare_teethCareWeekly,
//     personalCare_otherEveryVisit,
//     personalCare_otherWeekly,
//     personalCare_otherInfo,
//     procedures_toiletingAssistEveryVisit,
//     procedures_toiletingAssistWeekly,
//     procedures_catheterCareEveryVisit,
//     procedures_catheterCareWeekly,
//     procedures_ostomyCareEveryVisit,
//     procedures_ostomyCareWeekly,
//     procedures_medicationReminderEveryVisit,
//     procedures_medicationReminderWeekly,
//     procedures_otherEveryVisit,
//     procedures_otherWeekly,
//     procedures_otherInfo,
//     activity_assistWithAmbulation,
//     activity_assistWithWheelChair,
//     activity_assistWithWalker,
//     activity_assistWithCane,
//     activity_assistWithEveryVisit,
//     activity_assistWithWeekly,
//     activity_mobilityAssistChair,
//     activity_mobilityAssistBed,
//     activity_mobilityAssistShower,
//     activity_mobilityAssistTub,
//     activity_mobilityAssistEveryVisit,
//     activity_mobilityAssistWeekly,
//     activity_exercisePerPTOT,
//     activity_exercisePerCarePlan,
//     activity_exerciseEveryVisit,
//     activity_exerciseWeekly,
//     activity_otherEveryVisit,
//     activity_otherWeekly,
//     activity_otherInfo,
//     nutrition_mealPreparationEveryVisit,
//     nutrition_mealPreparationWeekly,
//     nutrition_assistWithFeedingEveryVisit,
//     nutrition_assistWithFeedingWeekly,
//     nutrition_limitFluid,
//     nutrition_encourageFluid,
//     nutrition_fluidEveryVisit,
//     nutrition_fluidWeekly,
//     nutrition_groceryShoppingEveryVisit,
//     nutrition_groceryShoppingWeekly,
//     nutrition_otherEveryVisit,
//     nutrition_otherWeekly,
//     nutrition_otherInfo,
//     other_laundryEveryVisit,
//     other_laundryWeekly,
//     other_bedroomKeeping,
//     other_bathroomKeeping,
//     other_kitchenKeeping,
//     other_bedLinenKeeping,
//     other_houseKeepingEveryVisit,
//     other_houseKeepingWeekly,
//     other_equipmentCareEveryVisit,
//     other_equipmentCareWeekly,
//     other_transportationEveryVisit,
//     other_transportationWeekly,
//     other_otherInfo,
//   } = req.body;

//   console.log(req.body);

//   const patient = await Patient.findById(patientId);

//   if (!patient) {
//     res.status(404);
//     throw new Error("Patient or Units not found");
//   }

//   patient.patient_name = name;
//   patient.dob = dob;
//   patient.city = city;
//   patient.state = state;
//   patient.zip = zip;
//   patient.phoneNumber = phoneNumber;
//   patient.address = address;
//   patient.relativeNameFirst = relativeNameFirst;
//   patient.relativeContactFirst = relativeContactFirst;
//   patient.relativeNameSecond = relativeNameSecond ? relativeNameSecond : "NA";
//   patient.relativeContactSecond = relativeContactSecond
//     ? relativeContactSecond
//     : "NA";
//   patient.caseMgrName = caseMgrName;
//   patient.caseMgrEmail = caseMgrEmail;
//   patient.caseMgrPhone = caseMgrPhone;
//   patient.caseMgrFax = caseMgrFax;
//   patient.doctorName = doctorName;
//   patient.doctorPhone = doctorPhone;
//   patient.doctorFax = doctorFax;
//   patient.daysNeeded = daysNeeded;
//   patient.timeSlots = timeSlots;
//   patient.programs = programs;
//   patient.liveAlone = liveAlone;
//   patient.liveWithOther = liveWithOther;
//   patient.aloneDuringDay = aloneDuringDay;
//   patient.bedBound = bedBound;
//   patient.bedRest = bedRest;
//   patient.upAsTolerated = upAsTolerated;
//   patient.amputee = amputee;
//   patient.amputeeInfo = amputeeInfo;
//   patient.partialWeightBearing = partialWeightBearing;
//   patient.partialWeightBearingR = partialWeightBearingR;
//   patient.partialWeightBearingL = partialWeightBearingL;
//   patient.normalWeightBearing = normalWeightBearing;
//   patient.normalWeightBearingR = normalWeightBearingR;
//   patient.normalWeightBearingL = normalWeightBearingL;
//   patient.fallPrecautions = fallPrecautions;
//   patient.speechDeficit = speechDeficit;
//   patient.visionDeficit = visionDeficit;
//   patient.glasses = glasses;
//   patient.contacts = contacts;
//   patient.visionOther = visionOther;
//   patient.hearingDeficit = hearingDeficit;
//   patient.hearingAid = hearingAid;
//   patient.dentures = dentures;
//   patient.upper = upper;
//   patient.lower = lower;
//   patient.partial = partial;
//   patient.forgetfull = forgetfull;
//   patient.urinaryCatheter = urinaryCatheter;
//   patient.prosthesis = prosthesis;
//   patient.prosthesisInfo = prosthesisInfo;
//   patient.allergies = allergies;
//   patient.allergiesInfo = allergiesInfo;
//   patient.diabetic = diabetic;
//   patient.doNotCutNails = doNotCutNails;
//   patient.diet = diet;
//   patient.dietInfo = dietInfo;
//   patient.seizurePrecaution = seizurePrecaution;
//   patient.proneToFactures = proneToFactures;
//   patient.precautionOther = precautionOther;
//   patient.bath_tubShowerEveryVisit = bath_tubShowerEveryVisit;
//   patient.bath_tubShowerWeekly = bath_tubShowerWeekly;
//   patient.bath_bedBathPartial = bath_bedBathPartial;
//   patient.bath_bedBathComplete = bath_bedBathComplete;
//   patient.bath_bedBathEveryVisit = bath_bedBathEveryVisit;
//   patient.bath_bedBathWeekly = bath_bedBathWeekly;
//   patient.bath_assistBathChairEveryVisit = bath_assistBathChairEveryVisit;
//   patient.bath_assistBathChairWeekly = bath_assistBathChairWeekly;
//   patient.bathOtherInfo = bathOtherInfo;
//   patient.personalCareEveryVisit = personalCareEveryVisit;
//   patient.personalCareWeekly = personalCareWeekly;
//   patient.personalCare_assistWithDressingEveryVisit =
//     personalCare_assistWithDressingEveryVisit;
//   patient.personalCare_assistWithDressingWeekly =
//     personalCare_assistWithDressingWeekly;
//   patient.personalCare_groomHairEveryVisit = personalCare_groomHairEveryVisit;
//   patient.personalCare_groomHairWeekly = personalCare_groomHairWeekly;
//   patient.personalCare_shampooEveryVisit = personalCare_shampooEveryVisit;
//   patient.personalCare_shampooWeekly = personalCare_shampooWeekly;
//   patient.personalCare_skinCareEveryVisit = personalCare_skinCareEveryVisit;
//   patient.personalCare_skinCareWeekly = personalCare_skinCareWeekly;
//   patient.personalCare_teethCareEveryVisit = personalCare_teethCareEveryVisit;
//   patient.personalCare_teethCareWeekly = personalCare_teethCareWeekly;
//   patient.personalCare_otherEveryVisit = personalCare_otherEveryVisit;
//   patient.personalCare_otherWeekly = personalCare_otherWeekly;
//   patient.personalCare_otherInfo = personalCare_otherInfo;
//   patient.procedures_toiletingAssistEveryVisit =
//     procedures_toiletingAssistEveryVisit;
//   patient.procedures_toiletingAssistWeekly = procedures_toiletingAssistWeekly;
//   patient.procedures_catheterCareEveryVisit = procedures_catheterCareEveryVisit;
//   patient.procedures_catheterCareWeekly = procedures_catheterCareWeekly;
//   patient.procedures_ostomyCareEveryVisit = procedures_ostomyCareEveryVisit;
//   patient.procedures_ostomyCareWeekly = procedures_ostomyCareWeekly;
//   patient.procedures_medicationReminderEveryVisit =
//     procedures_medicationReminderEveryVisit;
//   patient.procedures_medicationReminderWeekly =
//     procedures_medicationReminderWeekly;
//   patient.procedures_otherEveryVisit = procedures_otherEveryVisit;
//   patient.procedures_otherWeekly = procedures_otherWeekly;
//   patient.procedures_otherInfo = procedures_otherInfo;
//   patient.activity_assistWithAmbulation = activity_assistWithAmbulation;
//   patient.activity_assistWithWheelChair = activity_assistWithWheelChair;
//   patient.activity_assistWithWalker = activity_assistWithWalker;
//   patient.activity_assistWithCane = activity_assistWithCane;
//   patient.activity_assistWithEveryVisit = activity_assistWithEveryVisit;
//   patient.activity_assistWithWeekly = activity_assistWithWeekly;
//   patient.activity_mobilityAssistChair = activity_mobilityAssistChair;
//   patient.activity_mobilityAssistBed = activity_mobilityAssistBed;
//   patient.activity_mobilityAssistShower = activity_mobilityAssistShower;
//   patient.activity_mobilityAssistTub = activity_mobilityAssistTub;
//   patient.activity_mobilityAssistEveryVisit = activity_mobilityAssistEveryVisit;
//   patient.activity_mobilityAssistWeekly = activity_mobilityAssistWeekly;
//   patient.activity_exercisePerPTOT = activity_exercisePerPTOT;
//   patient.activity_exercisePerCarePlan = activity_exercisePerCarePlan;
//   patient.activity_exerciseEveryVisit = activity_exerciseEveryVisit;
//   patient.activity_exerciseWeekly = activity_exerciseWeekly;
//   patient.activity_otherEveryVisit = activity_otherEveryVisit;
//   patient.activity_otherWeekly = activity_otherWeekly;
//   patient.activity_otherInfo = activity_otherInfo;
//   patient.nutrition_mealPreparationEveryVisit =
//     nutrition_mealPreparationEveryVisit;
//   patient.nutrition_mealPreparationWeekly = nutrition_mealPreparationWeekly;
//   patient.nutrition_assistWithFeedingEveryVisit =
//     nutrition_assistWithFeedingEveryVisit;
//   patient.nutrition_assistWithFeedingWeekly = nutrition_assistWithFeedingWeekly;
//   patient.nutrition_limitFluid = nutrition_limitFluid;
//   patient.nutrition_encourageFluid = nutrition_encourageFluid;
//   patient.nutrition_fluidEveryVisit = nutrition_fluidEveryVisit;
//   patient.nutrition_fluidWeekly = nutrition_fluidWeekly;
//   patient.nutrition_groceryShoppingEveryVisit =
//     nutrition_groceryShoppingEveryVisit;
//   patient.nutrition_groceryShoppingWeekly = nutrition_groceryShoppingWeekly;
//   patient.nutrition_otherEveryVisit = nutrition_otherEveryVisit;
//   patient.nutrition_otherWeekly = nutrition_otherWeekly;
//   patient.nutrition_otherInfo = nutrition_otherInfo;
//   patient.other_laundryEveryVisit = other_laundryEveryVisit;
//   patient.other_laundryWeekly = other_laundryWeekly;
//   patient.other_bedroomKeeping = other_bedroomKeeping;
//   patient.other_bathroomKeeping = other_bathroomKeeping;
//   patient.other_kitchenKeeping = other_kitchenKeeping;
//   patient.other_bedLinenKeeping = other_bedLinenKeeping;
//   patient.other_houseKeepingEveryVisit = other_houseKeepingEveryVisit;
//   patient.other_houseKeepingWeekly = other_houseKeepingWeekly;
//   patient.other_equipmentCareEveryVisit = other_equipmentCareEveryVisit;
//   patient.other_equipmentCareWeekly = other_equipmentCareWeekly;
//   patient.other_transportationEveryVisit = other_transportationEveryVisit;
//   patient.other_transportationWeekly = other_transportationWeekly;
//   patient.other_otherInfo = other_otherInfo;

//   await patient.save();

//   res.status(200).json({
//     message: `Patient data updated successfully`,
//     patient: patient,
//   });
// });

module.exports = {
  getPatients,
  createPatient,
  deletePatient,
  getPatientById,
  updatePatientInfo,
};
