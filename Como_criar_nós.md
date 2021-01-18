A RBB implementada em Hyperledeger Besu é uma rede público-permissionada. Foi implementada utilizando a tecnologia do projeto Lacchain (https://www.lacchain.net/), mas com nós predominantemente nacionais. O BID, como líder do projeto Lacchain, está na rede para auxiliar no desenvolvimento do projeto.


# Passo 1 - Ambiente Físico
O procedimento da Lacchain contém configuração mínima de hardware: https://github.com/lacchain/bndes-network/blob/master/DEPLOY_NODE.md

A recomendação do BID é uma VM por nó, sem docker, e que seja um SO **Ubuntu 18.4** ou **CentOS7**. 

O BNDES instalou com **RedHat 7**, por similaridade com CentOS7. Embora não fosse uma plataforma oficialmente homologada pela Lacchain, nenhum problema foi encontrado.

# Passo 2 - Criação de Nós

Há quatro tipos de nós: Boot, Validator, Writer e Observer. Cada instituição participante pode ter zero, um ou mais nós de um mesmo tipo.

As VMs precisam ter IPs públicos para serem acessíveis na Internet. Além disso, precisam ter o mesmo IP outbound e inbound. 

Para instalar os nós, seguir o procedimento da Lacchain: https://github.com/lacchain/bndes-network/blob/master/DEPLOY_NODE.md, até a parte "Checking your connection". Orion será instalado, mas não inicializado. Não será possível verificar a conexão ainda. 

Ao fim da instalação, veja como conferir o resultado com este [procedimento](detalhamento_comandos_Besu.md).

É possível configurar mais de um nó ao mesmo tempo utilizando o script do Ansible descrito pela Lacchain. O ChainID da RBB já está configurado nos scripts para 648629. 

Todas as VMS do BNDES estão DMZ de blockchain do BNDES, uma vez que todos os nós podem receber conexões externas.


# Passo 3 - Filtros de Rede

A figura abaixo reflete a topologia da rede quando só havia BNDES e BID como nós. As conexões peer-to-peer são na porta 60606 TCP/UDP. A topologia da rede será análoga a da Lacchain: https://github.com/lacchain/bndes-network/blob/master/TOPOLOGY_AND_ARCHITECTURE.md

![GitHub Logo](./network_diagram_rbb.png)

As seguintes regras de abertura de firewall devem ser consideradas para uma instituição que terá nós da RBB.

Para a porta 60606:
- R1 - Conexão entre nós internos de sua rede da instituição: validadores e boot | boot e writers
- R2 - Todos os nós da instituição precisam se conectar aos boots de outras instituições
- R3 - Todos os boots de outras instituições precisam se conectar a todos os nós da instituição
- R4 - Todos os validadores da instituição precisam se conectar a todos os validadores de outras instituições
- R5 - Todos os validadores de outras instituições precisam se conectar a todos os validadores da instituição

Para a porta 4040:
- Não é necessário abrir, pois não temos a previsão de usar transações privadas (Orion) nesse momento.

Para a porta 4545:
- O writer node deve também ter aberta a porta aberta 4545 (ou 443, em evolução) para um conjunto restrito de IPs. Essa porta é equivalente a porta 8545 utilizada no Geth. Ou seja, é a porta que os dApps se comunicam com o nó Writer para enviar transações e fazer consultas. Fica a critério e responsabilidade da instituição instaladora ampliar o conjunto de IPs, por exemplo, para toda sua rede interna ou até mesmo para Internet, de acordo com sua necessidade.

Para a porta 9091:
- Todos os nós precisam poder enviar estatísticas via a porta 9091.

Para obter os detalhes de IPs de máquinas -> favor entrar em contato com blockchaingov@bndes.gov.br.

# Passo 4 - Gestão de chaves

O processo de instalação de cada nó gera a chave privada em ``/root/lacchain/data/key``. Essa chave privada está associada a chave pública do nó, que compõe o seu enode. A chave pode ser regerada posteriormente, se necessário, mas isso impactará o enode do nó. 

Além das chaves dos nós, no futuro podem ser criadas chaves privadas para permissionamento (ver passo 5) ou para o uso de smart contracts específicos.

É necessário ter um mecanismo interno para gerir essas chaves privadas: onde armazenar a chave, quem tem acesso, mecanismo de recuperação etc. 

# Passo 5 (opcional) - Instalação de Dapp de permissionamento

O Dapp de permissionamento é um frontend que permite visualizar quem são as contas Administradoras da rede, visualizar as regras de permissionamento para contas e para nós. 

A Lacchain fez pequenas mehorias no Dapp de permissionamento da plataforma Besu. Para instalar o Dapp siga o seguinte procedimento: https://github.com/lacchain/permissioning-smart-contracts

Atenção: é necessário implantar o branch beta1.

Endereço do contrato de permissionamento de nós: 0x0000000000000000000000000000000000009999

Endereço do contrato de permissionamento de contas: 0x0000000000000000000000000000000000008888

Embora exista, o contrato de permissionamento de contas ainda não está sendo utilizado na prática.

O Dapp está instalado intermanente no BNDES na url https://rbb-permissioning.dsv.bndes.net/

Para criar novas regras de permissionamento, é necessário ter uma conta blockchain autorizada. 
É possível utilizar qualquer forma de geração de conta Ethereum, como via Metamask. 

# Passo 6 - Permissionamento dos novos nós

É necessário permissionar o(s) novo(s) nó(s) para participar na rede. Essa ação é realizada utilizando o Dapp de permissionamento.
É possível ser permissionado de duas formas:

* solicitando para uma instituição participante da RBB com conta blockchain de permissionamento ou 
* usando o Dapp instalado no Passo 5 com conta blockchain de permissionamento. 

# Passo 7 - Verificar Conexão na Rede

Siga o procedimento de **"Checking your connection"** da Lacchain: https://github.com/lacchain/bndes-network/blob/master/DEPLOY_NODE.md. 
É possível que esse link ajude: https://github.com/lacchain/besu-network/issues/33


# Passo 8 (opcional) - Instalação de Ferramenta de Monitoração

A monitoração da rede está disponível pelo Grafana do BID.
BNDES instalou Prometheus (contém todos os dados monitoráveis), Grafana (para exibir um dashboard bonito) e Zabbix (para monitoração interna e alarmes).

# Passo 9 (opcional) - Instalação de Block Explorer

BID disponibiliza block explorer da rede.
BNDES ainda não fez instalação de Block Explorer da Lacchain (aleth.io)

# Contato

Em caso de dúvidas ou comentários, por favor, enviem e-mail para blockchaingov@bndes.gov.br.


# Comentário adicionais

BNDES e BID conversaram sobre algumas possibilidades de aumentar a resilência dos nós. Infelizmente, não é possível configurar mais de um IP para o mesmo nó (dado que o IP é usado para o enode) ou fazer um DNS para deixar os nós independentes de IP. Uma possibilidade natural é configurar vários nós de um mesmo tipo e usar um Load Balancer de forma a deixar os vários IPs transparente para o usuário. 



