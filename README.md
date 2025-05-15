# Mobile Call Dashboard with CSV Import

This project demonstrates how to use a SQLite database with Next.js to create a mobile call dashboard application. It includes functionality to import call logs from a CSV file.

## CSV Format

The application expects a CSV file with the following columns:

- ID: A string identifier for each call log
- DATES: The date of the call in YYYY-MM-DD format
- TIME: The time of the call in HH:MM:SS format
- CELLNUMBER: The phone number involved in the call
- CALLTYPE: The type of call (e.g., "Outgoing End")
- LOG: A text description of the call
- SENTBY: The carrier (e.g., "Jio")
- BYSIM: SIM card identifier (1, 2, etc.)
- LOOKUP: For contact lookup
- CALLDURATION: Duration of the call in seconds
- FLAG: Flag value (0, 1, etc.)

## Setup Instructions

1. Create a `data` folder in the root of your project
2. Run the development server and navigate to `/import` to import your CSV file
3. The application will create a SQLite database in the `data` folder

## Database Schema

The application uses two main tables:

1. `call_logs` - Stores call log information from the CSV
   - ID: Unique identifier
   - DATES: Date of the call
   - TIME: Time of the call
   - CELLNUMBER: Phone number
   - CALLTYPE: Call type
   - LOG: Description of the call
   - SENTBY: Carrier
   - BYSIM: SIM card identifier
   - LOOKUP: For contact lookup
   - CALLDURATION: Duration in seconds
   - FLAG: Flag value
   - contact_name: Name of the contact (if available)

2. `contacts` - Stores contact information
   - id: Unique identifier
   - name: Contact name
   - phone: Phone number (unique)
   - avatar: Optional path to avatar image
   - is_favorite: Boolean flag for favorite contacts (0 or 1)

## Development

\`\`\`bash
# Install dependencies
npm install

# Run the development server
npm run dev
\`\`\`

## Importing CSV Data

1. Navigate to `/import` in your browser
2. Enter the URL of your CSV file (default is the provided URL)
3. Click "Import CSV"
4. Wait for the import to complete

## Production

\`\`\`bash
# Build for production
npm run build

# Start the production server
npm start
\`\`\`

## Notes

- The SQLite database is accessed server-side only
- The application uses API routes to fetch data from the database
- Real-time updates are not supported with this implementation
