import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
}

async function main() {
  console.log('Seeding database...');

  // Crea un utente demo
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      passwordHash: await hashPassword('demo1234'),
      name: 'Demo User',
    },
  });

  console.log('Created demo user:', demoUser.email);

  // Crea una subscription per l'utente demo
  const demoSubscription = await prisma.subscription.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      stripeCustomerId: 'cus_demo',
      stripeSubscriptionId: 'sub_demo',
      plan: 'starter',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 giorni
    },
  });

  console.log('Created demo subscription:', demoSubscription.plan);

  // Crea un progetto demo
  const demoProject = await prisma.project.upsert({
    where: {
      id: 'demo-project',
    },
    update: {},
    create: {
      id: 'demo-project',
      userId: demoUser.id,
      name: 'Demo Project',
      description: 'A demo project for testing purposes',
    },
  });

  console.log('Created demo project:', demoProject.name);

  // Crea un target demo
  const demoTarget = await prisma.target.upsert({
    where: {
      id: 'demo-target',
    },
    update: {},
    create: {
      id: 'demo-target',
      projectId: demoProject.id,
      name: 'Example Website',
      url: 'https://example.com',
    },
  });

  console.log('Created demo target:', demoTarget.name);

  // Crea uno scenario demo
  const basicScenarioCode = `
// Basic scenario that checks page title and links
async function run({ page }) {
  // Navigate to the target URL
  await page.goto(target.url);
  
  // Check page title
  const title = await page.title();
  console.log(\`Page title: \${title}\`);
  
  // Check for broken links (only HEAD requests to same domain)
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]'))
      .map(a => a.href)
      .filter(href => href.startsWith(window.location.origin) || href.startsWith('/'));
  });
  
  console.log(\`Found \${links.length} internal links\`);
  
  let brokenLinks = 0;
  for (const link of links.slice(0, MAX_LINKS_TO_CHECK)) {
    try {
      const response = await page.request.head(link);
      if (!response.ok()) {
        console.error(\`Broken link: \${link} (\${response.status()})\`);
        brokenLinks++;
      }
    } catch (error) {
      console.error(\`Error checking link: \${link}\`, error.message);
      brokenLinks++;
    }
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  
  // Return results
  return {
    brokenLinks,
    title,
  };
}
`;

  const demoScenario = await prisma.scenario.upsert({
    where: {
      id: 'demo-scenario',
    },
    update: {},
    create: {
      id: 'demo-scenario',
      projectId: demoProject.id,
      targetId: demoTarget.id,
      name: 'Basic Check',
      description: 'Checks page title and links',
      code: basicScenarioCode,
      schedule: '0 * * * *', // Ogni ora
    },
  });

  console.log('Created demo scenario:', demoScenario.name);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });