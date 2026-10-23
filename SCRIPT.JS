document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('complaintForm');
    const container = document.getElementById('complaintsContainer');

    let complaints = JSON.parse(localStorage.getItem('complaints')) || [
        { id: 1, category: 'Water Leakage', description: 'Main pipe leaking near B-wing parking entrance.', votes: 5, status: 'Pending' },
        { id: 2, category: 'Lift Problem', description: 'Lift in A-wing making loud grinding noise.', votes: 8, status: 'In Progress' }
    ];

    function saveAndRender() {
        complaints.sort((a, b) => b.votes - a.votes);
        localStorage.setItem('complaints', JSON.stringify(complaints));
        renderComplaints();
    }

    function renderComplaints() {
        container.innerHTML = '';
        if (complaints.length === 0) {
            container.innerHTML = '<p>No complaints reported yet.</p>';
            return;
        }

        complaints.forEach((c) => {
            const card = document.createElement('div');
            card.className = 'complaint-card';
            
            let statusClass = 'pending';
            if (c.status === 'In Progress') statusClass = 'in-progress';
            if (c.status === 'Resolved') statusClass = 'resolved';

            card.innerHTML = `
                <div class="complaint-info">
                    <h3>${c.category} <span class="badge ${statusClass}">${c.status}</span></h3>
                    <p>${c.description}</p>
                </div>
                <div class="actions">
                    <button class="btn-upvote" onclick="upvoteComplaint(${c.id})">👍 Upvote (${c.votes})</button>
                    <select onchange="updateStatus(${c.id}, this.value)">
                        <option value="Pending" ${c.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Resolved" ${c.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                    </select>
                </div>
            `;
            container.appendChild(card);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;

        const newComplaint = {
            id: Date.now(),
            category,
            description,
            votes: 1,
            status: 'Pending'
        };

        complaints.push(newComplaint);
        saveAndRender();
        form.reset();
    });

    window.upvoteComplaint = function(id) {
        const complaint = complaints.find(c => c.id === id);
        if (complaint) {
            complaint.votes += 1;
            saveAndRender();
        }
    };

    window.updateStatus = function(id, newStatus) {
        const complaint = complaints.find(c => c.id === id);
        if (complaint) {
            complaint.status = newStatus;
            saveAndRender();
        }
    };

    renderComplaints();
});
