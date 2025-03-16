import * as crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Database } from './apps/web/src/database.types';

const supabase = createClient<Database>('https://fvwhnhwnpjwtnrvqcgpf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2d2huaHducGp3dG5ydnFjZ3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4ODUyODIsImV4cCI6MjA1NzQ2MTI4Mn0.YdJ10AYuISq3THlal4OTdz_XVrYHFUYN3-pBWYmVqhc')

const getColor = (status: number) => {
    if (status >= 200 && status < 300) return '\u001b[32m' // green
    if (status >= 300 && status < 400) return '\u001b[33m' // yellow
    if (status >= 400 && status < 500) return '\u001b[31m' // red
    return '\u001b[34m'
}

const BASE36_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';

function encodeBase36(value: number): string {
    if (value === 0) {
        return '0';
    }
    let result = '';
    while (value > 0) {
        result = BASE36_CHARS.charAt(value % 36) + result;
        value = Math.floor(value / 36);
    }
    return result.padStart(8, '0');
}

function getMachineFingerprint(): string {
    try {
        const hostname = require('os').hostname();
        const hash = crypto.createHash('md5').update(hostname).digest('hex');
        return hash.substring(0, 4);
    } catch (error) {
        return '0000';
    }
}

function getRandomString(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += BASE36_CHARS.charAt(Math.floor(Math.random() * BASE36_CHARS.length));
    }
    return result;
}

function generateCUID(): string {
    const timestamp = Date.now();

    let counter = 0;
    let lastTimestamp = 0;

    if (timestamp === lastTimestamp) {
        counter++;
    } else {
        lastTimestamp = timestamp;
        counter = 0;
    }

    const timestampBase36 = encodeBase36(timestamp);
    const counterBase36 = encodeBase36(counter);
    const fingerprint = getMachineFingerprint();
    const randomString = getRandomString(4);

    return `c${timestampBase36}${counterBase36}${fingerprint}${randomString}`;
}

// Example usage
// console.log(`\u001b[34m${generateCUID()}\u001b[0m`);

(async () => {
    const { error, data } = await supabase.from('servers').insert([
        {
            name: 'ankaralilar 06',
            created_at: new Date().toISOString(),
            owner_id: 3,
            default_channel_id: 1,
        }
    ])
    console.log('error: ', error)
    console.log('data: ', data)
})()