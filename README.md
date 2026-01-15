# 🚗 Car Loan Calculator | เครื่องคำนวณค่าใช้จ่ายรถยนต์

A comprehensive car loan and expense calculator built with React. Calculate monthly payments, interest, insurance, and all car-related expenses in one place.

เครื่องคำนวณค่าใช้จ่ายรถยนต์แบบครบวงจร - คำนวณค่างวด ดอกเบี้ย ประกัน และค่าใช้จ่ายทั้งหมดในที่เดียว

![Car Loan Calculator](https://img.shields.io/badge/React-18.2-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-purple?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features | ฟีเจอร์

### 💰 Loan Calculation | คำนวณสินเชื่อ
- Car price input | ราคารถ
- Down payment (% or fixed amount) | เงินดาวน์ (% หรือจำนวนบาท)
- Loan term (12-84 months) | ระยะเวลาผ่อน (12-84 เดือน)
- Interest rate with slider | อัตราดอกเบี้ย พร้อม slider

### 📊 Expense Tracking | ติดตามค่าใช้จ่าย
- Insurance (Class 1) | ประกันภัยชั้น 1
- Compulsory insurance (พ.ร.บ.)
- Road tax | ภาษีรถประจำปี
- Maintenance | ค่าบำรุงรักษา
- Fuel costs | ค่าน้ำมัน

### 📋 Reports | รายงาน
- Monthly payment breakdown | รายละเอียดค่าใช้จ่ายรายเดือน
- Payment schedule table | ตารางผ่อนชำระ
- Yearly summary | สรุปรายปี
- Total cost comparison | เปรียบเทียบค่าใช้จ่ายทั้งหมด

### 🔗 Sharing | การแชร์
- **URL State Sync** - Form data is synced to URL parameters
- **Share Link** - Copy shareable link with all calculations
- **Native Share** - Mobile share sheet support
- **Export PDF** - Print or save as PDF

## 🚀 Quick Start | เริ่มต้นใช้งาน

### Prerequisites | สิ่งที่ต้องมี
- Node.js 18+
- npm or yarn

### Installation | การติดตั้ง

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/car-loan-calculator.git

# Navigate to project directory
cd car-loan-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production | Build สำหรับ Production

```bash
npm run build
```

## 📝 URL Parameters | พารามิเตอร์ URL

Share your calculations by using URL parameters:

| Parameter | Description | ค่าเริ่มต้น |
|-----------|-------------|-------------|
| `price` | Car price | 1,000,000 |
| `dpType` | Down payment type (percent/baht) | percent |
| `dpValue` | Down payment value | 20 |
| `term` | Loan term (months) | 60 |
| `rate` | Interest rate (%) | 3.5 |
| `insurance` | Insurance per year | 25,000 |
| `act` | Compulsory insurance | 650 |
| `tax` | Road tax | 1,600 |
| `maintenance` | Maintenance per year | 6,000 |
| `fuel` | Fuel per month | 3,000 |

### Example URL
```
https://your-site.com/?price=1500000&dpValue=25&term=72&rate=2.99
```

## 🧮 Calculation Method | วิธีการคำนวณ

This calculator uses the **Flat Rate** interest calculation method, which is commonly used in Thailand for car loans.

```
Total Interest = Principal × (Interest Rate / 100) × Years
Monthly Payment = (Principal + Total Interest) / Number of Months
```

## 🎨 Tech Stack | เทคโนโลยี

- **React 18** - UI Library
- **Vite** - Build Tool
- **CSS-in-JS** - Styling
- **IBM Plex Sans Thai** - Typography
- **JetBrains Mono** - Monospace Font

## 📱 Responsive Design

The calculator is fully responsive and works on:
- 📱 Mobile devices
- 📱 Tablets
- 💻 Desktop computers

## 🖨️ Print Support

Export your calculations to PDF with print-optimized styles:
- Clean black & white layout
- Preserved data formatting
- Page break handling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ for car buyers in Thailand
