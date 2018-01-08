#!/usr/bin/env bash
# inspired by https://jamielinux.com/docs/openssl-certificate-authority/index.html

ROOT_DIR="./config/certificates"
CONF_DIR="./config/openssl"
mkdir -p $ROOT_DIR
mkdir -p $ROOT_DIR/{client,server,ca}

echo "###################################";
echo "#   ROOT CA CERTIFICATS           #";
echo "###################################";
ROOT_CA="$ROOT_DIR/ca"
CONF_DIR_CA="$CONF_DIR/ca"

mkdir -p $ROOT_CA/{certs,crl,newcerts,db,private}
#chmod 700 $ROOT_CA/private
touch $ROOT_CA/db/index.txt
touch $ROOT_CA/db/nodefony-ca.db
touch $ROOT_CA/db/nodefony-ca.db.attr
if [ ! -f $ROOT_CA/db/serial ]
then
	echo 1000 > $ROOT_CA/db/serial
fi

#  Create the root key
#Encrypt the root key with AES 256-bit encryption and a strong password.
#openssl genrsa -aes256 -out $ROOT_CA/private/ca.key.pem 4096
openssl genrsa \
  -out $ROOT_CA/private/ca.key.pem \
  4096
#chmod 400 $ROOT_CA/private/ca.key.pem

openssl req -config $CONF_DIR_CA/openssl.cnf \
      -key $ROOT_CA/private/ca.key.pem \
      -new -x509 -days 7300 -sha256 -extensions v3_ca \
      -out $ROOT_CA/certs/ca.cert.pem

openssl x509 -noout -text -in $ROOT_CA/certs/ca.cert.pem




echo "###################################";
echo "#   ROOT CERTIFICATS INTERMEDIATE #";
echo "###################################";
ROOT_CA_INTERMEDIATE="$ROOT_DIR/ca_intermediate"
CONF_DIR_INTERMEDIATE="$CONF_DIR/ca_intermediate"

mkdir -p $ROOT_CA_INTERMEDIATE
mkdir -p $ROOT_CA_INTERMEDIATE/{certs,crl,newcerts,db,private,csr}
#chmod 700 $ROOT_CA_INTERMEDIATE/private
touch $ROOT_CA_INTERMEDIATE/db/index.txt
touch $ROOT_CA_INTERMEDIATE/db/nodefony-ca.db
touch $ROOT_CA_INTERMEDIATE/db/nodefony-ca.db.attr
if [ ! -f $ROOT_CA_INTERMEDIATE/db/serial ]
then
	echo 1000 > $ROOT_CA_INTERMEDIATE/db/serial
fi
if [ ! -f $ROOT_CA_INTERMEDIATE/db/crlnumber ]
then
	echo 1000 > $ROOT_CA_INTERMEDIATE/db/crlnumber
fi

#  Create the root key
#Encrypt the root key with AES 256-bit encryption and a strong password.
#openssl genrsa -aes256 -out $ROOT_CA_INTERMEDIATE/private/intermediate.key.pem 4096
openssl genrsa \
  -out $ROOT_CA_INTERMEDIATE/private/intermediate.key.pem \
  4096
#chmod 400 $ROOT_CA_INTERMEDIATE/private/intermediate.key.pem

# certificate signing request
openssl req -config $CONF_DIR_INTERMEDIATE/openssl.cnf -new -sha256 \
      -key $ROOT_CA_INTERMEDIATE/private/intermediate.key.pem \
      -out $ROOT_CA_INTERMEDIATE/csr/intermediate.csr.pem

openssl ca -config $CONF_DIR_CA/openssl.cnf -batch -extensions v3_intermediate_ca \
      -days 3650 -notext -md sha256 \
      -in $ROOT_CA_INTERMEDIATE/csr/intermediate.csr.pem \
      -out $ROOT_CA_INTERMEDIATE/certs/intermediate.cert.pem

openssl x509 -noout -text \
      -in $ROOT_CA_INTERMEDIATE/certs/intermediate.cert.pem





echo "###########################################################";
echo "#   SIGN SERVER AND CLIENT CERTIFICATES WITH INTERMEDIATE #";
echo "###########################################################";

#  Create the root key
#Encrypt the root key with AES 256-bit encryption and a strong password.
#openssl genrsa -aes256  -out $ROOT_CA_INTERMEDIATE/private/nodefony.key.pem 2048
openssl genrsa \
  -out $ROOT_CA_INTERMEDIATE/private/nodefony.key.pem \
  2048
