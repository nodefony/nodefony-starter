# vault-bundles



# Docker

## Running Vault for Development

``` bash
$ docker run --cap-add=IPC_LOCK -d --name=dev-vault -p 8200:8200  vault
```
This runs a completely in-memory Vault server, which is useful for development but should not be used in production.

When running in development mode, two additional options can be set via environment variables:

VAULT_DEV_ROOT_TOKEN_ID: This sets the ID of the initial generated root token to the given value
VAULT_DEV_LISTEN_ADDRESS: This sets the IP:port of the development server listener (defaults to 0.0.0.0:8200)

As an example:
``` bash
$ docker run --cap-add=IPC_LOCK -e 'VAULT_DEV_ROOT_TOKEN_ID=myroot' -e 'VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:1234' vault
```


# Running Vault in Server Mode

``` bash
$ docker run --cap-add=IPC_LOCK -e 'VAULT_LOCAL_CONFIG={"backend": {"file": {"path": "/vault/file"}}, "default_lease_ttl": "168h", "max_lease_ttl": "720h"}' vault server
```

This runs a Vault server using the file storage backend at path /vault/file, with a default secret lease duration of one week and a maximum of 30 days.

Note the --cap-add=IPC_LOCK: this is required in order for Vault to lock memory, which prevents it from being swapped to disk. This is highly recommended. In a non-development environment, if you do not wish to use this functionality, you must add "disable_mlock: true" to the configuration information.

At startup, the server will read configuration HCL and JSON files from /vault/config (any information passed into VAULT_LOCAL_CONFIG is written into local.json in this directory and read as part of reading the directory for configuration files). Please see Vault's configuration documentation for a full list of options.

Since 0.6.3 this container also supports the VAULT_REDIRECT_INTERFACE and VAULT_CLUSTER_INTERFACE environment variables. If set, the IP addresses used for the redirect and cluster addresses in Vault's configuration will be the address of the named interface inside the container (e.g. eth0).
