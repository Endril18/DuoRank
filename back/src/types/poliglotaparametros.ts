export interface PoliglotaCreateParams {
    nome: string;
    idiomas: string;
    xp?: number;
    ofensiva?: number;
    ultimaAtividade?: Date | null;
}