import zlib from "zlib";

let message = {
  some: "data",
};
let payload = Buffer.from(JSON.stringify(message));

for (var i = 0; i < 30000; ++i) {
  zlib.deflate(payload, function (err, buffer) {});
}

setTimeout(() => {}, 2000000);
