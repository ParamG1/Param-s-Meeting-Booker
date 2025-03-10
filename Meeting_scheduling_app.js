let availability = [];
let currentUser = null;

document.getElementById('login-btn').addEventListener('click', function () {
    showSection('login-section');
});

document.getElementById('register-btn').addEventListener('click', function () {
    showSection('register-section');
});

document.getElementById('organizer-btn').addEventListener('click', function () {
    showSection('organizer-section');
});

document.getElementById('user-btn').addEventListener('click', function () {
    showSection('user-section');
    renderMeetings();
});

document.getElementById('logout-btn').addEventListener('click', function () {
    logout();
});

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

function updateNavBar() {
    if (currentUser) {
        document.getElementById('login-btn').classList.add('hidden');
        document.getElementById('register-btn').classList.add('hidden');
        document.getElementById('organizer-btn').classList.remove('hidden');
        document.getElementById('user-btn').classList.remove('hidden');
        document.getElementById('logout-btn').classList.remove('hidden');
    } else {
        document.getElementById('login-btn').classList.remove('hidden');
        document.getElementById('register-btn').classList.remove('hidden');
        document.getElementById('organizer-btn').classList.add('hidden');
        document.getElementById('user-btn').classList.add('hidden');
        document.getElementById('logout-btn').classList.add('hidden');
    }
}

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    currentUser = { username, password };
    updateNavBar();
    showSection('organizer-section');
    alert('Login successful!');
});

document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    alert('Registration successful! Please login.');
    showSection('login-section');
});

function logout() {
    currentUser = null;
    updateNavBar();
    showSection('login-section');
    alert('Logged out successfully.');
}

document.getElementById('set-availability-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;

    if (startTime && endTime) {
        const slot = {
            id: Date.now(),
            start: startTime,
            end: endTime,
            bookedBy: null,
        };
        availability.push(slot);
        renderAvailability();
        document.getElementById('set-availability-form').reset();
    } else {
        alert('Please enter valid time slots.');
    }
});

function renderAvailability() {
    const availabilityList = document.getElementById('availability-list');
    availabilityList.innerHTML = '';

    availability.forEach(slot => {
        const slotCard = document.createElement('div');
        slotCard.className = 'meeting-card';
        slotCard.innerHTML = `
            <h3>Slot</h3>
            <p>Start: ${new Date(slot.start).toLocaleString()}</p>
            <p>End: ${new Date(slot.end).toLocaleString()}</p>
            ${slot.bookedBy ? `<p>Booked by: ${slot.bookedBy}</p>` : ''}
        `;
        availabilityList.appendChild(slotCard);
    });
}

function renderMeetings() {
    const availableMeetings = document.getElementById('available-meetings');
    availableMeetings.innerHTML = '';

    availability.forEach(slot => {
        if (!slot.bookedBy) {
            const meetingCard = document.createElement('div');
            meetingCard.className = 'meeting-card';
            meetingCard.innerHTML = `
                <h3>Meeting Slot</h3>
                <p>Start: ${new Date(slot.start).toLocaleString()}</p>
                <p>End: ${new Date(slot.end).toLocaleString()}</p>
                <button onclick="bookMeeting(${slot.id})">Book Meeting</button>
            `;
            availableMeetings.appendChild(meetingCard);
        }
    });
}

function bookMeeting(slotId) {
    const slot = availability.find(s => s.id === slotId);
    if (slot) {
        slot.bookedBy = currentUser.username;
        renderAvailability();
        renderMeetings();
        document.getElementById('booking-display').innerHTML = `
            <div class="booking">
                <h3>Booking Confirmation</h3>
                <p>Start: ${new Date(slot.start).toLocaleString()}</p>
                <p>End: ${new Date(slot.end).toLocaleString()}</p>
                <p>Booked by: ${currentUser.username}</p>
            </div>
        `;
    } else {
        alert('Slot not found.');
    }
}

updateNavBar();
if (!currentUser) {
    showSection('login-section');
} else {
    showSection('organizer-section');
}