/**
 * Scenario di login parametrico
 * 
 * Questo scenario:
 * 1. Naviga all'URL di login
 * 2. Compila il form con le credenziali fornite
 * 3. Invia il form e attende la navigazione
 * 4. Verifica il successo del login
 * 5. Cattura uno screenshot
 * 
 * Parametri richiesti nelle variabili d'ambiente del progetto:
 * - LOGIN_URL: URL della pagina di login
 * - USERNAME_SELECTOR: Selettore CSS per il campo username/email
 * - PASSWORD_SELECTOR: Selettore CSS per il campo password
 * - SUBMIT_SELECTOR: Selettore CSS per il pulsante di submit
 * - SUCCESS_SELECTOR: Selettore CSS che indica il successo del login
 * - USERNAME: Username/email da utilizzare
 * - PASSWORD: Password da utilizzare
 */
async function run({ page, target, logger }) {
  // Recupera i parametri dalle variabili d'ambiente
  const params = {
    loginUrl: process.env.LOGIN_URL || target.url,
    usernameSelector: process.env.USERNAME_SELECTOR || 'input[type="email"], input[name="email"], input[name="username"]',
    passwordSelector: process.env.PASSWORD_SELECTOR || 'input[type="password"], input[name="password"]',
    submitSelector: process.env.SUBMIT_SELECTOR || 'button[type="submit"], input[type="submit"]',
    successSelector: process.env.SUCCESS_SELECTOR,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  };
  
  // Verifica che i parametri obbligatori siano presenti
  if (!params.username || !params.password) {
    throw new Error('USERNAME e PASSWORD sono richiesti nelle variabili d\'ambiente');
  }
  
  // Naviga alla pagina di login
  logger.info(`Navigating to login page: ${params.loginUrl}`);
  await page.goto(params.loginUrl);
  
  // Attendi che il form di login sia visibile
  logger.info('Waiting for login form');
  await page.waitForSelector(params.usernameSelector);
  await page.waitForSelector(params.passwordSelector);
  await page.waitForSelector(params.submitSelector);
  
  // Compila il form con le credenziali
  logger.info('Filling login form');
  await page.fill(params.usernameSelector, params.username);
  await page.fill(params.passwordSelector, params.password);
  
  // Cattura screenshot prima del submit
  await page.screenshot({ path: 'pre-login.png' });
  
  // Invia il form e attendi la navigazione
  logger.info('Submitting login form');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click(params.submitSelector),
  ]);
  
  // Verifica il successo del login
  let loginSuccess = false;
  if (params.successSelector) {
    try {
      await page.waitForSelector(params.successSelector, { timeout: 5000 });
      loginSuccess = true;
      logger.info('Login successful');
    } catch (error) {
      logger.error(`Login failed: Success selector not found - ${error.message}`);
    }
  } else {
    // Se non è specificato un selettore di successo, verifichiamo l'URL
    const currentUrl = page.url();
    loginSuccess = currentUrl !== params.loginUrl;
    logger.info(`Login result: ${loginSuccess ? 'Success' : 'Failed'} - Current URL: ${currentUrl}`);
  }
  
  // Verifica errori nella pagina
  let jsErrors = 0;
  page.on('pageerror', (error) => {
    logger.error(`Page error: ${error.message}`);
    jsErrors++;
  });
  
  // Cattura screenshot finale
  logger.info('Taking final screenshot');
  await page.screenshot({ path: 'post-login.png', fullPage: true });
  
  // Restituisci i risultati
  return {
    loginSuccess,
    jsErrors,
    assertions: 1, // Verifica del login
    assertionsPassed: loginSuccess ? 1 : 0,
  };
}