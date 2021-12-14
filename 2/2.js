import { getLinesFromFile } from "../utils";

const input = await getLinesFromFile("2/input.txt");

const finalPosition = input
    .map(x => x.split(' '))
    .map(([instruction, power]) => [instruction, Number(power)])
    .reduce(([h, d, a], [instruction, power]) => {
        switch (instruction) {
            case 'forward': return [h + power, d + a * power, a]
            case 'up': return [h, d, a - power]
            case 'down': return [h, d, a + power]
        }
    }, [0, 0, 0])

const result = finalPosition[0] * finalPosition[1]

console.log(result)