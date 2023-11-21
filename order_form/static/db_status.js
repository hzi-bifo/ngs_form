document.addEventListener('DOMContentLoaded', function() {
    fetch('/db_status').then(response => response.json()).then(data => {
        var statusLight = document.getElementById('db-status-light');
        var statusMessage = document.getElementById('db-status-message');

        if (data.status === 'connected') {
            statusLight.classList.add('db-status-connected');
        }

        statusMessage.textContent = data.message;
    });
});