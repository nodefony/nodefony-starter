const deepEqual = (object1, object2) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      areObjects && !deepEqual(val1, val2) ||
      !areObjects && val1 !== val2
    ) {
      return false;
    }
  }
  return true;
}
const isObject = (object) => {
  return object != null && typeof object === 'object';
}



module.exports = class vault extends nodefony.Service {

  constructor(container) {
    super("vault", container);
    this.auditpath = this.kernel.tmpDir.path;
    this.vault = null
    this.vaultApp = null
    if (this.kernel.ready) {
      try {
        this.initialize()
          .catch(e => {
            this.log(e.message, "ERROR")
          })
      } catch (e) {
        this.log(e.message, "ERROR")
      }
    } else {
      this.kernel.prependOnceListener('onBoot', () => {
        try {
          return this.initialize()
            .catch(e => {
              this.log(e.message, "ERROR")
            })
        } catch (e) {
          this.log(e, "ERROR")
        }
      });
    }
  }

  async initialize() {
    try {
      this.options = this.bundle.settings.vault
      this.config = this.options.config
      if (!this.options.active) {
        return
      }
      if (this.options.getCredentialsApprole && typeof this.options.getCredentialsApprole === 'function') {
        return await this.options.getCredentialsApprole()
          .then(({
            role_id,
            secret_id
          }) => {
            this.log(`Load {role_id, secret_id} Credentials vault Approle (async method)`, "INFO", "getCredentialsApprole")
            if (role_id && secret_id) {
              this.roleId = role_id;
              this.secretId = secret_id;
              return {
                role_id,
                secret_id
              }
            }
            throw new nodefony.Error(`getCredentialsApprole Bad Vault approle role_id secret_id `, 400)
          })
          .catch(e => {
            this.log(e, `ERROR`)
            this.kernel.terminate(e.code || -1)
          })
      } else {
        this.vault = await require("node-vault")(this.options.connect);
        //this.vaultStatus = await this.status();
        if (this.options.prepareAuth) {
          return await this.prepareAuth();
        }
      }
    } catch (e) {
      throw e
    }
  }

  async prepareAuth() {
    try {
      this.log(`Prepare Vault Service`);
      //add mount point
      await this.createInitialMount();
      // policy
      await this.nodefonyPolicy();
      // creer auth approle
      return await this.auth();
    } catch (e) {
      throw e
    }

  }

  createInitialMount() {
    return this.vault.mounts()
      .then((results) => {
        if (results.hasOwnProperty(`${this.config.mount.path}/`)) {
          this.log(`Initial mount path ${this.config.mount.path} already exist`);
          return results[`${this.config.mount.path}/`];
        }
        return this.vault.mount({
            mount_point: this.config.mount.path,
            type: 'kv',
            description: 'Nodefony Secret Storage',
            options: {
              version: "2"
            }
          })
          .then((res) => {
            this.log(`Create  Initial mount path: ${this.config.mount.path}`);
            return res
          })
      })
      .catch((err) => {
        throw err
      });
  }

  nodefonyPolicy() {
    return this.vault.policies()
      .then((results) => {
        if (results.policies.includes(`${this.config.policy.name}`)) {
          this.log(`Initial nodefonyPolicy : ${this.config.policy.name} already exist`);
          return results;
        }
        return this.vault.addPolicy(this.config.policy)
          .then((res) => {
            this.log(`Create Initial nodefony policy : ${this.config.policy.name}`)
            return res
          })
          .catch(e => {
            this.log(`addPolicy nodefony ${this.config.policy.name} : ${e.message}`, "ERROR")
            throw e
          })
      })
      .then(() => {
        return this.vault.getPolicy({
            name: this.config.policy.name
          })
          .catch(e => {
            this.log(`getPolicy nodefony ${this.config.policy.name} : ${e.message}`, "ERROR")
            throw e
          })
      })
      .then(this.vault.policies)
      .then((result) => {
        return result
      })
      .catch((err) => {
        this.log(`nodefonyPolicy ${err.message}`, 'ERROR')
        throw err
      });
  }

  auth() {
    let exist = false
    return this.vault.auths()
      .then((result) => {
        if (result.hasOwnProperty(`${this.config.auths.approle.mountPoint}/`)) {
          exist = true
          this.log(`enableAuth vault nodefony authentication approle : ${this.config.auths.approle.mountPoint} already exist`)
          return result;
        }
        return this.vault.enableAuth({
            mount_point: `${this.config.auths.approle.mountPoint}`,
            type: 'approle',
            description: 'Approle auth Nodefony',
          })
          .then(() => {
            this.log(`Create enableAuth vault nodefony authentication approle : ${this.config.auths.approle.mountPoint}`)
            return result
          })
          .catch(e => {
            this.log(`Create enableAuth vault nodefony authentication approle : ${this.config.auths.approle.mountPoint}`, "ERROR")
            throw e
          })
      })
      .then((result) => {
        if (exist) {
          return result;
        }
        return this.vault.addApproleRole({
            mount_point: `${this.config.auths.approle.mountPoint}`,
            role_name: this.config.auths.approle.roleName,
            policies: this.config.policy.name
          })
          .catch(e => {
            this.log(`ApproleRole vault nodefony authentication approle : ${this.config.auths.approle.mountPoint}`, "ERROR")
            throw e
          })
      })
      .then(() => {
        this.log(`Get vault addApproleRole auth credentials ...`)
        return Promise.all([this.vault.getApproleRoleId({
            mount_point: `${this.config.auths.approle.mountPoint}`,
            role_name: this.config.auths.approle.roleName
          }),
          this.vault.getApproleRoleSecret({
            mount_point: `${this.config.auths.approle.mountPoint}`,
            role_name: this.config.auths.approle.roleName
          })
        ])
      })
      .then((result) => {
        this.log(`Get vault nodefony auth credentials (id, secret) roled: ${this.config.auths.approle.roleName} ok`)
        this.roleId = result[0].data.role_id;
        this.secretId = result[1].data.secret_id;
        return this.login(this.options.connect.endpoint, true);
      })
      .catch((err) => {
        throw err;
      });
  }

  async login(endpoint = this.options.connect.endpoint, init = false, vault = null) {
    this.log(`Authentication vault approleLogin  server : ${this.options.connect.endpoint}`)
    let engine = this.vaultApp || vault
    if (!engine) {
      this.vaultApp = await require("node-vault")({
        apiVersion: 'v1',
        endpoint: endpoint
      });
      engine = this.vaultApp
    }
    return engine.approleLogin({
        role_id: this.roleId,
        secret_id: this.secretId,
        mount_point: `${this.config.auths.approle.mountPoint}`,
      })
      .then(async (res) => {
        if (init) {
          this.log(`Add secrets config`);
          await this.initializeSecrets(engine)
          this.log(`Prepare  vault config ok`)
        }
        return engine
      })
      .catch((err) => {
        throw err
      })
  }

  status() {
    return this.vault.status()
      .then((status) => {
        return status
      })
      .catch((err) => {
        this.log(err, "ERROR")
      })
  }

  addSecret(secret, vault = null, options = {}) {
    const engine = vault || this.vaultApp;
    if (!engine) {
      throw new Error(`Vault not ready login before`)
    }
    this.log(`Add Secret : ${secret.path}`)
    let kv = nodefony.extend(true, options, {
      data: secret.data
    })
    return engine.write(secret.path, kv)
      .then(() => {
        return this.vault.read(secret.path)
      })
      .then((res) => {
        //return engine.delete(secret.path)
        this.log(`Add secret path : ${secret.path}`)
        return res
      })
      .catch((error) => {
        this.log(error, "ERROR")
        throw error
      });
  }

  getSecret(secret, vault, options = {}) {
    const engine = vault || this.vaultApp;
    if (!engine) {
      throw new Error(`Vault not ready login before`)
    }
    this.log(`Get Secret : ${secret.path}`)
    return engine.read(secret.path)
      .then((res) => {
        return res
      })
      .catch((error) => {
        if (error.response) {
          throw error.response
        }
        throw error
      });
  }

  async initializeSecrets(vault = null) {
    this.log(`Prepare vault secrets  Development config`)
    for await (const secret of this.config.secrets) {
      try {
        const oldSecret = await this.getSecret({
            path: secret.path
          })
          .catch(e => {
            return null
          })
        let res = null
        if (oldSecret) {
          res = deepEqual(secret.data, oldSecret.data.data)
        }
        if (res) {
          this.log(`Secret : ${secret.path} already Exist`)
          continue
        }
        await this.addSecret(secret, vault)
          .catch(e => {
            this.log(e, "ERROR")
          })
      } catch (e) {
        this.log(e.response || e, "ERROR")
        throw e
      }
    }
  }

  /*test() {
    return this.vault.write('secret/data/cci', {
        value: 'world',
        lease: '10h',
        data: {
          foo: "bar"
        }
      })
      .then(() => {
        return this.vault.read('secret/data/cci')
      })
      .then(() => this.vault.delete('secret/data/cci'))
      .catch((error) => {
        console.log(error.response)
        this.log(error, "ERROR")
      });
  }
  mount() {
    return this.vault.mounts()
      .then(() => this.vault.mount({
        mount_point: 'test',
        type: 'generic',
        description: 'just a test'
      }))
      .then(() => this.vault.write('test/hello', {
        value: 'world',
        lease: '1h'
      }))
      .then(() => vault.remount({
        from: 'test',
        to: 'test2'
      }))
      .then(() => this.vault.read('test2/hello'))
      .then((ele) => {
        console.log(ele)
        return ele
      })
      .then(() => this.vault.unmount({
        mount_point: 'test2'
      }))
      .catch((err) => {
        console.log(err)
        this.log(err, "ERROR")
      });
  }

  audit() {
    process.env.DEBUG = 'node-vault'
    return this.vault.audits()
      .then((result) => {
        if (result.hasOwnProperty('testlog/')) {
          return undefined;
        }
        return this.vault.enableAudit({
          name: 'testlog',
          type: 'file',
          options: {
            path: this.path
          }
        });
      })
      .then(() => this.vault.write('secret/data/hello', {
        value: 'world',
        lease: '1s'
      }))
      .then(() => this.vault.read('secret/data/hello'))
      .then(() => this.vault.delete('secret/data/hello'))
      .then(() => this.vault.disableAudit({
        name: 'testlog'
      }))
      .catch((err) => console.error(err.message));
  }*/
};
