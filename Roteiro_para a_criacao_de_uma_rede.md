# Roteiro para a criação de uma rede

Para os roteiros a seguir algumas premissas precisam ser válidas, são elas:

1. Não haverá discovery para validador e boot nodes.
2. Sendo assim, serão necessários 2 arquivos static-nodes.json. Um para o validador e outro para o boot.
    * O static-nodes.json para o validador conterá apenas enodes do tipo validador e boot.
    * O static-nodes.json para o boot conterá apenas enodes do tipo validador, boot, boot-observer e writer.

## Sugestão de roteiro para a criação de uma rede local na mesma máquina virtual (VM) sem permissionamento

1. Gerar os endereços e as chaves públicas e privadas dos próprios nós; [Utilizar um comando para essa etapa]
2. Dado um template de genesis.json, os endereços dos validadores e os enodes dos validadores e boots criados na etapa anterior, respectivamente, gerar no genesis.json o extradata e gerar o arquivo static-nodes.json correspondente ao validador e correspondente ao boot; [Utilizar um comando para gerar o genesis.json e os arquivos static-nodes.json conforme descrito nesta etapa]
3. Levantar os nós; [Utilizar um comando para essa etapa]

## Sugestão de roteiro para a criação de uma rede local em diferentes máquinas virtuais sem permissionamento

1. Para cada máquina virtual, gerar concomitantemente às outras VMs, os endereços e as chaves públicas e privadas dos próprios nós. Deve-se informar nesta etapa quais tipos de nós se quer executar em cada VM; [Utilizar um comando para a geração dos endereços e chaves]
2. Em apenas uma máquina virtual e dado um template de genesis.json, os endereços dos validadores e os enodes dos validadores e boots criados na etapa anterior, respectivamente, gerar no genesis.json o extradata e gerar o arquivo static-nodes.json correspondente ao validador e correspondente ao boot; [Utilizar um comando para gerar o genesis.json e os arquivos static-nodes.json conforme descrito nesta etapa]
3. Caso necessário, adicionar nas regras de Firewall de cada VM, os IPs e portas dos outros nós;
4. Em cada máquina virtual, inserir uma cópia do genesis.json e do static-nodes.json - correspondente ao nó a ser iniciado na VM - gerados na 2ª etapa;
5. Levantar os nós; [Utilizar um comando para essa etapa]

## Sugestão de roteiro para a criação de uma rede conjunta com permissionamento

1. Para cada participante, gerar concomitantemente aos outros participantes, os endereços e as chaves públicas e privadas dos próprios nós; [Utilizar um comando para a geração dos endereços e chaves]
2. Adicionar em um arquivo compartilhado com os outros participantes da rede, os endereços e enodes de todos os próprios nós gerados na etapa anterior;
3. Após todos terem informado os enodes, endereços, IPs e portas dos nós no arquivo compartilhado, adicionar nas regras de Firewall, os IPs e portas de todos os outros nós;
4. Apenas um participante (o primeiro validador a ser iniciado) e dado um template de genesis.json, o endereço desse validador e uma lista de enodes dos validadores e boots (as listas são obtidas pelo arquivo compartilhado, mencionado na 2ª etapa), respectivamente, deve-se gerar no genesis.json o extradata e gerar o arquivo static-nodes.json correspondente ao validador e correspondente ao boot; [Utilizar um comando para gerar o genesis.json e os arquivos static-nodes.json conforme descrito nesta etapa]
5. Para todos os outros participantes, inserir uma cópia do genesis.json e do static-nodes.json correspondente ao nó a ser iniciado na VM.
6. Levantar os nós; [Utilizar um comando para essa etapa]

## Sugestão de roteiro para a adição de um nó em uma rede conjunta

### Tarefas dos nós a serem inseridos na rede

1. Gerar os endereços e as chaves públicas e privadas dos próprios nós; [Utilizar um comando para essa etapa]
2. Adicionar em um arquivo compartilhado com os outros participantes da rede, os endereços e enodes de todos os próprios nós gerados na etapa anterior;
3. Adicionar nas regras de Firewall os IPs e portas de todos os outros nós;
4. Obter genesis.json já pronto no repositório compartilhado;
5. Levantar os nós; [Utilizar um comando para essa etapa]

### Tarefas dos nós já existentes na rede

1. Adicionar nas regras de Firewall os IPs e portas dos novos nós;
2. Um participante com acesso administrador no dApp de permissionamento deve inserir o novo nó no permissionamento;
3. Inserir no arquivo static-nodes.json os enodes dos novos nós e executar o comando add_peer para os novos nós; [Utilizar um comando para essa etapa];

Dessa forma, ao criar os comandos sugeridos acima, acredita-se ser possível generalizar o script tanto para criar uma rede local, tanto para criar uma rede conjunta e, ainda, adicionar nós em uma rede já existente.

Uma problemática para o modelo de script em que todos os nós são iniciados juntos é o permissionamento. Não é possível iniciar todos os nós com o permissionamento habilitado e já conectá-los produzindo blocos.

Motivo:

```solidity
    if(getContractAddress(RULES_CONTRACT) == address(0)) {
        //reject connection
        return 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    }
```

Há 2 alternativas para tratar essa problemática:

1. Levantar os nós com permissionamento desabilitado para produzir blocos, instalar as regras de permissionamento com os nós permitidos e, em seguida, reiniciar os nós com o permissionamento habilitado.
2. Gerar um extradata com apenas um validador, iniciar os nós com o permissionamento já habilitado e instalar as regras de permissionamento com os nós permitidos no único validador.
