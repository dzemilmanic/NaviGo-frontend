# 🚚 NaviGo Frontend

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**NaviGo Frontend** is a modern **React-based client application** for the **Digital Logistics & Transportation Platform**.  
It provides intuitive dashboards and tools for **transport companies, freight forwarders, and clients**, enabling them to manage routes, shipments, and contracts with real-time interaction.

---

## ✨ Key Features

### 🎯 **Technical Features**
- 🚀 **Modern React 19 + Vite setup** with vanilla CSS styling
- 🔐 **Secure authentication** with Google OAuth integration
- 🎨 **Responsive design** adapted for all devices
- ⚡ **Optimized performance** with lazy loading and code splitting
- 🔔 **Real-time notifications** for enhanced user experience

### 👥 **Role-based Dashboards**
- **🚛 Transport Companies** – fleet management, routes, and shipment tracking
- **🏢 Freight Forwarders** – offer negotiation, contract management, and delivery monitoring
- **👤 Clients** – transport booking, shipment tracking, and reservation management

### 🛠 **Advanced Functionalities**
- **📊 Interactive dashboards** with Chart.js visualizations
- **🗺️ Interactive maps** with Leaflet integration for route tracking
- **📄 PDF contract export** using jsPDF library
- **🔄 Real-time sync** with backend APIs
- **🎯 Service-oriented architecture** with modular services

---

## 🏗️ Business Domain

**NaviGo frontend** reflects the platform's business logic, providing tailored views and workflows for three main user groups:

### 🚛 **Transport Companies**
- ✅ Manage vehicles, drivers, and service schedules
- ✅ Define routes and pricing models
- ✅ Handle incidents (breakdowns, route rerouting)
- ✅ Automatically apply penalties for delivery delays
- ✅ Performance and profitability analytics

### 🏢 **Freight Forwarders**
- ✅ Browse available routes and vehicles from different companies
- ✅ Negotiate commissions and discounts with clients
- ✅ Track contract and shipment statuses
- ✅ Ensure compliance with pricing and priority rules
- ✅ Client portfolio management

### 👤 **Clients**
- ✅ Search and filter transport offers by route, cargo type, date, and price
- ✅ Reserve transport services with defined deadlines and penalties
- ✅ Upload payment proofs (invoices/receipts)
- ✅ Manage pickup times and reservations
- ✅ Real-time shipment status tracking

---

## 💻 Technology Stack

### **🎨 Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | v19 | Main frontend library |
| **Vite** | Latest | Build tool and dev server |
| **React Router** | v7 | Client-side routing |
| **Vanilla CSS** | - | Component styling |

### **🔐 Authentication & Security**
| Technology | Purpose |
|------------|---------|
| **Google OAuth** | Social login |
| **JWT** | Token-based authentication |

### **📊 Visualization & UX**
| Library | Purpose |
|---------|---------|
| **Chart.js + React Chart.js 2** | Statistics and charts |
| **Leaflet + React Leaflet** | Interactive maps |
| **React Toastify** | Toast notifications |
| **Lucide React** | Modern iconography |
| **jsPDF** | PDF generation |

---

## 🌍 Environment Variables

The application requires the following environment variables (`.env` file in root directory):

```env
# 🔗 API Configuration
VITE_API_URL=https://navigoapi-fgguf3fkh6b4fqg3.italynorth-01.azurewebsites.net/api

# 🔐 Authentication
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# 🤖 AI Integration
VITE_AI_API_KEY=your-ai-api-key

# 🗺️ Maps & Geolocation  
VITE_MAP_API_KEY=your-map-api-key
```

> **💡 Note:** Replace placeholder values with your actual API keys.

---

## 📂 Project Structure

```
navigo-frontend/
├── 📁 public/                    # Static assets
├── 📁 src/
│   ├── 📁 assets/                # Images and media files
│   ├── 📁 components/            # Shared UI components
│   ├── 📁 pages/                 # Application pages
│   ├── 📁 contexts/              # React Context API
│   ├── 📁 services/              # API services
│   ├── 📁 utils/                 # Helper functions
│   ├── App.jsx                   # Main component
│   └── main.jsx                  # Application entry point
├── 📄 .env                       # Environment variables
├── 📄 package.json               # Dependencies & scripts
├── 📄 vite.config.js             # Vite configuration
├── 📄 .gitignore                 # Git ignore file
└── 📄 README.md                  # Documentation
```

---

## 🚀 Quick Start

### **📋 Prerequisites**
- **Node.js** v18+ 
- **npm** or **yarn**
- **Git**

### **⚡ Installation**

1. **Clone repository:**
```bash
git clone https://github.com/dzemilmanic/NaviGo-frontend.git
cd navigo-frontend
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Setup environment variables:**
```bash
cp .env
# Edit .env file with your API keys
```

4. **Start development server:**
```bash
npm run dev
# or
yarn dev
```

5. **Open application:**
```
http://localhost:5173
```

### **🏗️ Build for production**
```bash
npm run build
npm run preview  # Preview production build
```

---

## 📝 Key Functionalities

### **🎛️ Dashboard System**
- **📊 Analytics dashboards** with real-time data
- **📈 Performance statistics** (cargo flow, delays, discounts, revenue)
- **🔍 Advanced filters** for search and sorting
- **📱 Responsive design** for all devices

### **🗺️ Mapping & Tracking**
- **Real-time vehicle tracking** with GPS coordinates
- **📍 Interactive routes** with Leaflet maps
- **🛣️ Route optimization** for efficient delivery
- **📊 Geolocation analytics** for traffic and routes

### **📄 Document Management**
- **📋 PDF contract generation** with jsPDF
- **📧 Email integration** for document sending
- **📂 File upload and management**
- **🔒 Secure document storage**

### **🔔 Notifications & Communication**
- **Real-time notifications** for important events
- **📧 Email alerts** for status changes
- **💬 In-app messaging** system
- **⚠️ Error handling** with user-friendly messages

---

## 🔧 Available Scripts

```bash
# 🚀 Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit your changes:** `git commit -m 'Add amazing feature'`
4. **Push to the branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **📋 Development Guidelines**
- Use **ESLint** and **Prettier** for code formatting
- Write **unit tests** for new features
- Follow **conventional commits** format
- Update documentation when needed

---

## 🐛 Bug Reports & Feature Requests

Use [GitHub Issues](https://github.com/IlhanBasic/navigo-frontend/issues) for:
- 🐛 **Bug reports**
- 💡 **Feature requests**
- ❓ **Code questions**
- 📚 **Documentation improvements**

---

## 📚 Documentation

- 📖 **API Documentation**
- 🎨 **UI/UX Guidelines**
- 🔧 **Development Setup**
- 🚀 **Deployment Guide**

---

## ⚖️ License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- **React Team** for the excellent library
- **Vite** for fast build tools
- **Chart.js** for visualizations
- **Leaflet** for map integration
- **All contributors** who contributed to the project

---


## 🚀 **NaviGo Frontend – Logistics Management Platform**

**© 2025 NaviGo Team. All rights reserved.**

[![GitHub](https://img.shields.io/badge/GitHub-NaviGo-black.svg)](https://github.com/IlhanBasic/navigo-frontend)
[![Website](https://img.shields.io/badge/Website-NaviGo.com-blue.svg)](https://navigo.com)

*Built with ❤️ for the logistics industry by Dzemil & Ilhan*