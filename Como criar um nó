A RBB é uma rede público-permissionada. Há quatro tipos de nós: Boot, Validator, Writer e Observer. 
Os três primeiros tipos são nós que requerem permissão prévia, enquanto que o Observer é para o público em geral. 

A topologia da rede será análoga a da Lacchain: https://github.com/lacchain/besu-network/blob/master/TOPOLOGY_AND_ARCHITECTURE.md

O BNDES possui 4 nós: 2 expostos para internet na DMZ de blockchain, chamada de dmz2-blockchain, e 2 que poderiam ficar numa rede "não-DMZ", sempre conectáveis aos nós expostos da DMZ.
Os papéis a serem colocados na DMZ são Boot e Writer. Na rede "não-DMZ", serão instalados 2 nós Validadores. No momento não teremos nós com o tipo Observer.

* Passo 1 - Criação das Ambiente Físico
O procedimento da Lacchain contém configuração mínima de hardware: https://github.com/lacchain/besu-network/blob/master/DEPLOY_NODE.md
A recomendação do BID é uma VM por nó e que seja um SO Ubuntu 18.4 ou CentOS7. O BNDES está instalando com RedHat 7.

* Passo 2 - Criação de Nós
2 VMs deverão ser alocadas na DMZ de blockchain, com conectividade para Internet/IPs externos, ter o mesmo IP outbound e inbound. 
As outras 2 VMs podem ficar numa rede "não-DMZ" e deverão ser capazes de se conectar com as VMs da DMZ.

Para instalar os nós, seguir o procedimento da Lacchain: https://github.com/lacchain/besu-network/blob/master/DEPLOY_NODE.md

Para a RBB:
ChainID - 
Inventory - 

Recomendação é instalar o Orion, mas não startar o serviço.
O processo de instalação de cada nó gerará a chave privada em Lacchain/data/privatekey. É necessário ter um mecanismo para gerir essa chave. Importante: pelo que entendi, a chave pode ser regerada se quisermos.


* Passo 3 - Filtros de Rede:
Os nós internos devem ser conectáveis entre si, ao boot node da DMZ e aos nós validadores e boot node do BID pelas portas 60606 TCP/UDP. Falta pegar IPs dos nós do BID.
A porta 60606 do writer deve estar aberta para o boot node do BNDES e do BID.
A porta 60606 do boot node deve estar aberta para aceitar conexão de qualquer IP.
O writer node deve também ter aberta para a Internet a porta aberta 4545. Essa porta é equivalente a porta 8545 utilizada no Geth. Ou seja, é a porta que os dApps se comunicam com o nó writter para enviar transações e fazer consultas. Não é necessário abrir a porta 4040, pois não temos a previsão de usar o Orion para transações privadas.

* Passo 4 (opcional) - Ferramentas adicionais
Instalação de:
- transaction explorer (aleth.io), 
- monitoring tools (grafana e prometheus) - precisa mudar arquivo de configuração para indicar onde está prometheus
- dapp de permissionamento.




