# RBB

Este procedimento verifica que os programas foram instalados. A conectividade entre nós não está sendo verificada. 
​
## Conferindo a instalação feita no nó
​
Todos os nodes possuem uma estrutura similar, aparentemente armazenando arquivos relevantes em `/root/lacchain/`. Lá estão arquivos de configuração (incluindo genesis file), logs e arquivos de dados. Exemplo:
​
```shell
[root@vrt2059 ~]# ll /root/lacchain/
total 24
-rwxrwxr-x 1 root root  911 Sep 10 16:26 config.toml
dr--r----- 6 root root 4096 Sep 10 16:26 data
drwxr-xr-x 2 root root   25 Aug 18 16:39 health-check
dr--r----- 6 root root 4096 Sep 11 07:32 logs
-rwxrwxr-x 1 root root 3128 Jul 27 17:37 log.xml
drw-r--r-- 2 root root   24 Aug 10 16:53 nginx
dr--r----- 4 root root   75 Aug 10 16:53 orion
-rwxrwxr-x 1 root root   50 Jul 28 17:51 start-orion.sh
-rwxrwxr-x 1 root root  455 Aug 18 16:34 start-pantheon.sh
dr--r----- 2 root root   26 Jul 27 17:38 tmp
```

Verifique se o binário besu está armazenado em `/usr/local/besu/bin`.

​
Como pode ser notado, o serviço do Pantheon está rodando nessa máquina (writer node):
​
```shell
[root@vrt2059 ~]# systemctl status -n0 pantheon 
● pantheon.service - Ethereum Pantheon client
   Loaded: loaded (/usr/lib/systemd/system/pantheon.service; enabled; vendor preset: disabled)
   Active: active (running) since Thu 2020-09-10 16:26:36 -03; 1 day 1h ago
 Main PID: 4198 (start-pantheon.)
    Tasks: 66
   Memory: 687.9M (limit: 2.0G)
   CGroup: /system.slice/pantheon.service
           ├─4198 /bin/bash /root/lacchain/start-pantheon.sh
           └─4200 java -Dvertx.disableFileCPResolving=true -Dbesu.home=/usr/local/besu -Dlog4j.shutdownHookEnabled=false --add-opens java.base/sun.security.provider=ALL-UNNAMED --add-opens java.base/java.util...
```

​
O comando abaixo lista portas tcp e udp de processos java em execução:
​
```shell
❯ netstat -ltunp | grep java
tcp 0 0 0.0.0.0:60606 0.0.0.0:* LISTEN 129341/java
tcp 0 0 127.0.0.1:4545 0.0.0.0:* LISTEN 129341/java
tcp 0 0 127.0.0.1:4546 0.0.0.0:* LISTEN 129341/java
tcp 0 0 127.0.0.1:4547 0.0.0.0:* LISTEN 129341/java
udp 0 0 0.0.0.0:60606 0.0.0.0:* 129341/java
```

​
Existe também um container docker em cada node para coleta de dados para estatísticas:
​
```shell
[root@vrt2059 ~]# docker ps
CONTAINER ID        IMAGE                  COMMAND                  CREATED             STATUS              PORTS               NAMES
18898dbb8211        alethio/ethstats-cli   "./bin/ethstats-cli.…"   3 weeks ago         Up 4 minutes                            inspiring_murdock
```
​
