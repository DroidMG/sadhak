document.addEventListener('DOMContentLoaded', () => {
    const japaCountEl = document.getElementById('japaCount');
    const sadhanaDaysEl = document.getElementById('sadhanaDays');
    const startDateEl = document.getElementById('startDate');
    const endDateResultEl = document.getElementById('endDateResult');
    const angasYesBtn = document.getElementById('angasYes');
    const angasNoBtn = document.getElementById('angasNo');
    const resultsCard = document.getElementById('resultsCard');
    const resultsContent = document.getElementById('resultsContent');
    const saveAsImageBtn = document.getElementById('saveAsImage');

    let angasOption = null;

    // Set today's date as default for start date
    startDateEl.valueAsDate = new Date();

    const calculateEndDate = () => {
        if (startDateEl.value && sadhanaDaysEl.value) {
            const startDate = new Date(startDateEl.value);
            const days = parseInt(sadhanaDaysEl.value, 10);
            if (days > 0) {
                const endDate = new Date(startDate.getTime());
                endDate.setDate(startDate.getDate() + days -1);
                endDateResultEl.textContent = `🔚 Your sadhana will end on: ${endDate.toLocaleDateString()}`;
            } else {
                 endDateResultEl.textContent = '';
            }
        }
    };
    
    const formatNumber = (num) => Math.ceil(num).toLocaleString('en-IN');

    const generatePlan = () => {
        const japaCount = parseInt(japaCountEl.value, 10);
        const days = parseInt(sadhanaDaysEl.value, 10);

        if (!japaCount || !days || days <= 0 || angasOption === null) {
            resultsCard.classList.add('results-hidden');
            return;
        }

        resultsCard.classList.remove('results-hidden');
        resultsContent.innerHTML = ''; // Clear previous results

        if (angasOption === 'yes') {
            const yagyaCount = japaCount / 10;
            const tarpanCount = yagyaCount / 10;
            const marjanCount = tarpanCount / 10;
            const bhojanCount = marjanCount / 10;

            resultsContent.innerHTML = `
                <p>🕉️ Daily Japa: <strong>${formatNumber(japaCount / days)}</strong></p>
                <p>🔥 Daily Yagya: <strong>${formatNumber(yagyaCount / days)}</strong></p>
                <p>💧 Daily Tarpan: <strong>${formatNumber(tarpanCount / days)}</strong></p>
                <p>💦 Daily Marjan: <strong>${formatNumber(marjanCount / days)}</strong></p>
                <p>🍽️ Brahman Bhojan (Total): <strong>${formatNumber(bhojanCount)}</strong></p>
            `;
        } else { // Compensatory Japa
            const yagyaJapa = (japaCount / 10) * 2;
            const tarpanJapa = (japaCount / 100) * 2;
            const marjanJapa = (japaCount / 1000) * 2;
            const bhojanJapa = (japaCount / 10000) * 2;
            const totalJapa = japaCount + yagyaJapa + tarpanJapa + marjanJapa + bhojanJapa;

            resultsContent.innerHTML = `
                <p class="compensatory-info">You've chosen to perform compensatory Japa for the angas. Here is your consolidated plan:</p>
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

    sadhanaDaysEl.addEventListener('input', calculateEndDate);
    startDateEl.addEventListener('input', calculateEndDate);

    angasYesBtn.addEventListener('click', () => {
        angasOption = 'yes';
        angasYesBtn.classList.add('selected');
        angasNoBtn.classList.remove('selected');
        generatePlan();
    });

    angasNoBtn.addEventListener('click', () => {
        angasOption = 'no';
        angasNoBtn.classList.add('selected');
        angasYesBtn.classList.remove('selected');
        generatePlan();
    });
    
    // Listen for any changes to regenerate plan
    [japaCountEl, sadhanaDaysEl].forEach(el => el.addEventListener('input', generatePlan));
    
    saveAsImageBtn.addEventListener('click', () => {
        html2canvas(resultsCard, {
            backgroundColor: "#ffffff", // Set a solid background
            scale: 2 // Increase resolution
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'sadhana-plan.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
    
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, err => {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }

});```

---

### **4. `manifest.json` (PWA Manifest)**

This file tells the browser that your site is a PWA and provides its details.

```json
{
  "name": "Sadhak",
  "short_name": "Sadhak",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#FF7A00",
  "description": "A simple PWA to plan your Purascharan Sadhana.",
  "icons": [
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
