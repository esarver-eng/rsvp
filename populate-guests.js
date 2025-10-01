#!/usr/bin/env node

/**
 * Script to populate the guest list with sample data or import from CSV
 * Usage: node populate-guests.js [csv-file]
 */

const fs = require('fs');
const crypto = require('crypto');

const GUESTS_FILE = 'guests.json';

// Helper function to generate invite codes
function generateInviteCode(name) {
    const nameCode = name.toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .split(' ')
        .map(word => word.charAt(0))
        .join('');
    
    const randomCode = crypto.randomBytes(3).toString('hex');
    return `${nameCode}_${randomCode}`;
}

// Sample guest data (you can modify this)
const sampleGuests = [
    { name: "John Smith", phone: "+1234567890", family: "Smith Family" },
    { name: "Sarah Johnson", phone: "+1234567891", family: "Johnson Family" },
    { name: "Michael Cohen", phone: "+1234567892", family: "Cohen Family" },
    { name: "Rachel Green", phone: "+1234567893", family: "Green Family" },
    { name: "David Miller", phone: "+1234567894", family: "Miller Family" },
    { name: "Lisa Wilson", phone: "+1234567895", family: "Wilson Family" },
    { name: "Robert Brown", phone: "+1234567896", family: "Brown Family" },
    { name: "Jennifer Davis", phone: "+1234567897", family: "Davis Family" },
    { name: "William Garcia", phone: "+1234567898", family: "Garcia Family" },
    { name: "Elizabeth Rodriguez", phone: "+1234567899", family: "Rodriguez Family" }
];

function createGuestObject(guestData) {
    return {
        id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: guestData.name,
        phone: guestData.phone || '',
        family: guestData.family || guestData.name,
        inviteCode: generateInviteCode(guestData.name),
        createdAt: new Date().toISOString()
    };
}

function parseCSV(csvContent) {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const guests = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const guest = {};
        
        headers.forEach((header, index) => {
            if (values[index]) {
                guest[header] = values[index];
            }
        });
        
        if (guest.name) {
            guests.push(guest);
        }
    }
    
    return guests;
}

function saveGuests(guests) {
    try {
        fs.writeFileSync(GUESTS_FILE, JSON.stringify(guests, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving guests:', error);
        return false;
    }
}

function loadExistingGuests() {
    try {
        if (fs.existsSync(GUESTS_FILE)) {
            const data = fs.readFileSync(GUESTS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading existing guests:', error);
    }
    return [];
}

// Main execution
function main() {
    const args = process.argv.slice(2);
    const csvFile = args[0];
    
    console.log('🎉 Bar Mitzvah Guest List Populator');
    console.log('===================================\n');
    
    let guestsToAdd = [];
    
    if (csvFile) {
        // Import from CSV
        if (!fs.existsSync(csvFile)) {
            console.error(`❌ CSV file not found: ${csvFile}`);
            process.exit(1);
        }
        
        try {
            const csvContent = fs.readFileSync(csvFile, 'utf8');
            const csvGuests = parseCSV(csvContent);
            guestsToAdd = csvGuests;
            console.log(`📄 Importing ${guestsToAdd.length} guests from ${csvFile}`);
        } catch (error) {
            console.error(`❌ Error reading CSV file: ${error.message}`);
            process.exit(1);
        }
    } else {
        // Use sample data
        guestsToAdd = sampleGuests;
        console.log(`📝 Adding ${guestsToAdd.length} sample guests`);
        console.log('💡 To import from CSV: node populate-guests.js your-file.csv\n');
    }
    
    // Load existing guests
    const existingGuests = loadExistingGuests();
    console.log(`📋 Found ${existingGuests.length} existing guests\n`);
    
    // Convert to guest objects and add to existing list
    const newGuests = guestsToAdd.map(createGuestObject);
    const allGuests = [...existingGuests, ...newGuests];
    
    // Save to file
    if (saveGuests(allGuests)) {
        console.log(`✅ Successfully saved ${allGuests.length} total guests to ${GUESTS_FILE}\n`);
        
        console.log('📊 Guest Summary:');
        console.log('================');
        newGuests.forEach((guest, index) => {
            console.log(`${index + 1}. ${guest.name} (${guest.family})`);
            console.log(`   📱 ${guest.phone || 'No phone'}`);
            console.log(`   🔗 Invite Code: ${guest.inviteCode}`);
            console.log(`   🌐 RSVP Link: http://localhost:3000/rsvp/${guest.inviteCode}`);
            console.log('');
        });
        
        console.log('🚀 Next Steps:');
        console.log('==============');
        console.log('1. Start your server: npm start');
        console.log('2. Visit Guest Manager: http://localhost:3000/admin/guests-manager');
        console.log('3. Generate personalized links for all guests');
        console.log('4. Send WhatsApp messages or share links directly');
        console.log('');
        console.log('🎊 Your personalized RSVP system is ready!');
        
    } else {
        console.error('❌ Failed to save guests');
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { createGuestObject, parseCSV, generateInviteCode };

