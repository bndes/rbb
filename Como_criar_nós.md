A RBB implementada em Hyperledeger Besu é uma rede público-permissionada. Foi implementada utilizando a tecnologia do projeto Lacchain (https://www.lacchain.net/), mas com nós predominantemente nacionais. O BID, como líder do projeto Lacchain, está na rede para auxiliar no desenvolvimento do projeto.


# Passo 1 - Ambiente Físico
O procedimento da Lacchain contém configuração mínima de hardware: https://github.com/lacchain/bndes-network/blob/master/DEPLOY_NODE.md

A recomendação do BID é uma VM por nó, sem docker, e que seja um SO **Ubuntu 18.4** ou **CentOS7**. 

O BNDES instalou com **RedHat 7**, por similaridade com CentOS7. Embora não fosse uma plataforma oficialmente homologada pela Lacchain, nenhum problema foi encontrado.

Verifique se o relógio do seu servidor está com a hora correta. É recomendável que ele esteja sincronizado com um servidor NTP conhecido (pela porta *123/udp*), por exemplo, o pool.ntp.br. Caso contrário, erros na sincronização podem ocorrer com a mensagem "invalid checkpoint headers".

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

Para a porta 60606 (TCP e UDP):
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

Para a porta 123 (udp):
- Todos os nós precisam estar com seus relógios sincronizados com um servidor NTP confiável

Para obter os detalhes de IPs de máquinas -> favor entrar em contato com blockchaingov@bndes.gov.br.

# Passo 4 - Gestão de chaves

O processo de instalação de cada nó gera a chave privada em ``/root/lacchain/data/key``. Essa chave privada está associada a chave pública do nó, que compõe o seu enode. A chave pode ser regerada posteriormente, se necessário, mas isso impactará o enode do nó. Perceba que a chave privada é salva sem criptografia.
É possível conferir a chave pública do seu nó no log (nível INFO) ou executando o comando ``admin_nodeInfo``. 

A conta blockchain associada ao nó está salva em ``/root/lacchain/data/nodeAddress``. Ela será necessária no momento do permissionamento (Passos 5 e 6).

Além das chaves dos nós, no futuro podem ser criadas chaves privadas para permissionamento (ver passo 5) ou para o uso de smart contracts específicos.

É necessário ter um mecanismo interno para gerir essas chaves privadas: onde armazenar a chave, quem tem acesso, mecanismo de recuperação etc. 

# Passo 5 (opcional) - Instalação de Dapp de permissionamento

O Dapp de permissionamento é um frontend que permite visualizar quem são as contas Administradoras da rede, visualizar as regras de permissionamento para contas e para nós. 

A Lacchain fez pequenas mehorias no Dapp de permissionamento da plataforma Besu. Para instalar o Dapp siga o seguinte procedimento: https://github.com/lacchain/permissioning-smart-contracts

Atenção: é necessário implantar o branch beta1.

Observação: O dapp apresenta as informações truncadas, mas é possível copiar e colar para ver a informação completa. Além disso, atenção porque o dapp exibe a informação de Public_key com um string "0x" no metade do valor. Ex.: a public key
0xd2c9170ace6301fe416b636c0f91816b7a9184c29562b55dfbcbbb48305d6717322c07a1e0d0432b89c1bef468f93963cd94a4ec2d90cd5d53f6e16b3767c390 é exibida como 
0xd2c9170ace6301fe416b636c0f91816b7a9184c29562b55dfbcbbb48305d67170x322c07a1e0d0432b89c1bef468f93963cd94a4ec2d90cd5d53f6e16b3767c390.

O Dapp está instalado internamente no BNDES na url https://rbb-permissioning.dsv.bndes.net/

Para criar novas regras de permissionamento, é necessário ter uma conta blockchain autorizada. 
É possível utilizar qualquer forma de geração de conta Ethereum, como via Metamask. 

Endereço do contrato de permissionamento de nós: 0x0000000000000000000000000000000000009999

Endereço do contrato de permissionamento de contas: 0x0000000000000000000000000000000000008888

Embora exista, o contrato de permissionamento de contas ainda não está sendo utilizado na prática.


# Passo 6 - Permissionamento dos novos nós

É necessário permissionar o(s) novo(s) nó(s) para participar na rede. Essa ação é realizada utilizando o Dapp de permissionamento.
É possível ser permissionado de duas formas:

* solicitando para uma instituição participante da RBB com conta blockchain de permissionamento informando os e-nodes e as contas blockchain dos nós ou 
* usando o Dapp instalado no Passo 5 com a conta blockchain de permissionamento referenciada também no passo 5. 

Caso algum bootnode seja adicionado, é importante que nós existentes da rede alterem a configuração do config.toml de forma a incluir o enode do novo bootnode. É necessário reiniciar cada nó para que a leitura do bootnode seja realizada.


# Passo 7 - Primeira sincronização do bootnode

O bootnode pode apresentar um comportamento diferente dos demais nós e não conseguir sincronizar automaticamente.

Portanto, para a primeira sincronização do bootnode, pode ser necessário remover temporiamente o parâmetro ``--permissions-nodes-contract-enabled`` do script ``start-pantheon.sh`` e depois reativá-lo após o término da sincronização.

Adicionar manualmente os novos nós em nós já sincronizados da rede pela API rpc com o comando ``admin_addpeer`` pode ser útil, embora não seja o desejado. Exemplo:
``admin.addPeer('enode://c1a07558238c0b31657450dd34a558752d63150ce334f3e99b9187
262b612f48a713a083cd1601bfe3bba761a908264320885633fa81d6d6ca0ef7a6e84a2bcd
@[127.0.0.1]:30301')``


# Passo 8 - Verificar Conexão na Rede

Siga o procedimento de **"Checking your connection"** da Lacchain: https://github.com/lacchain/bndes-network/blob/master/DEPLOY_NODE.md. 

Opcionalmente, esse link também pode ajudar: https://github.com/lacchain/besu-network/issues/33


# Passo 9 (opcional) - Verificar Boot Nodes em Uso

Para cada um dos nós Validators e Writers, verifique no arquivo `/root/lacchain/config.toml`, o valor atribuído a variável `bootnodes`.

Por exemplo, 

``
bootnodes=[  "enode://c1c9170ace6301fe416b636c0f91816b7a9184c29562b55dfbcbbb48305d6717322c07a1e0d0432b89c1bef468f93963cd94a4ec2d90cd5d53f6e16b3767c328@172.17.64.20:60606",
"enode://91ca844776cc9bf69cd4eadaeefdf105815b61ec7ba0fef0ab3fc0c954a8af3bfbbdbc9975ca8cd6d1bd366bcd69df2066f2ed17bed4d1c53164d46e94afa03b@35.188.197.198:60606",
"enode://75f63faf602474d4de328c65a3f2b63a6b50f08b7786446dd43016bc6700889d4f4efb36f600c93fe0ce4ea6d4310a6fa10048e8130a5055c4ef0969c740945e@200.198.62.154:60606",
]``

Essa variável indica quais Bootnodes podem ser utilizados quando o nó iniciar. 

Confirme que esses são os bootnodes que você julga adequado. Por exemplo, caso você esteja subindo um Bootnode, confirme que o enode dele aparece nesta listagem. 

Para testar a mudança, reinicialize o nó. 


# Passo 10 - Inclusão de Validadores no Algoritmo de Consenso

Se novos validadores forem adicionados é necessário disparar uma votação de forma a incluí-los no algoritmo de consenso. Para isso, deve-se seguir o procedimento https://besu.hyperledger.org/en/stable/HowTo/Configure/Consensus-Protocols/IBFT/#adding-and-removing-validators-by-voting.
Algumas observações importantes:
* Os comandos devem ser disparados usando os consoles dos validadores que atualmente participam do algoritmo de consenso da rede. 
* Será necessário informar as contas blockchain dos novos validadores, que podem ser encontradas em: ``/root/lacchain/data/nodeAddress``. Caso esse arquivo esteja inválido por algum motivo, é possível regerá-lo usando ``pantheon --data-path=/root/lacchain/data public-key export-address --to=/root/lacchain/data/nodeAddress!``.
* A votação precisa ocorrer dentro de um período de uma mesma "época", e o tamanho da época é definida no arquivo genesis. Considerando as configurações atuais da rede, cada época dura cerca de 16h. 



# Passo 11 (opcional) - Instalação de Ferramenta de Monitoração

A monitoração da rede está disponível pelo Grafana do BID.
BNDES instalou Prometheus (contém todos os dados monitoráveis), Grafana (para exibir um dashboard bonito) e Zabbix (para monitoração interna e alarmes).


# Passo 12 (opcional) - Instalação de Block Explorer

BID disponibiliza block explorer da rede, chamado aleth.io. O block explorer pode ser acessado em: http://35.184.17.253

A instalação do Block Explorer pode ser realizada pelo seguinte procedimento: https://github.com/Alethio/ethereum-lite-explorer.
Após a instalação padrão, é possível incluir a informação de quais validadores assinaram cada bloco ao adicionar o arquivo ``config.ibft2.json`` disponível em: https://github.com/Alethio/ethereum-lite-explorer#building-from-source.

# Contato

Em caso de dúvidas ou comentários, por favor, enviem e-mail para blockchaingov@bndes.gov.br.


# Comentário adicionais

BNDES e BID conversaram sobre algumas possibilidades de aumentar a resilência dos nós. Infelizmente, não é possível configurar mais de um IP para o mesmo nó (dado que o IP é usado para o enode) ou fazer um DNS para deixar os nós independentes de IP. Uma possibilidade natural é configurar vários nós de um mesmo tipo e usar um Load Balancer de forma a deixar os vários IPs transparente para o usuário. 



