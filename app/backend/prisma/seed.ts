import { PrismaClient, Status } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const NOMES = [
  'Ana Silva', 'Bruno Santos', 'Carla Oliveira', 'Daniel Costa',
  'Elena Martins', 'Felipe Souza', 'Gabriela Lima', 'Henrique Alves',
  'Isabela Rocha', 'João Pereira', 'Larissa Dias', 'Marcos Ferreira',
  'Natália Ribeiro', 'Otávio Nunes', 'Patrícia Mendes', 'Rafael Cardoso',
  'Sandra Gomes', 'Thiago Castro', 'Vanessa Pinto', 'Walter Barbosa',
];

const SOBRENOMES_EMAIL = ['silva', 'santos', 'oliveira', 'costa', 'martins', 'souza', 'lima', 'alves', 'rocha', 'pereira'];

const STATUS: Status[] = ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO'];

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack: number): Date {
  const now = new Date();
  const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

function randomPhone(): string {
  const ddd = 10 + Math.floor(Math.random() * 90);
  const n = String(Math.floor(Math.random() * 900000000) + 100000000);
  return `(${ddd}) ${n.slice(0, 5)}-${n.slice(5)}`;
}

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lab.local' },
    update: {},
    create: {
      email: 'admin@lab.local',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('Admin criado:', admin.email);

  const count = 25;
  for (let i = 0; i < count; i++) {
    const nome = randomItem(NOMES);
    const base = nome.toLowerCase().replace(/\s+/, '.');
    const email = `${base}.${i}@exemplo.com`;
    const telefone = randomPhone();
    const status = randomItem(STATUS);
    const createdAt = randomDate(60);

    await prisma.registro.create({
      data: {
        nome,
        email,
        telefone,
        status,
        ownerId: admin.id,
        createdAt,
      },
    });
  }
  console.log(`${count} registros aleatórios criados.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
