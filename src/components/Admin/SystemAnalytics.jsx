import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as ChartTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    LineChart,
    Line
} from 'recharts';
import { Box, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const SystemAnalytics = ({ 
    data: { 
      userGrowth = [], 
      budgetDistribution = [], 
      storageUsage = [] 
    } = {} 
  }) => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 300 }}>
            <Typography variant="subtitle1" gutterBottom>User Growth</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip />
                <Line type="monotone" dataKey="users" stroke="#1ABB9C" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
  
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 300 }}>
            <Typography variant="subtitle1" gutterBottom>Budget Status Distribution</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#2A3F54"
                />
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
  
        <Grid item xs={12}>
          <Box sx={{ height: 400 }}>
            <Typography variant="subtitle1" gutterBottom>Storage Usage</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storageUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="usage" fill="#1ABB9C" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    );
  };
  
  SystemAnalytics.propTypes = {
    data: PropTypes.shape({
      userGrowth: PropTypes.arrayOf(
        PropTypes.shape({
          month: PropTypes.string.isRequired,
          users: PropTypes.number.isRequired,
        })
      ),
      budgetDistribution: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          value: PropTypes.number.isRequired,
        })
      ),
      storageUsage: PropTypes.arrayOf(
        PropTypes.shape({
          department: PropTypes.string.isRequired,
          usage: PropTypes.number.isRequired,
        })
      ),
    }),
  };
  
  export default SystemAnalytics;
  
