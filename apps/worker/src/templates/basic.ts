/**
 * Scenario di base che verifica il titolo della pagina e i link
 * 
 * Questo scenario:
 * 1. Naviga all'URL del target
 * 2. Verifica il titolo della pagina
 * 3. Cerca link rotti (solo richieste HEAD a link interni)
 * 4. Cattura uno screenshot
 */
async function run({ page, target, logger, MAX_LINKS_TO_CHECK }) {
  // Naviga all'URL del target
  logger.info(`Navigating to ${target.url}`);
  await page.goto(target.url);
  
  // Verifica il titolo della pagina
  const title = await page.title();
  logger.info(`Page title: ${title}`);
  
  // Verifica errori JavaScript nella console
  let jsErrors = 0;
  page.on('pageerror', (error) => {
    logger.error(`Page error: ${error.message}`);
    jsErrors++;
  });
  
  // Cerca link rotti (solo richieste HEAD a link interni)
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]'))
      .map(a => a.href)
      .filter(href => href.startsWith(window.location.origin) || href.startsWith('/'));
  });
  
  logger.info(`Found ${links.length} internal links`);
  
  let brokenLinks = 0;
  for (const link of links.slice(0, MAX_LINKS_TO_CHECK)) {
    try {
      const response = await page.request.head(link);
      if (!response.ok()) {
        logger.error(`Broken link: ${link} (${response.status()})`);
        brokenLinks++;
      }
    } catch (error) {
      logger.error(`Error checking link: ${link} - ${error.message}`);
      brokenLinks++;
    }
  }
  
  // Verifica la presenza di form e prova a interagire
  const hasForm = await page.evaluate(() => {
    return document.querySelectorAll('form').length > 0;
  });
  
  if (hasForm) {
    logger.info('Form detected, attempting interaction');
    try {
      // Cerca campi di input e prova a compilarli con valori di test
      await page.evaluate(() => {
        const inputs = document.querySelectorAll('input:not([type="hidden"])');
        inputs.forEach((input) => {
          const type = input.getAttribute('type');
          if (type === 'email') {
            input.value = 'test@example.com';
          } else if (type === 'password') {
            input.value = 'password123';
          } else if (type === 'text') {
            input.value = 'Test input';
          } else if (type === 'checkbox' || type === 'radio') {
            input.checked = true;
          }
        });
      });
      
      // Non inviamo il form per evitare effetti collaterali
      logger.info('Form fields filled with test data');
    } catch (error) {
      logger.error(`Error interacting with form: ${error.message}`);
    }
  }
  
  // Cattura uno screenshot
  logger.info('Taking screenshot');
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  
  // Restituisci i risultati
  return {
    title,
    brokenLinks,
    jsErrors,
    assertions: 1, // Verifica del titolo
    assertionsPassed: title ? 1 : 0,
  };
}