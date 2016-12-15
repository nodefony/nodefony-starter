#!/bin/bash
FQDN="localhost"

if [ -n "$1" ]
then
	FQDN="$1"	
fi
echo "NODEFONY GENERATE CERTIFICATES CN : ${FQDN}" 

# make directories to work from
mkdir -p ./config/certificates/{server,client,ca}

# Create your very own Root Certificate Authority
openssl genrsa \
  -out ./config/certificates/ca/nodefony-root-ca.key.pem \
  2048

# Self-sign your Root Certificate Authority
# Since this is private, the details can be as bogus as you like
openssl req \
  -x509 \
  -new \
  -nodes \
  -key ./config/certificates/ca/nodefony-root-ca.key.pem \
  -days 1024 \
  -out ./config/certificates/ca/nodefony-root-ca.crt.pem \
  -subj "/C=FR/ST=Bdr/L=Marseille/O=Nodefony Signing Authority /CN=nodefony.com"

# Create a Device Certificate for each domain,
# such as example.com, *.example.com, awesome.example.com
# NOTE: You MUST match CN to the domain name or ip address you want to use
openssl genrsa \
  -out ./config/certificates/server/privkey.pem \
  2048

# Create a request from your Device, which your Root CA will sign
openssl req -new \
  -key ./config/certificates/server/privkey.pem \
  -out ./tmp/csr.pem \
  -subj "/C=FR/ST=Bdr/L=Marseille/O=Nodefony/CN=${FQDN}/subjectAltName=IP.1=127.0.0.1"

# Sign the request from Device with your Root CA
# -CAserial ./config/certificates/ca/nodefony-root-ca.srl
openssl x509 \
  -req -in ./tmp/csr.pem \
  -CA ./config/certificates/ca/nodefony-root-ca.crt.pem \
  -CAkey ./config/certificates/ca/nodefony-root-ca.key.pem \
  -CAcreateserial \
  -out ./config/certificates/server/cert.pem \
  -days 3650

# Create a public key, for funzies
# see https://gist.github.com/coolaj86/f6f36efce2821dfb046d
openssl rsa \
  -in ./config/certificates/server/privkey.pem \
  -pubout -out ./config/certificates/client/pubkey.pem

# Put things in their proper place
rsync -a ./config/certificates/ca/nodefony-root-ca.crt.pem ./config/certificates/server/chain.pem
rsync -a ./config/certificates/ca/nodefony-root-ca.crt.pem ./config/certificates/client/chain.pem
cat ./config/certificates/server/cert.pem ./config/certificates/server/chain.pem > ./config/certificates/server/fullchain.pem


