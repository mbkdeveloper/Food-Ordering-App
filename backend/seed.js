import mongoose from 'mongoose';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import foodModel from './models/foodModel.js';
import bcrypt from 'bcrypt';
import userModel from './models/userModel.js';

const tunisianDishes = [
    { name: 'Couscous', description: 'Traditional Tunisian couscous with lamb and vegetables.', price: 25, image: 'https://placehold.co/400x300?text=Couscous', category: 'Traditional' },
    { name: 'Brik', description: 'Crispy pastry filled with egg, tuna, and parsley.', price: 5, image: 'https://placehold.co/400x300?text=Brik', category: 'Appetizer' },
    { name: 'Lablabi', description: 'Spicy chickpea soup with bread and tuna.', price: 8, image: 'https://placehold.co/400x300?text=Lablabi', category: 'Soup' },
    { name: 'Ojja', description: 'Spicy tomato sauce with eggs and merguez.', price: 15, image: 'https://placehold.co/400x300?text=Ojja', category: 'Main' },
    { name: 'Kamounia', description: 'Beef and liver stew flavored with cumin.', price: 20, image: 'https://placehold.co/400x300?text=Kamounia', category: 'Main' },
    { name: 'Slata Mechouia', description: 'Grilled pepper and tomato salad.', price: 10, image: 'https://placehold.co/400x300?text=Slata+Mechouia', category: 'Appetizer' },
    { name: 'Makloub', description: 'Folded pizza sandwich filled with chicken and cheese.', price: 12, image: 'https://placehold.co/400x300?text=Makloub', category: 'Fast Food' },
    { name: 'Mloukhia', description: 'Slow-cooked beef in a rich, dark sauce.', price: 28, image: 'https://placehold.co/400x300?text=Mloukhia', category: 'Traditional' },
    { name: 'Kafteji', description: 'Fried vegetables and eggs chopped together.', price: 10, image: 'https://placehold.co/400x300?text=Kafteji', category: 'Street Food' },
    { name: 'Chorba', description: 'Traditional tomato and barley soup.', price: 8, image: 'https://placehold.co/400x300?text=Chorba', category: 'Soup' },
    { name: 'Fricassé', description: 'Fried savory donut filled with tuna, potato, and egg.', price: 3, image: 'https://placehold.co/400x300?text=Fricasse', category: 'Street Food' },
    { name: 'Chapati Tunisien', description: 'Flatbread sandwich with omelet, tuna, and harissa.', price: 7, image: 'https://placehold.co/400x300?text=Chapati+Tunisien', category: 'Street Food' },
    { name: 'Rouz Jerbi', description: 'Steamed rice with meat, spinach, and peas.', price: 22, image: 'https://placehold.co/400x300?text=Rouz+Jerbi', category: 'Traditional' },
    { name: 'Tajine Jben', description: 'Tunisian baked egg and cheese casserole.', price: 15, image: 'https://placehold.co/400x300?text=Tajine+Jben', category: 'Main' },
    { name: 'Hargma', description: 'Spicy cow\'s trotters and chickpea stew.', price: 18, image: 'https://placehold.co/400x300?text=Hargma', category: 'Traditional' }
];

const seedDB = async () => {
    try {
        await connectDB();
        console.log('Clearing existing food data...');
        await foodModel.deleteMany({});
        console.log('Seeding Tunisian dishes...');
        await foodModel.insertMany(tunisianDishes);
        console.log('Food seeded successfully!');

        // Also seed an admin user
        const existingAdmin = await userModel.findOne({ email: 'admin@food.com' });
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await userModel.create({
                name: 'Admin',
                email: 'admin@food.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user seeded (admin@food.com / admin123)');
        }

        const existingClient = await userModel.findOne({ email: 'client@food.com' });
        if (!existingClient) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('client123', salt);
            await userModel.create({
                name: 'Client',
                email: 'client@food.com',
                password: hashedPassword,
                role: 'client'
            });
            console.log('Client user seeded (client@food.com / client123)');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedDB();
