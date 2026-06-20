import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database…');

  // ─── Admin user ────────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@nego.bot';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@12345';

  const existingAdmin = await prisma.merchant.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const admin = await prisma.merchant.create({
      data: {
        name: 'Platform Admin',
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 12),
        role: 'admin',
        botName: 'Max',
        language: 'en',
      },
    });
    console.log(`✅ Admin created: ${admin.email}  (password: ${adminPassword})`);
  } else {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`);
  }

  // ─── Demo merchant ─────────────────────────────────────────────────────────
  const demoEmail = 'demo@nego.bot';
  const demoPassword = 'Demo@12345';

  let demo = await prisma.merchant.findUnique({ where: { email: demoEmail } });
  if (!demo) {
    demo = await prisma.merchant.create({
      data: {
        name: 'Demo Store',
        email: demoEmail,
        password: await bcrypt.hash(demoPassword, 12),
        role: 'merchant',
        plan: 'pro',
        status: 'active',
        botName: 'Nego',
        language: 'en',
        apiKey: 'demo-api-key-3ef9190674d01e3a',
      },
    });
    console.log(`✅ Demo merchant created: ${demo.email}  (password: ${demoPassword})`);

    // A sample support ticket so the admin Support page has data.
    await prisma.supportTicket.create({
      data: {
        merchantId: demo.id,
        subject: 'How do I change my floor price?',
        priority: 'normal',
        messages: {
          create: { authorRole: 'merchant', body: 'Hi, I want to update the floor price on one of my products but cannot find the option. Can you help?' },
        },
      },
    });
    console.log('✅ Sample support ticket created');
  } else {
    console.log(`ℹ️  Demo merchant already exists: ${demoEmail}`);
  }

  // A second (free) merchant so Users/Billing pages show variety.
  const free2Email = 'lagos-store@nego.bot';
  if (!(await prisma.merchant.findUnique({ where: { email: free2Email } }))) {
    await prisma.merchant.create({
      data: {
        name: 'Lagos Gadgets',
        email: free2Email,
        password: await bcrypt.hash('Demo@12345', 12),
        role: 'merchant',
        plan: 'free',
        botName: 'Ada',
        language: 'pidgin',
      },
    });
    console.log(`✅ Second merchant created: ${free2Email}`);
  }

  // ─── Demo products ─────────────────────────────────────────────────────────
  const products = [
    {
      id: 'cuid_demo_product_01',
      name: 'Wireless Noise-Cancelling Headphones',
      description: 'Premium over-ear headphones with 40h battery, ANC, and Hi-Res Audio certification.',
      listPrice: 199.99,
      floorPrice: 149.99,
      currency: 'USD',
    },
    {
      id: 'cuid_demo_product_02',
      name: 'Smart Fitness Watch',
      description: 'Track your health 24/7 — heart rate, SpO2, sleep, 50+ workout modes.',
      listPrice: 129.99,
      floorPrice: 89.99,
      currency: 'USD',
    },
  ];

  for (const p of products) {
    const existing = await prisma.product.findUnique({ where: { id: p.id } });
    if (!existing) {
      await prisma.product.create({
        data: { ...p, merchantId: demo.id },
      });
      console.log(`✅ Product created: ${p.name}`);
    } else {
      console.log(`ℹ️  Product already exists: ${p.name}`);
    }
  }

  console.log('\n─────────────────────────────────────────');
  console.log('Demo Login');
  console.log(`  URL:      /login`);
  console.log(`  Email:    ${demoEmail}`);
  console.log(`  Password: ${demoPassword}`);
  console.log('\nAdmin Login');
  console.log(`  URL:      /admin/login`);
  console.log(`  Email:    ${adminEmail}`);
  console.log(`  Password: ${adminPassword}`);
  console.log('─────────────────────────────────────────\n');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
