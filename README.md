# PBook

A Next.js application for patient registration and search with real-time tab synchronization.

![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat&logo=typescript)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat&logo=react)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-0.5.0+-black?style=flat)

## Features

- Patient registration form with validation
- Comprehensive patient listing with pagination, column resizing, and hide/unhide functionality
- Raw SQL search functionality with syntax highlight
- Real-time synchronization across browser tabs
- Responsive UI built with shadcn/ui components
- Local-first database using PGLite (IndexedDB)

## Prerequisites

- Node.js v18+
- npm v9+
- CountryStateCity API key

## Setup & Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ashutosh-s15/pbook.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   If you encounter shadcn/ui issues::

   ```bash
   npm install --legacy-peer-deps
   ```

3. Set up environment variables:

- Copy `.env.example` to `.env.development`
- Add your API key:
  ```bash
  NEXT_PUBLIC_CSC_API_KEY="your_api_key_here"
  ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

## Deployment

The application is deployed on Vercel:  
🔗 [https://pbook-two.vercel.app/](https://pbook-two.vercel.app/)

## Usage

1. Register/Add a Patient.
   ![alt text]({DFBCEC94-2AE2-406A-AAF6-14C2CEE9F000}.png)

2. View the patient list in a paginated table.
   ![alt text]({58F21FCB-B4C7-4F4D-9C6C-6C8BAE335FD5}.png)

3. Use the SQL query box to search patients with raw `SELECT` queries and view the result in paginated table.
   ![alt text]({18A47125-5D2C-432F-91ED-423FBFEC492D}.png)
   ![alt text]({6868768F-E486-4D18-AFFB-24F43E6846CF}.png)

4. Click "Reset" to restore the default table view.
   ![alt text]({68AF214D-1B87-4E8D-B60A-27BAB94A0CF3}.png)

5. Click "Info" to view SQL query guidelines.
   ![alt text]({D32F9BAF-E4B9-4F10-992C-7D945CAE993C}.png)

## Development Challenges

### 🔍 SQL Search Implementation

Creating a simple but robust SQL raw query search functionality was challenging, as I needed to consider various edge cases and validations to ensure both good user experience and security. The implementation required careful handling of:

- Different search patterns and input formats
- Security considerations to prevent injection
- Performance optimization for responsive results

### 🔄 Tab Synchronization

Implementing the tab sync functionality was particularly interesting as it was my first time building this feature. The challenge involved:

- Learning the BroadcastChannel API
- Handling state consistency across multiple tabs
- Ensuring real-time updates without performance hits

## Planned Improvements

### 🏥 UI Library Upgrade

During my research, I discovered Medblocks UI which would have been an excellent choice for the patient registration app. However, due to time constraints from my work commitments and project's deadline, I opted to use UI libraries I was already familiar with.

### 🗃️ Database Schema Refinement

To keep the initial implementation simple (since this is primarily a patient register/listing app), I used a single patient table structure. For a more scalable solution in larger applications, I would:

- Create separate tables for contacts, allergies, and addresses
- Implement proper relationships between entities
- Add more robust data validation at the database level

### 🔄 Advanced Tab Sync

While the current BroadcastChannel implementation works, I discovered PGLITE Multi-tab workers late in development which could provide a more elegant solution for handling multiple database instances across tabs.
