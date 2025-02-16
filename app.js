const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const assetRoutes = require('./routes/assetRoutes');
const cron = require('node-cron');
const { sendMaintenanceReminders } = require('./controllers/maintenanceController');
const path = require('path');
const hbs = require('express-handlebars');
const Handlebars = require('handlebars');

dotenv.config();
const app = express();

//Set view engine
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const handlebars = hbs.create({
  helpers: {
    // Equality check helper
    eq: (a, b) => a === b,

    // Date formatting helper
    formatDate: (date) => {
      const d = new Date(date);
      return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    },

    // Uppercase string helper
    uppercase: (str) => str.toUpperCase(),

    // Conditional check: if a value is greater than another
    gt: (a, b) => a > b,

    // Greater than or equal check
    gte: (a, b) => a >= b,

    // JSON stringifying helper
    json: (context) => JSON.stringify(context),

    // Capitalize first letter
    capitalizeFirst: (str) => {
      if (typeof str !== 'string' || str.length === 0) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  },
  extname: '.hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(pageRoutes);
app.use('/api', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// Setup Cron schedule - Run every day at 9 AM
cron.schedule('0 9 * * *', () => {
    console.log('Checking for maintenance...');
    sendMaintenanceReminders();
});


app.listen(3000, () => console.log('Server running on port 3000'));