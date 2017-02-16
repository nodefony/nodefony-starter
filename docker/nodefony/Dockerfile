FROM  node:6.9
 MAINTAINER Christophe CAMENSULI <ccamensuli@gmail.com>
 RUN apt-get update
 RUN apt-get -y install vim
 RUN apt-get -y install curl
 RUN apt-get -y install rsync
 RUN apt-get -y install sqlite3
 RUN apt-get -y install git
 RUN apt-get -y install mariadb-client-10.0

 RUN git clone https://github.com/nodefony/nodefony.git


 WORKDIR /nodefony
 RUN git checkout dev
 
# COPY /nodefony/docker/config/config.yml /nodefony/config/config.yml
# COPY /nodefony/docker/config/pm2.json /nodefony/config/pm2.json
# COPY /nodefony/docker/app/config/config.yml /nodefony/app/config/config.yml

 RUN make docker-build

 EXPOSE 5151 5152

