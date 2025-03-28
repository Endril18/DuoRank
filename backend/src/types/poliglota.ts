import { Poliglota } from "@prisma/client";

export type DadosDuolingo = Omit<Poliglota, 'id'>;
