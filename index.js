const express = require("express");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const swaggerUI = require('swagger-ui-express');
const generateSwaggerSpec = require('./swaggerOptions');

connectDb();
const app = express();
const port = process.env.PORT || 9000;
const { swaggerSpec } = generateSwaggerSpec(app);

app.use(cors());
app.use(express.json());
app.use("/api/admin", require("./routes/AdminRoutes.js"))
app.use("/api/locations", require("./routes/LocationRoutes"));
app.use("/api/units", require("./routes/UnitRoutes"));
app.use("/api/programs", require("./routes/ProgramRoutes"));
app.use("/api/timeSlots", require("./routes/TimeSlotRoutes"));
app.use("/api/employee", require("./routes/EmployeeRoutes"));
app.use("/api/patients", require("./routes/PatientRoutes"));
app.use("/api/assign", require("./routes/AssignRoutes"));
app.use("/api/companies", require("./routes/CompanyRoutes"));

//common forms
app.use("/api/schedule-hha", require("./routes/CommonFormsRoutes/ScheduleHHARoutes.js"));
app.use("/api/incident-hha", require("./routes/CommonFormsRoutes/IncidentFormHHARoutes.js"));
app.use("/api/missed-visit-hha", require("./routes/CommonFormsRoutes/MissedVisitHHARoutes.js"));
app.use("/api/daily-time-sheet", require("./routes/CommonFormsRoutes/DailyTimeSheetHHARoutes.js"));

// nurse form routes 
app.use("/api/confidential-info-nurse-form", require('./routes/NurseFormsRoutes/ConfidentialInfoRoutes.js'))
app.use("/api/noticeOfLimitOfScope", require('./routes/NurseFormsRoutes/NoticeOfLimitOfScope.js'))
app.use("/api/clientbillrights", require('./routes/NurseFormsRoutes/ClientBillOfRightsRoutes.js'))
app.use("/api/patientprior", require('./routes/NurseFormsRoutes/PatientPrioritizationRoutes.js'))
app.use("/api/policies", require('./routes/NurseFormsRoutes/PolicyOnConfidentialityRoutes.js'))
app.use('/api/privacy-practices-receipt',require('./routes/NurseFormsRoutes/RecieptOfNoticeRoutes.js'))
// Serve Swagger UI
app.use('/api', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});