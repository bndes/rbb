# RBB
​
## Navegando por um nó já instalado
​
Todos os nodes possuem uma estrutura similar, aparentemente armazenando todos arquivos relevantes, inclusive scripts, em `/root/lacchain/`, exemplo:
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
​
Como pode ser notado, existem 2 serviços nessa máquina (writer node):
​
```shell
[root@vrt2059 ~]# systemctl status -n0 pantheon orion 
● pantheon.service - Ethereum Pantheon client
   Loaded: loaded (/usr/lib/systemd/system/pantheon.service; enabled; vendor preset: disabled)
   Active: active (running) since Thu 2020-09-10 16:26:36 -03; 1 day 1h ago
 Main PID: 4198 (start-pantheon.)
    Tasks: 66
   Memory: 687.9M (limit: 2.0G)
   CGroup: /system.slice/pantheon.service
           ├─4198 /bin/bash /root/lacchain/start-pantheon.sh
           └─4200 java -Dvertx.disableFileCPResolving=true -Dbesu.home=/usr/local/besu -Dlog4j.shutdownHookEnabled=false --add-opens java.base/sun.security.provider=ALL-UNNAMED --add-opens java.base/java.util...
​
● orion.service - Orion client
   Loaded: loaded (/usr/lib/systemd/system/orion.service; enabled; vendor preset: disabled)
   Active: active (running) since Tue 2020-08-18 16:39:58 -03; 3 weeks 3 days ago
 Main PID: 91861 (start-orion.sh)
    Tasks: 28
   Memory: 209.5M (limit: 2.0G)
   CGroup: /system.slice/orion.service
           ├─91861 /bin/bash /root/lacchain/start-orion.sh
           └─91862 java -Dvertx.disableFileCPResolving=true -Dvertx.logger-delegate-factory-class-name=io.vertx.core.logging.Log4j2LogDelegateFactory -classpath /usr/local/orion/lib/orion-1.5.2.jar:/usr/local...
```
​
E cada node escuta em portas diferentes, de acordo com os serviços em execução:
​
```shell
❯ echo -n vrt{2056..2059}.bndes.net | xargs -rn1 -d' ' -I{} -P3 ssh -qxtt {} sudo netstat -ltnp |  grep -Pv '(dsmc|zabbix|rpc)'
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1008/sshd           
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      1271/master         
tcp        0      0 0.0.0.0:60606           0.0.0.0:*               LISTEN      126074/java         
tcp        0      0 127.0.0.1:4545          0.0.0.0:*               LISTEN      126074/java         
tcp        0      0 127.0.0.1:4546          0.0.0.0:*               LISTEN      126074/java         
tcp        0      0 127.0.0.1:4547          0.0.0.0:*               LISTEN      126074/java         
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1004/sshd           
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      1267/master         
tcp        0      0 0.0.0.0:60606           0.0.0.0:*               LISTEN      111200/java         
tcp        0      0 127.0.0.1:4545          0.0.0.0:*               LISTEN      111200/java         
tcp        0      0 127.0.0.1:4546          0.0.0.0:*               LISTEN      111200/java         
tcp        0      0 127.0.0.1:4547          0.0.0.0:*               LISTEN      111200/java         
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1036/sshd           
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      1297/master         
tcp        0      0 0.0.0.0:60606           0.0.0.0:*               LISTEN      48571/java          
tcp        0      0 127.0.0.1:4545          0.0.0.0:*               LISTEN      48571/java          
tcp        0      0 127.0.0.1:4546          0.0.0.0:*               LISTEN      48571/java          
tcp        0      0 127.0.0.1:4547          0.0.0.0:*               LISTEN      48571/java          
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:4040            0.0.0.0:*               LISTEN      91862/java          
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1032/sshd           
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      1286/master         
tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN      89964/nginx: master 
tcp        0      0 127.0.0.1:4444          0.0.0.0:*               LISTEN      91862/java          
tcp        0      0 0.0.0.0:60606           0.0.0.0:*               LISTEN      4200/java           
tcp        0      0 0.0.0.0:4545            0.0.0.0:*               LISTEN      4200/java           
tcp        0      0 127.0.0.1:4546          0.0.0.0:*               LISTEN      4200/java           
tcp        0      0 0.0.0.0:4547            0.0.0.0:*               LISTEN      4200/java           
```
​
Existe também um container docker em cada node, que fui informado de que será descontinuado, mas não sei ao certo a função dele:
​
```shell
[root@vrt2059 ~]# docker ps
CONTAINER ID        IMAGE                  COMMAND                  CREATED             STATUS              PORTS               NAMES
18898dbb8211        alethio/ethstats-cli   "./bin/ethstats-cli.…"   3 weeks ago         Up 4 minutes                            inspiring_murdock
```
​
