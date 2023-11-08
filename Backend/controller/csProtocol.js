const ip = require('ip');

const server = "Don2512"

const createDataPacket = async (type,  hostname , data = "") =>{
    return createData("10", type, "c-s", ip.address(), hostname, data)
    // type = 101 -> xác thực mật khẩu
    // type = 102 -> xác thực đúng
    // type = 103 -> xác thực fail

    // type = 201 -> fetch file, data = fname
    // type = 202 -> fname true, data = hostname
    // type = 203 -> fname fail
    // type = 204 -> lưu name mới tải về

    // type = 301 -> publish lname fname, data = fname
    // type = 303 -> true, data = hostname
    // type = 302 -> fail name đã tồn tại
    

    // type = 401 -> tải từ clinet
}


// Hàm để đóng gói dữ liệu
function createData(version, type, communicationType, host, userAgent, data) {
    const versionBuffer = Buffer.alloc(2);
    versionBuffer.writeUInt16BE(version);

    const typeBuffer = Buffer.alloc(3);
    typeBuffer.write(type, 'utf8');

    const communicationTypeBuffer = Buffer.alloc(3);
    communicationTypeBuffer.write(communicationType, 'utf8');

    const hostBuffer = Buffer.alloc(255);
    hostBuffer.write(host, 'utf8');

    const userAgentBuffer = Buffer.alloc(255);
    userAgentBuffer.write(userAgent, 'utf8');

    const dataBuffer = Buffer.from(data, 'utf8');

    const packet = Buffer.concat([versionBuffer, typeBuffer, communicationTypeBuffer, hostBuffer, userAgentBuffer, dataBuffer]);
    return packet;
}


const decryption = async (data) => {
    // Xử lý dữ liệu được gửi từ client
    const version = data.slice(0, 2).readUInt16BE(); // Đọc 2 byte cho version
    const type = int(data.slice(2, 5)); // Đọc 3 byte cho loại
    const communicationType = data.slice(5, 8).toString('utf8'); // Đọc 3 byte cho giao tiếp C-C hoặc C-S
    const host = data.slice(8, 263).toString('utf8'); // Đọc 255 byte cho Host
    const userAgent = data.slice(263, 518).toString('utf8'); // Đọc 255 byte cho User-Agent
    const payload = data.slice(518); // Phần dữ liệu còn lại

    return {
        "version": version,
        "type": type,
        "CommuicationType": communicationType,
        "host" : host,
        "userAgent" : userAgent,
        "data" : payload
    }

}