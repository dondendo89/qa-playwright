import { chromium } from 'playwright';

async function runTest() {
  console.log('🚀 Avvio test Playwright per https://web-production-087e0.up.railway.app/');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Naviga al sito
    console.log('📍 Navigazione al sito...');
    await page.goto('https://web-production-087e0.up.railway.app/', { waitUntil: 'networkidle' });
    
    // Ottieni il titolo della pagina
    const title = await page.title();
    console.log(`📄 Titolo pagina: ${title}`);
    
    // Verifica che la pagina sia caricata correttamente
    const isLoaded = await page.isVisible('body');
    console.log(`✅ Pagina caricata: ${isLoaded}`);
    
    // Cerca elementi specifici della dashboard
    const hasPlaywrightText = await page.locator('text=Playwright').count() > 0;
    console.log(`🎭 Contiene testo 'Playwright': ${hasPlaywrightText}`);
    
    // Verifica presenza di pulsanti principali
    const hasButtons = await page.locator('button').count();
    console.log(`🔘 Numero di pulsanti trovati: ${hasButtons}`);
    
    // Cattura screenshot
    await page.screenshot({ path: 'test-screenshot.png', fullPage: true });
    console.log('📸 Screenshot salvato come test-screenshot.png');
    
    // Verifica tempo di caricamento
    const loadTime = await page.evaluate(() => {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    });
    console.log(`⏱️ Tempo di caricamento: ${loadTime}ms`);
    
    // Risultato del test
    const testResult = {
      success: true,
      title: title,
      pageLoaded: isLoaded,
      hasPlaywrightContent: hasPlaywrightText,
      buttonCount: hasButtons,
      loadTime: loadTime,
      url: 'https://web-production-087e0.up.railway.app/',
      timestamp: new Date().toISOString()
    };
    
    console.log('\n🎉 Test completato con successo!');
    console.log('📊 Risultati:', JSON.stringify(testResult, null, 2));
    
    return testResult;
    
  } catch (error) {
    console.error('❌ Errore durante il test:', error);
    return {
      success: false,
      error: error.message,
      url: 'https://web-production-087e0.up.railway.app/',
      timestamp: new Date().toISOString()
    };
  } finally {
    await browser.close();
  }
}

// Esegui il test
runTest().then(result => {
  console.log('\n✨ Test terminato');
  process.exit(result.success ? 0 : 1);
}).catch(err => {
  console.error('💥 Errore fatale:', err);
  process.exit(1);
});