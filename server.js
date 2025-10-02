const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Store RSVPs and guests in JSON files
const RSVP_FILE = 'rsvps.json';
const GUESTS_FILE = 'guests.json';

// Initialize files if they don't exist
if (!fs.existsSync(RSVP_FILE)) {
    fs.writeFileSync(RSVP_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(GUESTS_FILE)) {
    fs.writeFileSync(GUESTS_FILE, JSON.stringify([], null, 2));
}

// Helper function to read RSVPs
function readRSVPs() {
    try {
        const data = fs.readFileSync(RSVP_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading RSVPs:', error);
        return [];
    }
}

// Helper function to write RSVPs
function writeRSVPs(rsvps) {
    try {
        fs.writeFileSync(RSVP_FILE, JSON.stringify(rsvps, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing RSVPs:', error);
        return false;
    }
}

// Helper function to read guests
function readGuests() {
    try {
        const data = fs.readFileSync(GUESTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading guests:', error);
        return [];
    }
}

// Helper function to write guests
function writeGuests(guests) {
    try {
        fs.writeFileSync(GUESTS_FILE, JSON.stringify(guests, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing guests:', error);
        return false;
    }
}

// Helper function to find guest by invite code
function findGuestByCode(inviteCode) {
    const guests = readGuests();
    return guests.find(guest => guest.inviteCode === inviteCode);
}

// Route to serve RSVP page (single link for all guests)
app.get('/rsvp', (req, res) => {
    try {
        // Read the index.html file and serve it directly
        res.sendFile(path.join(__dirname, 'index.html'));
    } catch (error) {
        console.error('Error serving RSVP page:', error);
        res.status(500).send('Error loading RSVP page');
    }
});

// Route to serve personalized RSVP page
app.get('/rsvp/:inviteCode', (req, res) => {
    try {
        const { inviteCode } = req.params;
        const guest = findGuestByCode(inviteCode);
        
        if (!guest) {
            return res.status(404).send(`
                <html>
                    <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                        <h1>Invalid Invitation Link</h1>
                        <p>This invitation link is not valid. Please check the link or contact the host.</p>
                    </body>
                </html>
            `);
        }
        
        // Read the main RSVP template and customize it
        let html = fs.readFileSync(path.join(__dirname, 'rsvp-template.html'), 'utf8');
        
        // Replace placeholders with guest information
        html = html.replace(/\[GUEST_NAME\]/g, guest.name);
        html = html.replace(/\[INVITE_CODE\]/g, inviteCode);
        html = html.replace(/\[FAMILY_NAME\]/g, guest.family || guest.name);
        
        res.send(html);
    } catch (error) {
        console.error('Error serving personalized RSVP:', error);
        res.status(500).send('Error loading RSVP page');
    }
});

// Route to handle RSVP submissions
app.post('/submit-rsvp', (req, res) => {
    try {
        const { guestName, rsvp, guestCount, dietaryRestrictions, inviteCode } = req.body;
        
        // Validate required fields
        if (!guestName || !rsvp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Guest name and RSVP status are required' 
            });
        }

        // Create RSVP object
        const newRSVP = {
            id: Date.now().toString(),
            guestName: guestName.trim(),
            rsvp,
            guestCount: rsvp === 'attending' ? (guestCount || '1') : '0',
            dietaryRestrictions: dietaryRestrictions || 'none',
            inviteCode: inviteCode || 'single-link',
            submittedAt: new Date().toISOString()
        };

        // Read existing RSVPs
        const rsvps = readRSVPs();
        
        // Add new RSVP
        rsvps.push(newRSVP);
        
        // Write back to file
        if (writeRSVPs(rsvps)) {
            console.log('New RSVP received:', newRSVP);
            res.json({ 
                success: true, 
                message: 'RSVP submitted successfully!',
                rsvp: newRSVP
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Error saving RSVP' 
            });
        }
    } catch (error) {
        console.error('Error processing RSVP:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Route to view all RSVPs (for the host)
app.get('/legion/rsvps', (req, res) => {
    try {
        const rsvps = readRSVPs();
        
        // Calculate statistics
        const stats = {
            total: rsvps.length,
            attending: rsvps.filter(r => r.rsvp === 'attending').length,
            notAttending: rsvps.filter(r => r.rsvp === 'not-attending').length,
            totalGuests: rsvps
                .filter(r => r.rsvp === 'attending')
                .reduce((sum, r) => sum + parseInt(r.guestCount || 0), 0)
        };

        res.json({
            success: true,
            stats,
            rsvps
        });
    } catch (error) {
        console.error('Error fetching RSVPs:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching RSVPs' 
        });
    }
});

// Route to manage guests (add/edit/delete)
app.post('/admin/guests', (req, res) => {
    try {
        const { name, phone, family } = req.body;
        
        if (!name) {
            return res.status(400).json({ 
                success: false, 
                message: 'Guest name is required' 
            });
        }

        const guests = readGuests();
        
        // Generate unique invite code
        const inviteCode = generateInviteCode(name);
        
        const newGuest = {
            id: `guest_${Date.now()}`,
            name,
            phone: phone || '',
            family: family || name,
            inviteCode,
            createdAt: new Date().toISOString()
        };

        guests.push(newGuest);
        
        if (writeGuests(guests)) {
            res.json({ 
                success: true, 
                message: 'Guest added successfully!',
                guest: newGuest
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Error saving guest' 
            });
        }
    } catch (error) {
        console.error('Error adding guest:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Route to get all guests
app.get('/admin/guests', (req, res) => {
    try {
        const guests = readGuests();
        res.json({
            success: true,
            guests
        });
    } catch (error) {
        console.error('Error fetching guests:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching guests' 
        });
    }
});

// Route to generate invite links for all guests
app.get('/admin/generate-links', (req, res) => {
    try {
        const guests = readGuests();
        const baseUrl = req.protocol + '://' + req.get('host');
        
        const guestLinks = guests.map(guest => ({
            name: guest.name,
            family: guest.family,
            phone: guest.phone,
            inviteCode: guest.inviteCode,
            rsvpLink: `${baseUrl}/rsvp/${guest.inviteCode}`,
            whatsappMessage: encodeURIComponent(
                `Hi ${guest.name}! You're invited to [Son's Name]'s Bar Mitzvah! Please RSVP at: ${baseUrl}/rsvp/${guest.inviteCode}`
            ),
            whatsappLink: `https://wa.me/${guest.phone?.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                `Hi ${guest.name}! You're invited to [Son's Name]'s Bar Mitzvah! Please RSVP at: ${baseUrl}/rsvp/${guest.inviteCode}`
            )}`
        }));

        res.json({
            success: true,
            baseUrl,
            guestLinks
        });
    } catch (error) {
        console.error('Error generating links:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error generating links' 
        });
    }
});

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

// Route to serve admin dashboard
app.get('/legion', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Route to serve guest manager
app.get('/legion/guests-manager', (req, res) => {
    res.sendFile(path.join(__dirname, 'guest-manager.html'));
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🎉 Bar Mitzvah RSVP server running at http://localhost:${PORT}`);
    console.log(`📊 Admin dashboard: http://localhost:${PORT}/admin`);
    console.log(`📱 RSVP form: http://localhost:${PORT}`);
});

module.exports = app;
