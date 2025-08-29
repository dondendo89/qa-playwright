import prisma from './client';
async function main() {
    // Create a sample user
    const user = await prisma.user.create({
        data: {
            email: 'test@example.com',
            name: 'Test User',
        },
    });
    // Create a sample project associated with the user
    const project = await prisma.project.create({
        data: {
            name: 'Example Project',
            user: {
                connect: {
                    id: user.id,
                },
            },
        },
    });
    // Create a sample target associated with the project
    await prisma.target.create({
        data: {
            name: 'Example Website',
            url: 'https://example.com',
            project: {
                connect: {
                    id: project.id,
                },
            },
        },
    });
    console.log('Seed completed successfully');
}
main()
    .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
