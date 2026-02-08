import { Prisma, PrismaClient } from "@prisma/client";
import  bcrypt  from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('123456', 12)

    await prisma.user.upsert({
        where: {email: 'admin@sitema.com'},
        update: {},
        create:{
            email: 'admin@sistema.com',
            name: 'adminstrador padrão',
            password,
        },
    });

    console.log('Banco populado com sucesso');
    
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });