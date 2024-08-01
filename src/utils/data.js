const STATUS_ON_DECK = { id: 1, name: "À fazer", color: "blue.300" };
const STATUS_IN_PROGRESS = {
    id: 2,
    name: "Andamento",
    color: "yellow.400",
};
const STATUS_TESTING = { id: 3, name: "Testando", color: "pink.300" };
const STATUS_DEPLOYED = { id: 4, name: "Concluído", color: "green.300" };
export const STATUSES = [
    STATUS_ON_DECK,
    STATUS_IN_PROGRESS,
    STATUS_TESTING,
    STATUS_DEPLOYED,
];

const DATA = [
    {
        task: "Criar nova ferramenta",
        status: STATUS_IN_PROGRESS,
        due: new Date("2024/01/01"),
        notes: "Inicio da operação",
    },
    {
        task: "Estudos de tecnologia",
        status: STATUS_IN_PROGRESS,
        due: null,
        notes: "Usando Next com Flowbite",
    },
    {
        task: "Integração com a API",
        status: STATUS_IN_PROGRESS,
        due: null,
        notes: "Andamento",
    },

];

export default DATA;
