# Solex – SAP Fiori Report List Application

## Overview
Solex is a SAP Fiori-based report list application developed using SAP UI5 within SAP Business Application Studio (BAS). The project focuses on building a structured and responsive interface that displays product data in a tabular format, while emphasizing manual configuration and problem-solving in an enterprise development environment.

The application retrieves and presents product-related data with the following attributes:
- ProductID
- ProductName
- UnitPrice
- UnitsInStock

---

## Objectives
- Develop a SAP Fiori report list application using UI5
- Display structured product data in a table format
- Manually configure backend data sources
- Customize application behavior through configuration files
- Gain practical experience with SAP Business Application Studio workflows

---

## Project Setup and Approach

After opening the development space in SAP Business Application Studio, the provided sample project was identified as a reference-only resource that redirected to a GitHub repository and could not be directly used as a template.

To proceed:
- The sample project was cloned locally
- The project structure was reused as a reference
- The application was manually configured to meet the requirements

This included setting up data sources and adjusting multiple configuration files to ensure proper functionality.

---

## Key Configurations

### manifest.json
- Defined application metadata
- Configured data sources for product retrieval
- Established models and data binding
- Enabled table population with ProductID, ProductName, UnitPrice, and UnitsInStock

### ui5.yaml
- Configured UI5 tooling
- Fixed structural and indentation issues
- Set up middleware for backend connectivity

### attributes.xml
- Adjusted UI-related attributes
- Ensured proper binding between data and UI components

---

## Challenges and Solutions

### Non-Template Sample Project
Challenge:
The provided sample project could not be used directly and only linked to a remote repository.

Solution:
The repository was cloned and used as a base reference. The application was then manually configured to function independently.

---

### Manual Data Source Configuration
Challenge:
The application did not include pre-configured data sources.

Solution:
Data sources were manually defined in the manifest.json file, ensuring correct integration and data binding.

---

### Configuration File Errors
Challenge:
Issues in configuration files, especially formatting and structure, caused application failures.

Solution:
- Corrected YAML indentation and hierarchy
- Validated configuration files
- Ensed compatibility with UI5 tooling

---

### Environment Limitations
Challenge:
Development in BAS introduced occasional environment-related interruptions.

Solution:
- Restarted development sessions when necessary
- Maintained a clean and organized project structure
- Isolated environment-related issues from code-related issues

---

## Features
- Report list displaying product data in a table
- Structured UI5 application architecture
- Backend integration through manually configured data sources
- Clean and maintainable configuration setup

---

## Learning Outcomes
- Understanding SAP UI5 application structure
- Manual configuration of enterprise-level applications
- Debugging configuration and environment-related issues
- Adapting non-template resources into working solutions
- Working effectively within SAP Business Application Studio

---

## Conclusion
This project demonstrates the ability to build a SAP Fiori report list application from a non-template source through manual configuration and structured problem-solving. It highlights a strong understanding of UI5 architecture and practical development skills in an enterprise environment.

---

## Author
Abdelrahman Amr
