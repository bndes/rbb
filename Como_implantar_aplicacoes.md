A implantação de aplicações na RBB segue o mesmo roteiro de https://github.com/lacchain/bndes-network/blob/master/DEPLOY_APPLICATIONS.md, com as seguintes observações:

* O link explica como fazer o deploy na rede da Lacchain usando a plataforma Hyperledger Besu. O deploy na RBB do Hyperledger Besu segue os mesmos passos;
* O roteiro já está atualizado para contemplar o network_id da RBB, que é 648629;
* A versão inicial do roteiro foi escrito há algum tempo, então as versões utilizadas para node, npm, solidity etc podem ser maiores. Por exemplo, os códigos mais recentes do Solidity já usam "pragma solidity 0.8"; Pode acontecer de o truffle reclamar que a versão do smart contract é diferente da esperada. Se for o caso, modifique a primeira linha do contrato de teste "praga solidity" para a versão padrão do truffle;
* A <PRIVATE_KEY> referenciada é a chave privada da conta ("account") que submeterá a transação para a rede blockchain da RBB. As contas da RBB são totalmente compatíveis com contas Ethereum. Assim, é possível usar o Metamask para gerar uma conta para a RBB;
* Contacte BNDES ou outro envolvido na RBB para conhecer como usar o <ADDRESS_IP_NODE>:<PORT_RPC_NODE> ou <YOUR_IP_NODE>;
* O link final de "Send Transactions To LACCHAIN" realmente ainda está não funcional.
