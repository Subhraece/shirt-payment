const roomNumberInput = document.getElementById('roomNumber');
const classNameInput = document.getElementById('className');
const bedCountInput = document.getElementById('bedCount');
const studentCountInput = document.getElementById('studentCount');

const vacantBedsDisplay = document.getElementById('vacantBeds');
const totalAmountDisplay = document.getElementById('totalAmount');
const messagePreview = document.getElementById('messagePreview');
const whatsappBtn = document.getElementById('whatsappBtn');
const toast = document.getElementById('toast');

// Toast notification helper
let toastTimeout;
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function updateCalculations() {
    const bedCount = parseInt(bedCountInput.value) || 0;
    const studentCount = parseInt(studentCountInput.value) || 0;

    // Calculate vacant beds (prevent negative numbers)
    const vacantBeds = Math.max(0, bedCount - studentCount);
    
    // Calculate total amount (400 per student)
    const totalAmount = studentCount * 400;

    // Update UI
    vacantBedsDisplay.textContent = vacantBeds;
    totalAmountDisplay.textContent = totalAmount;

    generateMessage(vacantBeds, totalAmount);
}

function generateMessage(vacantBeds, totalAmount) {
    const roomNumber = roomNumberInput.value || '[Room Number]';
    const className = classNameInput.value || '[Class]';
    const bedCount = bedCountInput.value || 0;
    const studentCount = studentCountInput.value || 0;

    const fullMessage = `*--- Room Details ---*
*Room:* ${roomNumber}
*Class:* ${className}
*Total Bed Count:* ${bedCount}
*Student Count:* ${studentCount}
*Vacant Beds:* ${vacantBeds}
*Payable amount to the cashier:* ₹${totalAmount} (${studentCount} × ₹400)`;

    messagePreview.textContent = fullMessage;
    return fullMessage;
}

function shareToWhatsApp() {
    // Validate that all fields are completely filled
    if (!roomNumberInput.value || !classNameInput.value || !bedCountInput.value || !studentCountInput.value) {
        showToast('Please fill all mandatory fields');
        return;
    }

    const bedCount = parseInt(bedCountInput.value) || 0;
    const studentCount = parseInt(studentCountInput.value) || 0;
    const vacantBeds = Math.max(0, bedCount - studentCount);
    const totalAmount = studentCount * 400;
    
    const message = generateMessage(vacantBeds, totalAmount);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Helper to enforce integer-only inputs
function enforceInteger(inputElement) {
    // Prevent typing non-numeric characters commonly allowed in number fields
    inputElement.addEventListener('keydown', function(e) {
        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
            e.preventDefault();
        }
    });
    // Remove any non-digit character that gets pasted or input
    inputElement.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
        updateCalculations();
    });
}

// Event Listeners
enforceInteger(roomNumberInput);
classNameInput.addEventListener('change', updateCalculations);
enforceInteger(bedCountInput);
enforceInteger(studentCountInput);

whatsappBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission
    shareToWhatsApp();
});

// Initial generation
updateCalculations();
