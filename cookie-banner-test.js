// Script di test per Cookie Banner
// Copia e incolla nella console del browser per testare

console.log('🍪 Cookie Banner Test Suite');
console.log('============================\n');

// Test 1: Controlla stato consenso
console.log('1️⃣ Stato attuale consenso:');
const consent = localStorage.getItem('cookie-consent');
if (consent) {
  console.log('✅ Consenso trovato:', JSON.parse(consent));
} else {
  console.log('⚠️ Nessun consenso salvato');
}

// Test 2: Rimuovi consenso per vedere il banner
console.log('\n2️⃣ Per rimuovere il consenso e visualizzare il banner:');
console.log('localStorage.removeItem("cookie-consent")');
console.log('window.location.reload()');

// Test 3: Verifica pagina corrente
console.log('\n3️⃣ Pagina corrente:');
console.log('Path:', window.location.pathname);
console.log('È cookie-policy?', window.location.pathname === '/cookie-policy');

// Test 4: Controlla overlay
console.log('\n4️⃣ Per verificare overlay:');
console.log('- Su /cookie-policy → NO overlay');
console.log('- Su altre pagine → Overlay presente');

// Test 5: Stati del banner
console.log('\n5️⃣ Stati possibili del banner:');
console.log('- Nascosto (consenso dato)');
console.log('- Minimizzato (badge in basso a destra)');
console.log('- Espanso Simple (vista principale)');
console.log('- Espanso Settings (vista personalizzazione)');

// Test 6: Rapido reset
console.log('\n6️⃣ Reset rapido:');
console.log('localStorage.clear(); window.location.reload();');

console.log('\n============================');
console.log('💡 Suggerimento: Apri DevTools Application > Local Storage');
console.log('per vedere le preferenze salvate in tempo reale');
