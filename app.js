const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const assetRoutes = require('./routes/assetRoutes');
const cron = require('node-cron');
const { sendMaintenanceReminders } = require('./controllers/maintenanceController');

dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 3600000 } 
}));

// Run every day at 9 AM
cron.schedule('0 9 * * *', () => {
    console.log('Checking for maintenance...');
    sendMaintenanceReminders();
});

app.use('/api/assets', assetRoutes);

app.use('/api/inventory', inventoryRoutes);
app.use('/api', authRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.listen(3000, () => console.log('Server running on port 3000'));
