import { PrismaClient, ProductCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning existing data...')
  await prisma.orderItem.deleteMany()
  await prisma.preMadeBoxItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.preMadeBox.deleteMany()
  await prisma.boxType.deleteMany()
  await prisma.product.deleteMany()
  console.log('✅ Existing data cleaned')

  // Create Products
  console.log('📦 Creating products...')
  
  const products = await Promise.all([
    // TOYS
    prisma.product.create({
      data: {
        name: 'Lego Classic Creative Set',
        description: 'A classic building set with 790 pieces for endless creativity. Perfect for kids and adults who love building.',
        price: 45.99,
        category: ProductCategory.TOYS,
        stock: 50,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'],
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Remote Control Car',
        description: 'High-speed RC car with 2.4GHz remote control. Perfect for outdoor fun and racing.',
        price: 29.99,
        category: ProductCategory.TOYS,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop',
        images: ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop'],
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Jigsaw Puzzle 1000 Pieces',
        description: 'Beautiful landscape puzzle with 1000 pieces. Great for relaxation and family time.',
        price: 19.99,
        category: ProductCategory.TOYS,
        stock: 25,
        image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=800&fit=crop',
        images: ['https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=800&fit=crop'],
        isActive: true,
      },
    }),

    // ACCESSORIES
    prisma.product.create({
      data: {
        name: 'Leather Wallet',
        description: 'Premium genuine leather wallet with multiple card slots and cash compartment.',
        price: 34.99,
        category: ProductCategory.ACCESSORIES,
        stock: 40,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop',
        images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop'],
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Silk Scarf',
        description: 'Elegant 100% silk scarf with beautiful patterns. Perfect for any occasion.',
        price: 24.99,
        category: ProductCategory.ACCESSORIES,
        stock: 35,
        image: 'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=800&h=800&fit=crop',
        images: ['https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=800&h=800&fit=crop'],
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Designer Sunglasses',
        description: 'Stylish UV-protection sunglasses with polarized lenses. Multiple color options.',
        price: 49.99,
        category: ProductCategory.ACCESSORIES,
        stock: 20,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
        images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop'],
        isActive: true,
      },
    }),

    // COSMETICS
    prisma.product.create({
      data: {
        name: 'Luxury Face Cream Set',
        description: 'Premium anti-aging face cream with vitamin C and hyaluronic acid. 50ml.',
        price: 39.99,
        category: ProductCategory.COSMETICS,
        stock: 45,
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop',
        images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop'],
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Lipstick Set - 5 Colors',
        description: 'Matte finish lipstick set with 5 trendy colors. Long-lasting and moisturizing.',
        price: 27.99,
        category: ProductCategory.COSMETICS,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=800&fit=crop',
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=800&fit=crop'],
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Perfume - Floral Essence',
        description: 'Elegant floral fragrance with notes of rose, jasmine, and vanilla. 50ml Eau de Parfum.',
        price: 54.99,
        category: ProductCategory.COSMETICS,
        stock: 25,
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=800&fit=crop',
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=800&fit=crop'],
        isActive: true,
      },
    }),

    // SWEETS
    prisma.product.create({
      data: {
        name: 'Premium Chocolate Box',
        description: 'Assorted luxury chocolates from Belgium. 24 pieces in elegant gift box.',
        price: 19.99,
        category: ProductCategory.SWEETS,
        stock: 60,
        image: 'https://images.unsplash.com/photo-1606312619070-d48f4fbc8e5a?w=800&h=800&fit=crop',
        images: ['https://images.unsplash.com/photo-1606312619070-d48f4fbc8e5a?w=800&h=800&fit=crop'],
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Gourmet Cookie Assortment',
        description: 'Handmade cookies with premium ingredients. 12 pieces in beautiful packaging.',
        price: 14.99,
        category: ProductCategory.SWEETS,
        stock: 50,
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=800&fit=crop',
        images: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=800&fit=crop'],
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Artisan Candy Collection',
        description: 'Colorful assortment of handcrafted candies. Perfect for sharing or gifting.',
        price: 12.99,
        category: ProductCategory.SWEETS,
        stock: 40,
        image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=800&h=800&fit=crop',
        images: ['https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=800&h=800&fit=crop'],
        isActive: true,
      },
    }),

    // HYGIENE
    prisma.product.create({
      data: {
        name: 'Bath & Body Gift Set',
        description: 'Luxurious bath set with body wash, lotion, and bath bombs. Lavender scented.',
        price: 29.99,
        category: ProductCategory.HYGIENE,
        stock: 35,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop',
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop'],
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Premium Shampoo & Conditioner',
        description: 'Professional hair care set for all hair types. Sulfate-free formula.',
        price: 24.99,
        category: ProductCategory.HYGIENE,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&h=800&fit=crop',
        images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&h=800&fit=crop'],
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Skincare Essentials Kit',
        description: 'Complete skincare routine with cleanser, toner, and moisturizer. For all skin types.',
        price: 44.99,
        category: ProductCategory.HYGIENE,
        stock: 28,
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop',
        images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop'],
        isActive: true,
      },
    }),

    // OTHER
    prisma.product.create({
      data: {
        name: 'Aromatherapy Candle Set',
        description: 'Set of 3 scented candles with natural soy wax. Relaxing fragrances.',
        price: 22.99,
        category: ProductCategory.OTHER,
        stock: 40,
        image: 'https://images.unsplash.com/photo-1602874805499-3c423b5e1e52?w=800&h=800&fit=crop',
        images: ['https://images.unsplash.com/photo-1602874805499-3c423b5e1e52?w=800&h=800&fit=crop'],
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Journal & Pen Set',
        description: 'Beautiful leather-bound journal with premium pen. Perfect for writing and reflection.',
        price: 18.99,
        category: ProductCategory.OTHER,
        stock: 25,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop',
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop'],
        isActive: true,
      },
    }),
  ])

  console.log(`✅ Created ${products.length} products`)

  // Create Pre-Made Boxes
  console.log('🎁 Creating pre-made boxes...')

  // Kids Fun Box
  const kidsFunBox = await prisma.preMadeBox.create({
    data: {
      name: 'Kids Fun Box',
      description: 'Perfect gift box for kids! Includes toys, sweets, and fun accessories.',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop'],
      isActive: true,
    },
  })

  await prisma.preMadeBoxItem.createMany({
    data: [
      {
        premadeBoxId: kidsFunBox.id,
        productId: products[0].id, // Lego Set
        quantity: 1,
      },
      {
        premadeBoxId: kidsFunBox.id,
        productId: products[9].id, // Premium Chocolate Box
        quantity: 1,
      },
      {
        premadeBoxId: kidsFunBox.id,
        productId: products[10].id, // Gourmet Cookie Assortment
        quantity: 1,
      },
    ],
  })

  // Beauty & Wellness Box
  const beautyBox = await prisma.preMadeBox.create({
    data: {
      name: 'Beauty & Wellness Box',
      description: 'Luxury beauty and self-care products for the perfect pampering experience.',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop'],
      isActive: true,
    },
  })

  await prisma.preMadeBoxItem.createMany({
    data: [
      {
        premadeBoxId: beautyBox.id,
        productId: products[6].id, // Luxury Face Cream
        quantity: 1,
      },
      {
        premadeBoxId: beautyBox.id,
        productId: products[7].id, // Lipstick Set
        quantity: 1,
      },
      {
        premadeBoxId: beautyBox.id,
        productId: products[8].id, // Perfume
        quantity: 1,
      },
      {
        premadeBoxId: beautyBox.id,
        productId: products[13].id, // Bath & Body Set
        quantity: 1,
      },
    ],
  })

  // Sweet Treats Box
  const sweetTreatsBox = await prisma.preMadeBox.create({
    data: {
      name: 'Sweet Treats Box',
      description: 'A delightful collection of premium sweets and chocolates for any sweet tooth!',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1606312619070-d48f4fbc8e5a?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1606312619070-d48f4fbc8e5a?w=800&h=600&fit=crop'],
      isActive: true,
    },
  })

  await prisma.preMadeBoxItem.createMany({
    data: [
      {
        premadeBoxId: sweetTreatsBox.id,
        productId: products[9].id, // Premium Chocolate Box
        quantity: 2,
      },
      {
        premadeBoxId: sweetTreatsBox.id,
        productId: products[10].id, // Gourmet Cookie Assortment
        quantity: 1,
      },
      {
        premadeBoxId: sweetTreatsBox.id,
        productId: products[11].id, // Artisan Candy Collection
        quantity: 1,
      },
    ],
  })

  // Luxury Gift Box
  const luxuryBox = await prisma.preMadeBox.create({
    data: {
      name: 'Luxury Gift Box',
      description: 'Premium collection of high-end products. Perfect for special occasions.',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop'],
      isActive: true,
    },
  })

  await prisma.preMadeBoxItem.createMany({
    data: [
      {
        premadeBoxId: luxuryBox.id,
        productId: products[3].id, // Leather Wallet
        quantity: 1,
      },
      {
        premadeBoxId: luxuryBox.id,
        productId: products[4].id, // Silk Scarf
        quantity: 1,
      },
      {
        premadeBoxId: luxuryBox.id,
        productId: products[5].id, // Designer Sunglasses
        quantity: 1,
      },
      {
        premadeBoxId: luxuryBox.id,
        productId: products[8].id, // Perfume
        quantity: 1,
      },
      {
        premadeBoxId: luxuryBox.id,
        productId: products[16].id, // Journal & Pen Set
        quantity: 1,
      },
    ],
  })

  // Self-Care Box
  const selfCareBox = await prisma.preMadeBox.create({
    data: {
      name: 'Self-Care Box',
      description: 'Everything you need for a relaxing self-care day. Treat yourself!',
      price: 64.99,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop'],
      isActive: true,
    },
  })

  await prisma.preMadeBoxItem.createMany({
    data: [
      {
        premadeBoxId: selfCareBox.id,
        productId: products[13].id, // Bath & Body Set
        quantity: 1,
      },
      {
        premadeBoxId: selfCareBox.id,
        productId: products[15].id, // Skincare Essentials
        quantity: 1,
      },
      {
        premadeBoxId: selfCareBox.id,
        productId: products[16].id, // Aromatherapy Candles
        quantity: 1,
      },
      {
        premadeBoxId: selfCareBox.id,
        productId: products[9].id, // Premium Chocolate
        quantity: 1,
      },
    ],
  })

  console.log('✅ Created 5 pre-made boxes')

  // Create Box Types
  console.log('📦 Creating box types...')

  const boxTypes = await Promise.all([
    prisma.boxType.create({
      data: {
        name: 'Small Gift Box',
        description: 'Perfect for small gifts and single items. Compact and elegant design.',
        price: 5.99,
        size: 'Small (20×15×10 cm)',
        capacity: 3,
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1606312619070-d48f4fbc8e5a?w=800&h=800&fit=crop',
        ],
        isActive: true,
      },
    }),
    prisma.boxType.create({
      data: {
        name: 'Medium Gift Box',
        description: 'Ideal size for multiple items. Great for curated gift collections.',
        price: 9.99,
        size: 'Medium (30×20×15 cm)',
        capacity: 6,
        image: 'https://images.unsplash.com/photo-1606312619070-d48f4fbc8e5a?w=800&h=800&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1606312619070-d48f4fbc8e5a?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop',
        ],
        isActive: true,
      },
    }),
    prisma.boxType.create({
      data: {
        name: 'Large Gift Box',
        description: 'Spacious box for larger gifts or multiple items. Premium quality construction.',
        price: 14.99,
        size: 'Large (40×30×20 cm)',
        capacity: 10,
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1606312619070-d48f4fbc8e5a?w=800&h=800&fit=crop',
        ],
        isActive: true,
      },
    }),
    prisma.boxType.create({
      data: {
        name: 'Extra Large Gift Box',
        description: 'Maximum capacity for grand gifts. Perfect for special occasions and luxury items.',
        price: 19.99,
        size: 'Extra Large (50×35×25 cm)',
        capacity: 15,
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1606312619070-d48f4fbc8e5a?w=800&h=800&fit=crop',
        ],
        isActive: true,
      },
    }),
  ])

  console.log(`✅ Created ${boxTypes.length} box types`)

  // Create Admin User
  console.log('👤 Creating admin user...')
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@giftarium.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      password: hashedPassword, // Update password in case it changed
    },
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log(`✅ Admin user created/updated: ${adminUser.email}`)
  console.log(`   Default password: ${adminPassword}`)
  console.log('   ⚠️  Please change the password after first login!')

  // Summary
  const productCount = await prisma.product.count()
  const boxCount = await prisma.preMadeBox.count()
  const boxItemCount = await prisma.preMadeBoxItem.count()
  const boxTypeCount = await prisma.boxType.count()

  const userCount = await prisma.user.count()
  const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })

  console.log('\n📊 Seed Summary:')
  console.log(`   Products: ${productCount}`)
  console.log(`   Pre-Made Boxes: ${boxCount}`)
  console.log(`   Box Items: ${boxItemCount}`)
  console.log(`   Box Types: ${boxTypeCount}`)
  console.log(`   Total Users: ${userCount}`)
  console.log(`   Admin Users: ${adminCount}`)
  console.log('\n✨ Database seeded successfully!')
  console.log(`\n🔐 Admin Login Credentials:`)
  console.log(`   Email: ${adminEmail}`)
  console.log(`   Password: ${adminPassword}`)
  console.log(`   Login URL: http://localhost:3000/admin/login`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

