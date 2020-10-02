A RBB é uma rede público-permissionada. Há quatro tipos de nós: Boot, Validator, Writer e Observer. 
Os três primeiros tipos são nós que requerem permissão prévia, enquanto que o Observer é para o público em geral. 

A topologia da rede será análoga a da Lacchain: https://github.com/lacchain/bndes-network/blob/master/TOPOLOGY_AND_ARCHITECTURE.md


# Passo 1 - Ambiente Físico
O procedimento da Lacchain contém configuração mínima de hardware: https://github.com/lacchain/bndes-network/blob/master/DEPLOY_NODE.md

A recomendação do BID é uma VM por nó, sem docker, e que seja um SO Ubuntu 18.4 ou CentOS7. O BNDES instalou com RedHat 7, por similaridade com CentOS7. Embora não fosse uma plataforma oficialmente "homologada" pela Lacchain, nenhum problema foi encontrado.

# Passo 2 - Criação de Nós
BNDES possui 2 VMs Validator, 1 VM Boot e 1 VM Writer. 
As VMs precisam ter IPs públicos para serem acessível na Internet. Além disso, precisam ter o mesmo IP outbound e inbound. 
Não há no momento nenhum nó Observer.

Para instalar os nós, seguir o procedimento da Lacchain: https://github.com/lacchain/bndes-network/blob/master/DEPLOY_NODE.md
É possível configurar mais de um nó ao mesmo tempo utilizando o script do Ansible descrito pela Lacchain.
<<FALTA INCLUIR AS NOSSAS DIFERENÇAS APÓS ANÁLISE DA LACCHAIN>>

ChainID da RBB: 648629

![GitHub Logo](./network_diagram_rbb.png)


Recomendação é instalar o Orion, mas não iniciar o serviço.

Todas as VMS do BNDES estão DMZ de blockchain do BNDES, uma vez que todos os nós podem receber conexões externas.

O processo de instalação de cada nó gera a chave privada em lacchain/data/key. Essa chave privada está associada a chave pública do nó, que compõe o seu enode. A chave pode ser regerada posteriormente, se necessário, mas isso impactará o enode do nó. Assim como qualquer chave privada da rede, é necessário ter um mecanismo interno para geri-la (ver passo 5). 


# Passo 3 - Filtros de Rede
Os nós do validadores devem ser conectáveis entre si, ao boot node e aos nós validadores e boot node do BID pelas portas 60606 TCP/UDP (ver figura acima da rede). 

- A porta 60606 do writer deve estar aberta para o boot node do BNDES e do BID.
- A porta 60606 do boot node deve estar aberta para aceitar conexão de qualquer IP.
- Não é necessário abrir a porta 4040, pois não temos a previsão de usar transações privadas (Orion) nesse momento.

- O writer node deve também ter aberta para a Internet a porta aberta 4545. Essa porta é equivalente a porta 8545 utilizada no Geth. Ou seja, é a porta que os dApps se comunicam com o nó writter para enviar transações e fazer consultas. <<REAVALIAR ESSA RECOMENDAÇÃO>>

# Passo 4 (opcional) - Instalação de Dapp de permissionamento

O Dapp de permissionamento permite visualizar quem são as contas Administradoras da rede, visualizar as regras de permissionamento para contas e para nós. 

A Lacchain fez pequenas mehorias no Dapp de permissionamento da plataforma Besu. Para instalar o Dapp siga o seguinte procedimento: https://github.com/lacchain/permissioning-smart-contracts

Atenção: é necessário implantar o branch beta1.

Endereço do contrato de permissionamento de nós: 0x0000000000000000000000000000000000009999

Endereço do contrato de permissionamento de contas: 0x0000000000000000000000000000000000008888

Embora exista, o contrato de permissionamento de contas ainda não está sendo utilizado na prática.

Caso precise gerar uma conta admin, é possível fazê-lo usando qualquer forma de geração de conta Ethereum, como via Metamask. É importante ter um processo interno para gerir as contas blockchain. 

# Passo 5 - Gestão de chaves

Conforme mencionado no passo 2, é necessário ter um procedimento interno para gerir as chaves privadas associadas a RBB. Essas chaves podem ser de nodes, do app de permissionamento ou associadas ao uso de smart contracts específicos. 


# Passo 6 (opcional) - Instalação de outras ferramentas

Instalação de:
- transaction explorer (aleth.io), 
- monitoring tools (grafana e prometheus) - precisa mudar arquivo de configuração para indicar onde está prometheus




