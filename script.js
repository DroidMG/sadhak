document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GET ALL THE ELEMENTS ---
    const japaCountEl = document.getElementById('japaCount');
    const sadhanaDaysEl = document.getElementById('sadhanaDays');
    const startDateEl = document.getElementById('startDate');
    const purascharanNameEl = document.getElementById('purascharanName');
    
    const endDateResultEl = document.getElementById('endDateResult');
    const angasYesBtn = document.getElementById('angasYes');
    const angasNoBtn = document.getElementById('angasNo');
    
    const resultsCard = document.getElementById('resultsCard');
    const resultsTitleEl = document.getElementById('resultsTitle');
    const resultsContentEl = document.getElementById('resultsContent');
    const captureAreaEl = document.getElementById('captureArea');
    const saveAsImageBtn = document.getElementById('saveAsImage');
    
    let angasOption = null;

    // --- 2. SET DEFAULTS ---
    // Set today's date as the default start date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-11
    const dd = String(today.getDate()).padStart(2, '0');
    startDateEl.value = `${yyyy}-${mm}-${dd}`;

    // --- 3. CORE LOGIC FUNCTION ---
    const updatePlan = () => {
        // First, get all current values
        const japaCount = parseInt(japaCountEl.value, 10);
        const days = parseInt(sadhanaDaysEl.value, 10);
        const startDate = startDateEl.value;

        // --- Date Calculation ---
        if (startDate && days > 0) {
            const startDateObj = new Date(startDate);
            // Add timezone offset to prevent date from shifting
            startDateObj.setMinutes(startDateObj.getMinutes() + startDateObj.getTimezoneOffset());
            const endDate = new Date(startDateObj);
            endDate.setDate(startDateObj.getDate() + days - 1);
            endDateResultEl.textContent = `🔚 Your sadhana will end on: ${endDate.toLocaleDateString()}`;
        } else {
            endDateResultEl.textContent = '';
        }

        // --- Main Calculation (only if all inputs are ready) ---
        if (!japaCount || !days || days <= 0 || angasOption === null) {
            resultsCard.classList.add('results-hidden');
            return; // Exit if we don't have all the info
        }

        // If we have all info, show the card and calculate
        resultsCard.classList.remove('results-hidden');
        resultsContentEl.innerHTML = ''; // Clear previous results
        
        const sadhanaName = purascharanNameEl.value || "Sadhana";
        resultsTitleEl.textContent = `✨ ${sadhanaName} Plan ✨`;

        const formatNumber = (num) => Math.ceil(num).toLocaleString('en-IN');

        if (angasOption === 'yes') {
            const yagyaCount = japaCount / 10;
            const tarpanCount = yagyaCount / 10;
            const marjanCount = tarpanCount / 10;
            const bhojanCount = marjanCount / 10;

            resultsContentEl.innerHTML = `
                <p>🕉️ Daily Japa: <strong>${formatNumber(japaCount / days)}</strong></p>
                <p>🔥 Daily Yagya: <strong>${formatNumber(yagyaCount / days)}</strong></p>
                <p>💧 Daily Tarpan: <strong>${formatNumber(tarpanCount / days)}</strong></p>
                <p>💦 Daily Marjan: <strong>${formatNumber(marjanCount / days)}</strong></p>
                <p>🍽️ Brahman Bhojan (Total at end): <strong>${formatNumber(bhojanCount)}</strong></p>
            `;
        } else { // Compensatory Japa
            const yagyaJapa = (japaCount / 10) * 2;
            const tarpanJapa = (japaCount / 100) * 2;
            const marjanJapa = (japaCount / 1000) * 2;
            const bhojanJapa = (japaCount / 10000) * 2;
            const totalJapa = japaCount + yagyaJapa + tarpanJapa + marjanJapa + bhojanJapa;

            resultsContentEl.innerHTML = `
                <p class="compensatory-info">You've chosen to perform compensatory Japa. Here is your consolidated plan:</p>
                <p>Original Japa: <strong>${formatNumber(japaCount)}</strong></p>
                <p>➕ Japa for Yagya: <strong>${formatNumber(yagyaJapa)}</strong></p>
                <p>➕ Japa for Tarpan: <strong>${formatNumber(tarpanJapa)}</strong></p>
                <p>➕ Japa for Marjan: <strong>${formatNumber(marjanJapa)}</strong></p>
                <p>➕ Japa for Bhojan: <strong>${formatNumber(bhojanJapa)}</strong></p>
                <p class="grand-total">Total Japa Required: <strong>${formatNumber(totalJapa)}</strong></p>
                <p class="grand-total">🕉️ Your Daily Japa Goal: <strong>${formatNumber(totalJapa / days)}</strong></p>
            `;
        }
    };

    // --- 4. EVENT LISTENERS ---
    // Listen for clicks on the Yes/No buttons
    angasYesBtn.addEventListener('click', () => {
        angasOption = 'yes';
        angasYesBtn.classList.add('selected');
        angasNoBtn.classList.remove('selected');
        updatePlan(); // Run the main update function
    });

    angasNoBtn.addEventListener('click', () => {
        angasOption = 'no';
        angasNoBtn.classList.add('selected');
        angasYesBtn.classList.remove('selected');
        updatePlan(); // Run the main update function
    });

    // Listen for any input changes in the fields
    [japaCountEl, sadhanaDaysEl, startDateEl, purascharanNameEl].forEach(el => {
        el.addEventListener('input', updatePlan);
    });

    // Listener for the save image button
    saveAsImageBtn.addEventListener('click', () => {
        const sadhanaName = (purascharanNameEl.value || "Sadhana-Plan").replace(/ /g, "_");
        html2canvas(captureAreaEl, {
            backgroundColor: "#ffffff",
            scale: 2 // Higher resolution for better quality
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `${sadhanaName}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
    
    // --- 5. PWA SERVICE WORKER ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').then(registration => {
                console.log('✅ ServiceWorker registered');
            }, err => {
                console.log('❌ ServiceWorker registration failed: ', err);
            });
        });
    }
});
