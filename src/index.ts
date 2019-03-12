import { Client } from 'discord.js';

const client = new Client();

console.log(test(1, 2));

function test(x: { a: number; b: string; x: Client; z: number }, y): string {
  return x + y;
}