# chmod 400 $ROOT_CA_INTERMEDIATE/private/nodefony.key.pem


openssl req -config $CONF_DIR_INTERMEDIATE/openssl.cnf \
      -key $ROOT_CA_INTERMEDIATE/private/nodefony.key.pem \
      -new -sha256 -out $ROOT_CA_INTERMEDIATE/csr/nodefony.csr.pem

#Create  server a certificate
# sign the CSR
openssl ca -config $CONF_DIR_INTERMEDIATE/openssl.cnf -batch \
      -extensions server_cert -days 375 -notext -md sha256 \
      -in $ROOT_CA_INTERMEDIATE/csr/nodefony.csr.pem \
      -out $ROOT_CA_INTERMEDIATE/certs/server.nodefony.cert.pem
# chmod 444 $ROOT_CA_INTERMEDIATE/certs/server.nodefony.cert.pem

openssl x509 -noout -text \
	-in $ROOT_CA_INTERMEDIATE/certs/server.nodefony.cert.pem


# Create  client a certificate
# sign the CSR
openssl ca -config $CONF_DIR_INTERMEDIATE/openssl.cnf -batch \
      -extensions usr_cert -days 375 -notext -md sha256 \
      -in $ROOT_CA_INTERMEDIATE/csr/nodefony.csr.pem  \
      -out $ROOT_CA_INTERMEDIATE/certs/client.nodefony.cert.pem
# chmod 444 $ROOT_CA_INTERMEDIATE/certs/client.nodefony.cert.pem



echo "####################";
echo "#      COPY        #";
echo "####################";

# create fullchain
cat $ROOT_CA_INTERMEDIATE/certs/server.nodefony.cert.pem \
	$ROOT_CA_INTERMEDIATE/certs/intermediate.cert.pem \
	$ROOT_CA/certs/ca.cert.pem > $ROOT_CA_INTERMEDIATE/certs/ca-chain.cert.pem


# copy in directory ca
rsync -a $ROOT_CA/certs/ca.cert.pem $ROOT_DIR/ca/nodefony-root-ca.crt.pem
rsync -a $ROOT_CA/private/ca.key.pem $ROOT_DIR/ca/nodefony-root-ca.key.pem

# copy in directory client
# Create a public key
openssl rsa \
  -in $ROOT_CA_INTERMEDIATE/private/intermediate.key.pem \
  -pubout -out $ROOT_DIR/client/pubkey.pem
rsync -a $ROOT_CA/certs/ca.cert.pem $ROOT_DIR/client/chain.pem


# copy in directory server
rsync -a $ROOT_CA/certs/ca.cert.pem $ROOT_DIR/server/chain.pem
rsync -a $ROOT_CA_INTERMEDIATE/private/nodefony.key.pem $ROOT_DIR/server/privkey.pem
rsync -a $ROOT_CA_INTERMEDIATE/certs/server.nodefony.cert.pem $ROOT_DIR/server/cert.pem
rsync -a $ROOT_CA_INTERMEDIATE/certs/ca-chain.cert.pem $ROOT_DIR/server/fullchain.pem


echo "####################";
echo "#       VERIFY     #";
echo "####################";

openssl x509 -noout -text \
      -in $ROOT_CA_INTERMEDIATE/certs/ca-chain.cert.pem


# verify server
openssl verify -CAfile $ROOT_CA_INTERMEDIATE/certs/ca-chain.cert.pem \
      $ROOT_CA_INTERMEDIATE/certs/server.nodefony.cert.pem

# verify server
openssl verify -CAfile $ROOT_CA_INTERMEDIATE/certs/ca-chain.cert.pem \
      $ROOT_CA_INTERMEDIATE/certs/client.nodefony.cert.pem

openssl rsa -noout -modulus -in $ROOT_DIR/server/privkey.pem
openssl req -noout -modulus -in $ROOT_CA_INTERMEDIATE/csr/nodefony.csr.pem
openssl x509 -noout -modulus -in $ROOT_DIR/server/fullchain.pem

echo "####################";
echo "#       HAPROXY    #";
echo "####################";

cat $ROOT_DIR/server/fullchain.pem $ROOT_DIR/server/privkey.pem > $ROOT_DIR/server/haproxy.pem
