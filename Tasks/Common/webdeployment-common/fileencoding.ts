//File Encoding detected to be : utf-32be, which is not supported by Node.js
//'Unable to detect encoding of file ' + typeCode
//'File buffer is too short to detect encoding type'
var fs = require('fs');
import tl = require('vsts-task-lib');

function detectFileEncodingWithBOM(buffer: Buffer) {
    tl.debug('Detecting file encoding using BOM');
    if(buffer.slice(0,3).equals(new Buffer([239, 187, 191]))) {
        return ['utf-8', true];
    }
    else if(buffer.slice(0,4).equals(new Buffer([255, 254, 0, 0]))) {
        throw Error(tl.loc('EncodeNotSupported', 'UTF-32LE'));
    }
    else if(buffer.slice(0,2).equals(new Buffer([254, 255]))) {
        throw Error(tl.loc('EncodeNotSupported', 'UTF-16BE'));
    }
    else if(buffer.slice(0,2).equals(new Buffer([255, 254]))) {
        return ['utf-16le', true];
    }
    else if(buffer.slice(0,4).equals(new Buffer([0, 0, 254, 255]))) {
        throw Error(tl.loc('EncodeNotSupported', 'UTF-32BE'));
    }
    tl.debug('Unable to detect File encoding using BOM');
    return null;
}

function detectFileEncodingWithoutBOM(buffer: Buffer) {
    tl.debug('Detecting file encoding without BOM');
    if(buffer.length < 4) {
        throw Error('File buffer is too short to detect encoding type');
    }
    var typeCode = 0;
    for(var index = 0; index < 4; index++) {
        typeCode = typeCode << 1;
        typeCode = typeCode | (buffer[index] > 0 ? 1 : 0);
    }
    switch(typeCode) {
        case 1:
            throw Error(tl.loc('EncodeNotSupported', 'UTF-32BE'));
        case 5:
            throw Error(tl.loc('EncodeNotSupported', 'UTF-16BE'));
        case 8:
            throw Error(tl.loc('EncodeNotSupported', 'UTF-32LE'));
        case 10:
            return ['utf-16le', false];
        case 15:
            return ['utf-8', false];
        default:
            throw Error(tl.loc('UnknownFileEncodeError', typeCode));
    }
}
export function detectFileEncoding(buffer: Buffer) {
    if(buffer.length < 4) {
        throw Error('ShortFileBufferError');
    }
    var fileEncoding = detectFileEncodingWithBOM(buffer) || detectFileEncodingWithoutBOM(buffer);
    return fileEncoding;
}

