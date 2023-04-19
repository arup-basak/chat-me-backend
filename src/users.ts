import sqlite from 'sqlite3';

const db = new sqlite.Database('db.sqlite3');

const TABLE_NAME = 'USERS';

db.run(`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
    USERNAME TEXT UNIQUE,
    PASSWORD TEXT
);`);

export const createUser = (username: string, password: string): boolean => {
    try {
        db.run(`INSERT INTO ${TABLE_NAME}
         (USERNAME, PASSWORD)
         VALUES ('${username}', '${password}')`);
        return true;
    } catch {
        return false;
    }
};

export const checkPass = (username: string, password: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT PASSWORD FROM ${TABLE_NAME} WHERE USERNAME = ?`;
        db.get(sql, [username], (err, row: {PASSWORD: string}) => {
            if (err) {
                reject(err);
            } else if (row && row.PASSWORD === password) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

