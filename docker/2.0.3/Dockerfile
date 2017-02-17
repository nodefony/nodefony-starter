FROM  node:6.9

 LABEL maintainer "Christophe CAMENSULI <ccamensuli@gmail.com>"
 LABEL net.nodefony.version="2.0.3"

 RUN apt-get update
 RUN apt-get -y install vim
 RUN apt-get -y install curl
 RUN apt-get -y install rsync
 RUN apt-get -y install sqlite3
 RUN apt-get -y install git
 RUN apt-get -y install mariadb-client-10.0

 RUN mkdir /docker
 COPY ["app", "bundles/", "config", "/docker/"]   
 COPY entrypoint.sh /usr/local/bin/
 

 RUN git clone https://github.com/nodefony/nodefony.git

 WORKDIR /nodefony
 RUN git branch --track origin/dev
 RUN git checkout dev

 RUN make docker-build

 EXPOSE 5151 5152 1315 1316 1318

 ENV "NODEFONY_ENVIRONMENT" "dev"
 ENTRYPOINT ["entrypoint.sh"]

