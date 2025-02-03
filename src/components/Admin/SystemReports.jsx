// src/components/Admin/SystemReports.jsx
import { Typography, Paper } from "@mui/material";

const SystemReports = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        System-wide Reports
      </Typography>
      <Typography variant="body1">
        View and analyze system-wide reports, user activity, and financial insights.
      </Typography>
      {/* You can add charts, tables, or graphs here */}
    </Paper>
  );
};

export default SystemReports; 
