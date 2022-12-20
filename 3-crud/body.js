'use strict';

const bodyParser = async (req) => {
    const buffer = [];
    for await (const chunk of req) buffer.push(chunk);
    const data = Buffer.concat(buffer).toString();
    return data ? JSON.parse(data) : {};
};

module.exports = bodyParser;
