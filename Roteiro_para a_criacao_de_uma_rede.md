# Roteiro para a criação de uma rede

## Atividades em paralelo para todas as instituições

### Pré-requisitos

### Gerar enodes e endereços
- Para cada participante, gerar concomitantemente aos outros participantes, os endereços e as chaves públicas e privadas dos próprios nós.
[Utilizar um comando para a geração dos endereços e chaves]

- Compartilhar enodes e endereços no arquivo XXXX. 

## Atividades da instituição genesis
Explicar que uma das instituições deverá realizar atividades específicas sozinha, levantando os primeiros nós, inclusive. 

### Atividades prévias
- Compartilhar o genesis.json gerado pelo validador com todas as instituições.
- Executar sub-roteiro "Ajustar genesis e static-nodes".
- Executar sub-roteiro "Levantar os nós".

### Implantar os smart contracts de permissionamento 
Implantar com todos os nós já permissionados.

### Atividades complementares
- Executar sub-roteiro "Levantar DApp de permissionamento".
- Executar sub-roteiro "Levantar monitoração".
- Executar sub-roteiro "Levantar block explorer".

## Para cada outra instituição da rede

- Executar sub-roteiro "Ajustar genesis e static-nodes".

### Ajuste de regras de firewall
- Abrir as próprias regras de firewall.

### Atividades de cada membro que já estava na rede
- Para cada um dos membros que já esteja na rede.
   - Adicionar regras de firewall. 
   - Incluir novo validador no static-node do seu validador.

### Atividades após os ajustes de firewall
- Executar sub-roteiro "Levantar os nós".
- Executar sub-roteiro "Levantar DApp de permissionamento".
- Executar sub-roteiro "Levantar monitoração".
- Executar sub-roteiro "Levantar block explorer".

## Sub-roteiros

### Ajustar genesis e static-nodes
- Substituir os genesis gerados pelo genesis que foi compartilhado.
- Incluir no genesis do próprio boot a lista de todos os boots. 
- Criar um static-nodes para o próprio validador com os validadores das outras instituições e o próprio boot (usando IP interno).
- Criar um static-nodes para o próprio writer com o próprio boot (usando IP interno).

### Levantar os nós
Comandos a serem executados (docker up, eu acho).

### Levantar DApp de permissionamento

### Levantar monitoração

### Levantar block explorer






==================================================================================================
==================================================================================================
==================================================================================================
- 
- Dado um template de genesis.json, o endereço desse validador e uma lista de enodes dos validadores e boots (as listas são obtidas pelo arquivo compartilhado, mencionado na 2ª etapa), respectivamente, deve-se gerar no genesis.json o extradata e gerar o arquivo static-nodes.json correspondente ao validador e correspondente ao boot; [Utilizar um comando para gerar o genesis.json e os arquivos static-nodes.json conforme descrito nesta etapa]


4. Após todos terem informado os enodes, endereços, IPs e portas dos nós no arquivo compartilhado, adicionar nas regras de Firewall, os IPs e portas de todos os outros nós;
5. 6. Para todos os outros participantes, inserir uma cópia do genesis.json e do static-nodes.json correspondente ao nó a ser iniciado na VM.
7. Levantar os nós; [Utilizar um comando para essa etapa]

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
