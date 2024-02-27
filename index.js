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
app.use("/api/locations", require("./routes/LocationRoutes"));
app.use("/api/units", require("./routes/UnitRoutes"));
app.use("/api/programs", require("./routes/ProgramRoutes"));
app.use("/api/timeSlots", require("./routes/TimeSlotRoutes"));
app.use("/api/employee", require("./routes/EmployeeRoutes"));
app.use("/api/patients", require("./routes/PatientRoutes"));
app.use("/api/assign", require("./routes/AssignRoutes"));
app.use("/api/schedule-hha", require("./routes/ScheduleHHARoutes"));
app.use("/api/incident-hha", require("./routes//IncidentFormHHARoutes"));
app.use("/api/missed-visit-hha", require("./routes/MissedVisitHHARoutes"));
app.use("/api/daily-time-sheet", require("./routes/DailyTimeSheetHHARoutes"));

// Serve Swagger UI
app.use('/api', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});