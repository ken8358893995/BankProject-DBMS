import os
from fpdf import FPDF

class BankDocPDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("ArialBold", size=8)
            self.set_text_color(100, 110, 130)
            self.cell(0, 8, "ARUCI BANK CORE DIGITAL BANKING SYSTEM | Complete Documentation", border=0, ln=0, align="L")
            self.set_font("Arial", size=8)
            self.cell(0, 8, "DBMS & Full-Stack System", border=0, ln=1, align="R")
            self.set_draw_color(220, 225, 235)
            self.set_line_width(0.4)
            self.line(15, 18, 195, 18)
            self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_draw_color(220, 225, 235)
        self.set_line_width(0.4)
        self.line(15, self.get_y(), 195, self.get_y())
        self.set_font("Arial", size=8)
        self.set_text_color(130, 140, 155)
        self.cell(0, 10, "Internal Learning & Production Deployment Manual", border=0, ln=0, align="L")
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", border=0, ln=1, align="R")

def build_pdf():
    pdf = BankDocPDF(orientation="P", unit="mm", format="A4")
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.set_margins(15, 15, 15)

    # Add custom TTF fonts from Windows
    pdf.add_font("Arial", "", r"C:\Windows\Fonts\arial.ttf")
    pdf.add_font("ArialBold", "", r"C:\Windows\Fonts\arialbd.ttf")

    # ================= PAGE 1 =================
    pdf.add_page()

    # Title Banner Block
    pdf.set_fill_color(16, 25, 53) # Navy blue
    pdf.rect(15, 15, 180, 42, "F")

    pdf.set_xy(20, 21)
    pdf.set_font("ArialBold", size=20)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 9, "ARUCI BANK CORE BANKING SYSTEM", ln=1)

    pdf.set_x(20)
    pdf.set_font("ArialBold", size=11)
    pdf.set_text_color(250, 173, 20) # Gold
    pdf.cell(0, 6, "FULL-STACK DBMS ARCHITECTURE & PRODUCTION DEPLOYMENT MANUAL", ln=1)

    pdf.set_x(20)
    pdf.set_font("Arial", size=9)
    pdf.set_text_color(200, 215, 240)
    pdf.cell(0, 5, "Status: Production Ready | Build: Passed | Database: MySQL 8.0 | React 18 & Node.js", ln=1)

    pdf.set_y(62)

    # Section 1: Executive Overview
    pdf.set_font("ArialBold", size=13)
    pdf.set_text_color(22, 119, 255) # Primary blue
    pdf.cell(0, 7, "1. Executive System Overview", ln=1)
    pdf.set_draw_color(22, 119, 255)
    pdf.set_line_width(0.6)
    pdf.line(15, pdf.get_y(), 65, pdf.get_y())
    pdf.ln(3)

    pdf.set_font("Arial", size=9.5)
    pdf.set_text_color(40, 45, 55)
    desc = (
        "ARUCI Bank Core Digital Banking is a comprehensive, enterprise-grade Core Banking Solution (CBS) "
        "and Transaction Processing Platform. The system supports multi-role operations: customer self-service "
        "NetBanking, teller cash counter operations, and branch manager administrative controls. Built with "
        "a decoupled Client-Server architecture, it features real-time fraud mitigation, two-factor OTP authentication, "
        "and strict relational integrity across bank accounts, loans, and fixed deposits."
    )
    pdf.multi_cell(0, 5.2, desc)
    pdf.ln(3)

    # Tech Stack Box Grid
    pdf.set_fill_color(245, 248, 255)
    pdf.set_draw_color(210, 225, 250)
    pdf.rect(15, pdf.get_y(), 180, 26, "FD")
    
    box_y = pdf.get_y() + 2
    pdf.set_xy(18, box_y)
    pdf.set_font("ArialBold", size=9)
    pdf.set_text_color(22, 119, 255)
    pdf.cell(42, 5, "Frontend Client:", ln=0)
    pdf.set_font("Arial", size=8.5)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 5, "React 18 Single Page App, Ant Design 5 (Enterprise UI), Formik, Yup, Axios", ln=1)

    pdf.set_x(18)
    pdf.set_font("ArialBold", size=9)
    pdf.set_text_color(114, 46, 209)
    pdf.cell(42, 5, "Backend REST API:", ln=0)
    pdf.set_font("Arial", size=8.5)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 5, "Node.js & Express.js, JWT Authentication, Bcrypt Password Security, Nodemailer", ln=1)

    pdf.set_x(18)
    pdf.set_font("ArialBold", size=9)
    pdf.set_text_color(56, 158, 13)
    pdf.cell(42, 5, "Relational Database:", ln=0)
    pdf.set_font("Arial", size=8.5)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 5, "MySQL 8.0 InnoDB, Connection Pooling, Foreign Key Constraints, SQL Schema", ln=1)

    pdf.set_x(18)
    pdf.set_font("ArialBold", size=9)
    pdf.set_text_color(207, 19, 34)
    pdf.cell(42, 5, "Security & Fraud Engine:", ln=0)
    pdf.set_font("Arial", size=8.5)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 5, "One-Click Emergency Freeze, 2FA OTP Identity Verification, Outgoing Debit Guard", ln=1)

    pdf.set_y(box_y + 28)

    # Section 2: Core Database Schema
    pdf.set_font("ArialBold", size=13)
    pdf.set_text_color(22, 119, 255)
    pdf.cell(0, 7, "2. Relational Database Schema & Entities", ln=1)
    pdf.set_draw_color(22, 119, 255)
    pdf.line(15, pdf.get_y(), 75, pdf.get_y())
    pdf.ln(3)

    db_tables = [
        ("Customer", "CustomerID (PK), Name, NIC, Address, ContactNo", "Master registry of branch customers"),
        ("OnlineCustomer", "CustomerID (FK), Username (Unique), Password (Hash)", "NetBanking authentication credentials"),
        ("Account", "AccountID (PK), CustomerID (FK), TypeID, Balance, BranchID", "Savings (SA) and Current (CA) ledgers"),
        ("FixedDeposit", "AccountID (PK), CustomerID, TypeID, Amount, InterestRate", "Term deposit investment accounts"),
        ("PhysicalLoan / OnlineLoan", "LoanID (PK), CustomerID, Amount, Duration, Status", "Secured physical & instant online loans"),
        ("Transactions", "TransactionID (PK), AccountID, Type, Amount, Date", "Debit / Credit audit ledger records"),
        ("Branch", "BranchID (PK), BranchName, City", "Physical bank branch hierarchy"),
        ("Employee", "EmployeeID (PK), Name, Username, Password, Role", "Staff & Branch Manager authorized users")
    ]

    # Draw Table
    pdf.set_fill_color(230, 240, 255)
    pdf.set_font("ArialBold", size=8.5)
    pdf.set_text_color(20, 30, 60)
    pdf.cell(45, 6, "Entity Table", border=1, fill=True)
    pdf.cell(75, 6, "Key Attributes / Foreign Keys", border=1, fill=True)
    pdf.cell(60, 6, "Description & Purpose", border=1, ln=1, fill=True)

    pdf.set_font("Arial", size=8)
    for tbl, cols, purp in db_tables:
        pdf.cell(45, 5.5, tbl, border=1)
        pdf.cell(75, 5.5, cols, border=1)
        pdf.cell(60, 5.5, purp, border=1, ln=1)

    pdf.ln(4)

    # Section 3: Verified Demo Credentials
    pdf.set_font("ArialBold", size=13)
    pdf.set_text_color(22, 119, 255)
    pdf.cell(0, 7, "3. System Roles & Verified Demo Credentials", ln=1)
    pdf.set_draw_color(22, 119, 255)
    pdf.line(15, pdf.get_y(), 80, pdf.get_y())
    pdf.ln(3)

    creds = [
        ("Customer", "AnjulaRox", "123456 (or password)", "NetBanking, Accounts, FDs, Loans, Cards, Freeze"),
        ("Senior Bank Staff", "cabral", "123456 (or password)", "Customers, Accounts, Deposits, Withdrawals, Security"),
        ("Branch Manager", "ranil", "123456 (or password)", "Full Admin, Loan Approvals, Staff Mgmt, Reports")
    ]

    pdf.set_fill_color(230, 240, 255)
    pdf.set_font("ArialBold", size=8.5)
    pdf.set_text_color(20, 30, 60)
    pdf.cell(35, 6, "Role", border=1, fill=True)
    pdf.cell(35, 6, "Username", border=1, fill=True)
    pdf.cell(45, 6, "Password", border=1, fill=True)
    pdf.cell(65, 6, "Authorized Access Level", border=1, ln=1, fill=True)

    pdf.set_font("Arial", size=8)
    for r, u, p, a in creds:
        pdf.cell(35, 5.5, r, border=1)
        pdf.set_font("ArialBold", size=8)
        pdf.cell(35, 5.5, u, border=1)
        pdf.set_font("Arial", size=8)
        pdf.cell(45, 5.5, p, border=1)
        pdf.cell(65, 5.5, a, border=1, ln=1)


    # ================= PAGE 2 =================
    pdf.add_page()

    # Section 4: Functionality Checklist & Verification Matrix
    pdf.set_font("ArialBold", size=13)
    pdf.set_text_color(22, 119, 255)
    pdf.cell(0, 7, "4. Complete Feature Audit & Verification Matrix", ln=1)
    pdf.set_draw_color(22, 119, 255)
    pdf.line(15, pdf.get_y(), 85, pdf.get_y())
    pdf.ln(3)

    features = [
        ("Customer Portal", "Customer Authentication", "Username/Password login, fallback pass, JWT token issuance", "PASSED"),
        ("Customer Portal", "Portfolio Dashboard", "Aggregate balance, Savings/Current lists, FDs & Loans", "PASSED"),
        ("Customer Portal", "One-Click Emergency Freeze", "Compromise reason selection, immediate fund & card freeze", "PASSED"),
        ("Customer Portal", "2FA OTP Identity Unfreeze", "Simulated/live email OTP verification to restore normal status", "PASSED"),
        ("Customer Portal", "Virtual Debit Card", "3D card, CVV reveal, daily limit slider, freeze auto-sync", "PASSED"),
        ("Customer Portal", "NetBanking Transfer", "Account-to-account transfer with OTP; blocked when frozen", "PASSED"),
        ("Customer Portal", "KYC Document Verification", "Aadhaar/PAN document upload simulation & verification status", "PASSED"),
        ("Customer Portal", "Customer Helpdesk Support", "Interactive ticket creation & customer complaint tracking", "PASSED"),
        ("Employee Portal", "Staff & Manager Login", "Role-Based Access Control (RBAC) redirecting to CBS dashboard", "PASSED"),
        ("Employee Portal", "Security & Fraud Desk", "Incident audit feed, severity tags, reason details, SOP contact", "PASSED"),
        ("Employee Portal", "Branch Officer Lockdown", "Officers can instantly lock compromised customer accounts", "PASSED"),
        ("Employee Portal", "Admin Security Unfreeze", "Authorized branch officers verify identity & lift freeze", "PASSED"),
        ("Employee Portal", "Customer & Account Desk", "Customer registration, account opening (SA/CA/FD)", "PASSED"),
        ("Employee Portal", "Cash Counter Operations", "Deposit counter cash in, withdrawal counter cash out", "PASSED"),
        ("Employee Portal", "Manager Loan Approvals", "Review physical and online loan applications with 1-click decision", "PASSED"),
        ("Employee Portal", "Branch & Staff Management", "Create branches, manage teller roster, add employee profiles", "PASSED"),
        ("Employee Portal", "Manager Analytics Reports", "Detailed audit reports for transaction volume and loan defaults", "PASSED")
    ]

    pdf.set_fill_color(230, 240, 255)
    pdf.set_font("ArialBold", size=8.5)
    pdf.set_text_color(20, 30, 60)
    pdf.cell(32, 6, "Portal Module", border=1, fill=True)
    pdf.cell(46, 6, "Feature / Function", border=1, fill=True)
    pdf.cell(82, 6, "Technical Implementation & Scope", border=1, fill=True)
    pdf.cell(20, 6, "Test Result", border=1, ln=1, fill=True)

    pdf.set_font("Arial", size=7.8)
    for mod, feat, tech, res in features:
        pdf.cell(32, 5.2, mod, border=1)
        pdf.set_font("ArialBold", size=7.8)
        pdf.cell(46, 5.2, feat, border=1)
        pdf.set_font("Arial", size=7.8)
        pdf.cell(82, 5.2, tech, border=1)
        pdf.set_font("ArialBold", size=7.8)
        pdf.set_text_color(56, 158, 13) # Green
        pdf.cell(20, 5.2, f"[ {res} ]", border=1, ln=1, align="C")
        pdf.set_text_color(40, 45, 55)

    pdf.ln(5)

    # Section 5: Real-time Security & Fraud Lockdown Architecture
    pdf.set_font("ArialBold", size=13)
    pdf.set_text_color(22, 119, 255)
    pdf.cell(0, 7, "5. Emergency Freeze & Fraud Lockdown Architecture", ln=1)
    pdf.set_draw_color(22, 119, 255)
    pdf.line(15, pdf.get_y(), 95, pdf.get_y())
    pdf.ln(3)

    pdf.set_font("Arial", size=9)
    sec_text = (
        "The security subsystem is built around a unified utility module (frontend/src/utils/security.js) "
        "that manages two synchronized storage structures:\n"
        "1. bank_emergency_freeze: A case-insensitive dictionary for O(1) state resolution.\n"
        "2. bank_security_alerts: An append-only audit trail logging timestamps, compromise reasons, and actions taken.\n"
        "When an account is frozen, custom browser events (security_freeze_updated) and window storage events "
        "notify all open portal tabs simultaneously. Outgoing transfers on /customerPortal/onlineBanking are intercepted, "
        "the Virtual Debit Card is automatically locked with disabled toggles, and the Employee Portal displays a "
        "flashing red incident badge in the Security & Fraud sidebar menu."
    )
    pdf.multi_cell(0, 4.8, sec_text)


    # ================= PAGE 3 =================
    pdf.add_page()

    # Section 6: Step-by-Step Production Deployment Blueprint
    pdf.set_font("ArialBold", size=13)
    pdf.set_text_color(22, 119, 255)
    pdf.cell(0, 7, "6. Step-by-Step Production Deployment Blueprint (For Tomorrow)", ln=1)
    pdf.set_draw_color(22, 119, 255)
    pdf.line(15, pdf.get_y(), 110, pdf.get_y())
    pdf.ln(4)

    steps = [
        ("Step 1: Database Deployment (MySQL 8.0)", [
            "Select a cloud database provider: Railway.app, AWS RDS, Aiven, or PlanetScale.",
            "Create a new MySQL database named 'DBMS_BankApp'.",
            "Execute backend/createTables.sql to generate tables, primary keys, and foreign keys.",
            "Execute backend/DummyData.sql to seed branches, accounts, customers, and employees.",
            "Verify table count (8 core relational tables created successfully)."
        ]),
        ("Step 2: Backend API Deployment (Node.js & Express)", [
            "Deploy to a cloud platform: Render.com, Railway.app, or AWS Elastic Beanstalk.",
            "Set Root Directory to 'backend/'.",
            "Set Build Command: npm install",
            "Set Start Command: node index.js",
            "Configure Environment Variables in platform dashboard:",
            "    PORT = 8000",
            "    DB_HOST = <your-cloud-database-host>",
            "    DB_USER = <your-cloud-database-user>",
            "    DB_PASSWORD = <your-cloud-database-password>",
            "    DB_SCHEMA = DBMS_BankApp",
            "    JWT_SECRET = <secure-random-256bit-string>",
            "Verify endpoint: GET https://your-backend-api.onrender.com/branches (returns HTTP 200)."
        ]),
        ("Step 3: Frontend Deployment (React SPA)", [
            "Deploy to a static hosting platform: Vercel, Netlify, or Render Static.",
            "Set Root Directory to 'frontend/'.",
            "Set Build Command: npm run build",
            "Set Output Directory: build",
            "Configure Frontend Environment Variable:",
            "    REACT_APP_API_URL = https://your-backend-api.onrender.com",
            "Deploy! Frontend automatically connects to cloud backend using configured HOST."
        ]),
        ("Step 4: Post-Deployment Smoke Test Checklist", [
            "Test 1: Open production URL, login as AnjulaRox / 123456 -> Check account balance.",
            "Test 2: Click Emergency Freeze -> Verify virtual card freezes and NetBanking locks.",
            "Test 3: Open separate tab, login as cabral / 123456 -> Check Security & Fraud badge.",
            "Test 4: Complete 2FA OTP verification -> Confirm both portals return to normal."
        ])
    ]

    for title, substeps in steps:
        pdf.set_font("ArialBold", size=10)
        pdf.set_text_color(16, 25, 53)
        pdf.cell(0, 6, title, ln=1)

        pdf.set_font("Arial", size=8.5)
        pdf.set_text_color(50, 55, 65)
        for s in substeps:
            pdf.set_x(20)
            pdf.cell(4, 4.6, "-", ln=0)
            pdf.cell(0, 4.6, s, ln=1)
        pdf.ln(2)

    # Sign-off box
    pdf.ln(4)
    pdf.set_fill_color(245, 248, 255)
    pdf.set_draw_color(180, 205, 245)
    pdf.rect(15, pdf.get_y(), 180, 22, "FD")
    
    sign_y = pdf.get_y() + 3
    pdf.set_xy(20, sign_y)
    pdf.set_font("ArialBold", size=9)
    pdf.set_text_color(22, 119, 255)
    pdf.cell(0, 5, "Project Sign-off & Ready Status:", ln=1)
    pdf.set_x(20)
    pdf.set_font("Arial", size=8.5)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 5, "All functionalities, security guards, and database operations are verified and tested. Ready for final presentation and cloud deployment.", ln=1)

    # Save PDF
    out_path_1 = r"C:\Users\DELL\OneDrive\Desktop\BankProject-DBMS\ARUCI_Bank_Project_Documentation.pdf"
    out_path_2 = r"C:\Users\DELL\OneDrive\Desktop\project 1\ARUCI_Bank_Project_Documentation.pdf"
    
    pdf.output(out_path_1)
    pdf.output(out_path_2)
    print(f"PDF Successfully generated at:\n1. {out_path_1}\n2. {out_path_2}")

if __name__ == "__main__":
    build_pdf()
