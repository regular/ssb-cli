#!/usr/bin/env node
const { join, resolve } = require("path");
const debug = require("debug")("tre-cli");
const { loadSync } = require("ssb-keys");
const client = require("ssb-zero-conf-client");
const inject = require("./inject");

const conf = require("rc")("tre");

function bail(err) {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
}

const configPath = conf.config;
if (!configPath) {
  bail(new Error(".trerc not found, use --config CONFIG"));
}
const ssbPath = conf.path || resolve(join(configPath, "../.tre"));
debug("datapath: %s", ssbPath);
const netKey = conf.caps.shs;
console.error("netKey: %s", netKey);
const keys = loadSync(join(ssbPath, "secret"));
console.error("id: %s", keys.id);

function clientPromise() {
  return new Promise((resolve, reject) => {
    client(netKey, keys, (err, ssb, opts) => {
      if (err) return reject(err);
      console.error("Connected to %s", opts.remote);
      resolve(ssb);
    });
  });
}

inject(clientPromise);
