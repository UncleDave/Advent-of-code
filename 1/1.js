import { getLinesFromFile } from "../utils";

const input = await getLinesFromFile('1/input.txt')

const result = input.map(Number).reduce((largerCount, x, i, all) => {
    if (i === 0) return largerCount

    if (x > all[i - 1]) return largerCount + 1

    return largerCount
}, 0)

console.log(result)