const recintos = [
    { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [{ especie: 'macaco', quantidade: 3, tamanho: 1 }] },
    { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
    { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: [{ especie: 'gazela', quantidade: 1, tamanho: 2 }] },
    { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
    { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [{ especie: 'leao', quantidade: 1, tamanho: 3 }] }
];

const animais = {   
    LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
    LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
    CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
    MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
    GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
    HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
};
class RecintosZoo {
    analisaRecintos(animalNome, quantidade) {
        const animal = animais[animalNome.toUpperCase()];
        if (!animal) return { erro: "Animal inválido" };
        if (quantidade <= 0 || !Number.isInteger(quantidade)) return { erro: "Quantidade inválida" };

        const recintosViaveis = recintos.filter(recinto => {
            let espacoOcupadoAtual = 0;
            recinto.animaisExistentes.forEach(a => {
                espacoOcupadoAtual += a.quantidade * a.tamanho;
            });
            const espacoDisponivel = recinto.tamanhoTotal - espacoOcupadoAtual;

            const biomasRecinto = recinto.bioma.split(' e ');
            if (!biomasRecinto.some(bioma => animal.biomas.includes(bioma))) {
                return false;
            }

            const espacoExtra = (recinto.animaisExistentes.length > 0 && !recinto.animaisExistentes.some(a => a.especie === animalNome.toLowerCase())) ? 1 : 0;
            const espacoNecessario = (quantidade * animal.tamanho) + espacoExtra;

            if (espacoDisponivel < espacoNecessario) return false;

            if (animal.carnivoro && recinto.animaisExistentes.some(a => a.especie !== animalNome.toLowerCase())) {
                return false;
            }

            if (animalNome.toUpperCase() === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && recinto.animaisExistentes.length > 0) {
                return false;
            }

            if (animalNome.toUpperCase() === 'MACACO' && quantidade === 1 && recinto.animaisExistentes.length === 0) {
                return false;
            }

            for (let a of recinto.animaisExistentes) {
                const especieExistente = animais[a.especie.toUpperCase()];
                if (especieExistente.carnivoro && animalNome.toLowerCase() !== a.especie) {
                    return false;
                }
            }

            return true;
        });

        if (recintosViaveis.length === 0) return { erro: "Não há recinto viável" };

        recintosViaveis.sort((a, b) => a.numero - b.numero);

        const resultado = recintosViaveis.map(recinto => {
            let espacoOcupadoAtual = 0;
            recinto.animaisExistentes.forEach(a => {
                espacoOcupadoAtual += a.quantidade * a.tamanho;
            });
            const espacoExtra = (recinto.animaisExistentes.length > 0 && !recinto.animaisExistentes.some(a => a.especie === animalNome.toLowerCase())) ? 1 : 0;
            const espacoLivre = recinto.tamanhoTotal - (espacoOcupadoAtual + (quantidade * animal.tamanho) + espacoExtra);
            return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
        });

        return { recintosViaveis: resultado };
    }
}

export { RecintosZoo as RecintosZoo };
