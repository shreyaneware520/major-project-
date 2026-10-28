# Smart Farming Platform

## Project Overview

Smart Farming Platform is a web-based application designed to help farmers and greenhouse operators monitor, manage, and optimize farming activities through a centralized dashboard.

The platform allows users to monitor grow rooms, control farming equipment, receive alerts, analyze reports, and manage account settings from a single interface.

The main goal of this project is to improve productivity, reduce manual effort, and provide better visibility into farming operations.

---

## Technology Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM

### Development Tools

- Visual Studio Code
- Git
- GitHub

---

## Project Structure

```text
smart-farming-platform/
│
├── frontend/
│
│   ├── public/
│   │
│   ├── src/
│   │
│   │   ├── assets/
│   │
│   │   ├── components/
│   │   │   ├── Alerts/
│   │   │   ├── Controls/
│   │   │   ├── Dashboard/
│   │   │   ├── GrowRooms/
│   │   │   ├── Landing/
│   │   │   ├── Login/
│   │   │   ├── Profile/
│   │   │   ├── ReportHistory/
│   │   │   ├── RoomDetails/
│   │   │   ├── Settings/
│   │   │   └── SignUp/
│   │
│   │   ├── pages/
│   │   │   ├── Alerts/
│   │   │   ├── Controls/
│   │   │   ├── Dashboard/
│   │   │   ├── GrowRooms/
│   │   │   ├── Landing/
│   │   │   ├── Login/
│   │   │   ├── Profile/
│   │   │   ├── ReportHistory/
│   │   │   ├── RoomDetails/
│   │   │   ├── Settings/
│   │   │   └── SignUp/
│   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
└── .gitignore
```

---

## Features

### Landing Page

The landing page introduces users to the Smart Farming Platform and provides an overview of the system.

Features:

- Introduction section
- Platform information
- Feature highlights
- Navigation to authentication pages

---

### Authentication

The platform includes a basic authentication system.

Features:

- User Login
- User Registration
- Form Validation

---

### Dashboard

The dashboard provides a summary of farming activities and system status.

Features:

- Farm overview
- Statistics summary
- Quick actions
- Recent activity information

---

### Grow Rooms

This module allows users to manage and monitor grow rooms.

Features:

- View available grow rooms
- Monitor room status
- Access room information

---

### Room Details

Provides detailed information about a selected grow room.

Features:

- Temperature monitoring
- Humidity monitoring
- Soil moisture monitoring
- Equipment status

---

### Controls

Allows users to manage connected devices.

Features:

- Irrigation control
- Lighting control
- Fan control
- Device management

---

### Alerts

Displays important notifications related to farming operations.

Features:

- Temperature alerts
- Moisture alerts
- Device alerts
- System warnings

---

### Reports and History

Provides historical data and performance tracking.

Features:

- Activity history
- Reports
- Data analysis
- Performance monitoring

---

### Profile

Allows users to manage personal information.

Features:

- Update profile information
- Change account details
- Manage user preferences

---

### Settings

Allows customization of application preferences.

Features:

- Notification settings
- Application preferences
- Account settings

---

## Application Routes

| Route | Description |
|---------|-------------|
| / | Landing Page |
| /login | Login Page |
| /signup | Sign Up Page |
| /dashboard | Dashboard Page |
| /grow-rooms | Grow Rooms Page |
| /room/:id | Room Details Page |
| /controls | Controls Page |
| /alerts | Alerts Page |
| /reports | Reports and History Page |
| /profile | Profile Page |
| /settings | Settings Page |

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/ritiksawarkar/smart-farming-platform.git
```

### Navigate to Project Directory

```bash
cd smart-farming-platform/frontend
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Development Status

| Module | Status |
|----------|----------|
| Project Setup | Completed |
| Vite Configuration | Completed |
| Folder Structure | Completed |
| Routing Setup | In Progress |
| UI Development | In Progress |
| Component Development | In Progress |
| Backend Integration | Pending |
| API Integration | Pending |
| Testing | Pending |
| Deployment | Pending |

---

## Future Enhancements

Future improvements may include:

- IoT sensor integration
- Real-time monitoring
- Weather integration
- Smart irrigation automation
- AI-based recommendations
- Mobile application support
- Data analytics dashboard
- Multi-user access control

---

## Author

Ritik Uttam Sawarkar

Jhulelal Institute of Technology, Nagpur

---

## License

This project is developed for educational and learning purposes.