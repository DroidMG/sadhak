document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GET ALL THE ELEMENTS ---
    const japaCountEl = document.getElementById('japaCount');
    const sadhanaDaysEl = document.getElementById('sadhanaDays');
    const startDateEl = document.getElementById('startDate');
    const purascharanNameEl = document.getElementById('purascharanName');
    
    const liveEndDateDisplayEl = document.getElementById('liveEndDateDisplay');
    const imageDateDisplayEl = document.getElementById('imageDateDisplay');
    
    const angasYesBtn = document.getElementById('angasYes');
    const angasNoBtn = document.getElementById('angasNo');
    
    const angasFrequencyGroup = document.getElementById('angasFrequencyGroup');
    const dailyBtn = document.getElementById('dailyBtn');
    const atEndBtn = document.getElementById('atEndBtn');
    
    const resultsCard = document.getElementById('resultsCard');
    const resultsTitleEl = document.getElementById('resultsTitle');
    const resultsContentEl = document.getElementById('resultsContent');
    const captureAreaEl = document.getElementById('captureArea');
    const saveAsImageBtn = document.getElementById('saveAsImage');
    
    // --- 2. STATE MANAGEMENT ---
    let angasOption = null; // Can be 'yes' or 'no'
    let angasFrequency = null; // Can be 'daily' or 'atEnd'

    // --- 3. SET DEFAULTS ---
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    startDateEl.value = `${yyyy}-${mm}-${dd}`;

    // --- 4. CORE LOGIC FUNCTION ---
    const updatePlan = () => {
        const japaCount = parseInt(japaCountEl.value, 10);
        const days = parseInt(sadhanaDaysEl.value, 10);
        const startDateValue = startDateEl.value;
        
        let dateInfoText = '';
        if (startDateValue && days > 0) {
            const startDateObj = new Date(startDateValue);
            startDateObj.setMinutes(startDateObj.getMinutes() + startDateObj.getTimezoneOffset());
            const endDate = new Date(startDateObj);
            endDate.setDate(startDateObj.getDate() + days - 1);
            const startDateFormatted = startDateObj.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
            const endDateFormatted = endDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
            dateInfoText = `🗓️ From ${startDateFormatted} to ${endDateFormatted}`;
        }
        liveEndDateDisplayEl.textContent = dateInfoText;
        imageDateDisplayEl.textContent = dateInfoText;

        const isReady = japaCount && days > 0 && angasOption !== null && (angasOption === 'no' || (angasOption === 'yes' && angasFrequency !== null));

        if (!isReady) {
            resultsCard.classList.add('results-hidden');
            return;
        }

        resultsCard.classList.remove('results-hidden');
        resultsContentEl.innerHTML = '';
        
        const sadhanaName = purascharanNameEl.value || "Sadhana";
        resultsTitleEl.textContent = `✨ ${sadhanaName} Plan ✨`;

        const formatNumber = (num) => Math.ceil(num).toLocaleString('en-IN');
        const yagyaCount = japaCount / 10;
        const tarpanCount = yagyaCount / 10;
        const marjanCount = tarpanCount / 10;
        const bhojanCount = marjanCount / 10;

        if (angasOption === 'yes') {
            if (angasFrequency === 'daily') {
                resultsContentEl.innerHTML = `
                    <h3>Daily Sadhana Plan</h3>
                    <p>🕉️ Daily Japa: <strong>${formatNumber(japaCount / days)}</strong></p>
                    <p>🔥 Daily Yagya: <strong>${formatNumber(yagyaCount / days)}</strong></p>
                    <p>💧 Daily Tarpan: <strong>${formatNumber(tarpanCount / days)}</strong></p>
                    <p>💦 Daily Marjan: <strong>${formatNumber(marjanCount / days)}</strong></p>
                    <p>🍽️ Brahman Bhojan (Total at end): <strong>${formatNumber(bhojanCount)}</strong></p>
                `;
            } else { // At the End
                resultsContentEl.innerHTML = `
                    <h3>Daily Sadhana (for ${days} days)</h3>
                    <p>🕉️ Daily Japa: <strong>${formatNumber(japaCount / days)}</strong></p>
                    <h3>Final Acts (to be performed once after completion)</h3>
                    <p>🔥 Total Yagya: <strong>${formatNumber(yagyaCount)}</strong></p>
                    <p>💧 Total Tarpan: <strong>${formatNumber(tarpanCount)}</strong></p>
                    <p>💦 Total Marjan: <strong>${formatNumber(marjanCount)}</strong></p>
                    <p>🍽️ Brahman Bhojan: <strong>${formatNumber(bhojanCount)}</strong></p>
                `;
            }
        } else { // Compensatory Japa
            const yagyaJapa = yagyaCount * 2;
            const tarpanJapa = tarpanCount * 2;
            const marjanJapa = marjanCount * 2;
            const bhojanJapa = bhojanCount * 2;
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

    // --- 5. EVENT LISTENERS ---
    angasYesBtn.addEventListener('click', () => {
        angasOption = 'yes';
        angasYesBtn.classList.add('selected');
        angasNoBtn.classList.remove('selected');
        angasFrequencyGroup.classList.remove('hidden'); // Show the new choice
        updatePlan();
    });

    angasNoBtn.addEventListener('click', () => {
        angasOption = 'no';
        angasNoBtn.classList.add('selected');
        angasYesBtn.classList.remove('selected');
        angasFrequencyGroup.classList.add('hidden'); // Hide the new choice
        angasFrequency = null; // Reset the secondary choice
        dailyBtn.classList.remove('selected');
        atEndBtn.classList.remove('selected');
        updatePlan();
    });

    dailyBtn.addEventListener('click', () => {
        angasFrequency = 'daily';
        dailyBtn.classList.add('selected');
        atEndBtn.classList.remove('selected');
        updatePlan();
    });

    atEndBtn.addEventListener('click', () => {
        angasFrequency = 'atEnd';
        atEndBtn.classList.add('selected');
        dailyBtn.classList.remove('selected');
        updatePlan();
    });

    [japaCountEl, sadhanaDaysEl, startDateEl, purascharanNameEl].forEach(el => {
        el.addEventListener('input', updatePlan);
    });

    saveAsImageBtn.addEventListener('click', () => {
        const sadhanaName = (purascharanNameEl.value || "Sadhana-Plan").replace(/ /g, "_");
        html2canvas(captureAreaEl, { backgroundColor: "#ffffff", scale: 2 })
            .then(canvas => {
                const link = document.createElement('a');
                link.download = `${sadhanaName}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
    });
    
    // --- 6. PWA SERVICE WORKER ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').then(reg => console.log('✅ ServiceWorker registered'), err => console.log('❌ ServiceWorker registration failed: ', err));
        });
    }

    // --- 7. INITIAL CALL ---
    updatePlan();
});
